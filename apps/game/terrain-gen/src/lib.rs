//! Deterministic procedural terrain generator for the game world.
//!
//! Produces a Minecraft-style **heightmap** terrain (no caves/overhangs, no
//! structures): for every world column `(x, z)` it yields
//!   - a **height** in blocks (`u8`, `0..MAX_HEIGHT`), shaped by Perlin/fBm noise, and
//!   - a **biome** id (`u8`), assigned by a Voronoi partition of the world.
//!
//! It is built as a dependency-free `#![no_std]` `cdylib` for
//! `wasm32-unknown-unknown`, so the produced `.wasm` has **no imports** and the
//! Bun server can instantiate it with an empty import object — no `wasm-bindgen`,
//! no JS glue.
//!
//! ## ABI
//! One static `[u8; AREA*2]` output buffer lives in linear memory. The host:
//!   1. calls [`generate_chunk`]`(seed, cx, cz)`, which fills the buffer and
//!      returns a pointer to its start, then
//!   2. reads [`chunk_bytes`] bytes from `instance.exports.memory` at that pointer.
//!
//! Layout of the buffer: `[ heights: u8 * AREA ][ biomes: u8 * AREA ]`, columns
//! in row-major order (`index = lz * CHUNK + lx`).
//!
//! Determinism: pure integer/float arithmetic seeded by an integer hash; wasm
//! f32 ops are deterministic across runtimes, so the same `(seed, cx, cz)` always
//! yields byte-identical output on any host.

#![no_std]

use core::panic::PanicInfo;
use core::ptr::addr_of_mut;

#[panic_handler]
fn panic(_: &PanicInfo) -> ! {
    loop {}
}

// --------------------------------------------------------------------- constants

/// Side length of a chunk in blocks (columns per side).
const CHUNK: i32 = 16;
/// Columns per chunk.
const AREA: usize = (CHUNK * CHUNK) as usize; // 256
/// Vertical block range. Heights are clamped to `1..MAX_HEIGHT-1` so a `u8` holds them.
const MAX_HEIGHT: f32 = 128.0;
/// Number of distinct biomes the Voronoi partition selects from.
const NUM_BIOMES: u32 = 6;
/// Average size (in blocks) of a Voronoi region — controls biome patch scale.
const REGION: f32 = 192.0;
/// Horizontal frequency of the height noise — smaller = larger, smoother features.
const HEIGHT_FREQ: f32 = 0.0075;
/// Octaves summed for the fractal Brownian motion height field.
const OCTAVES: u32 = 5;

/// Output buffer: `AREA` heights followed by `AREA` biome ids.
static mut OUT: [u8; AREA * 2] = [0; AREA * 2];

// -------------------------------------------------------------------- math utils

/// Integer hash of a 2D coordinate + seed → well-mixed `u32` (xxhash-style mix).
#[inline]
fn hash2(x: i32, z: i32, seed: u32) -> u32 {
    let mut h = seed ^ 0x9E37_79B9;
    h = h.wrapping_add((x as u32).wrapping_mul(0x85EB_CA6B));
    h ^= h >> 13;
    h = h.wrapping_add((z as u32).wrapping_mul(0xC2B2_AE35));
    h ^= h >> 16;
    h = h.wrapping_mul(0x27D4_EB2F);
    h ^= h >> 15;
    h
}

/// Map a hash to a float in `[0, 1)`.
#[inline]
fn rand01(h: u32) -> f32 {
    (h >> 8) as f32 / ((1u32 << 24) as f32)
}

/// `floor` for `f32` without pulling in `libm` (valid for the finite range we use).
#[inline]
fn floorf(v: f32) -> f32 {
    let i = v as i32;
    if (i as f32) > v {
        (i - 1) as f32
    } else {
        i as f32
    }
}

/// One of 8 gradient directions, dotted with the offset vector — classic Perlin.
#[inline]
fn grad(h: u32, x: f32, z: f32) -> f32 {
    match h & 7 {
        0 => x + z,
        1 => x - z,
        2 => -x + z,
        3 => -x - z,
        4 => x,
        5 => -x,
        6 => z,
        _ => -z,
    }
}

/// Perlin quintic fade curve `6t^5 - 15t^4 + 10t^3`.
#[inline]
fn fade(t: f32) -> f32 {
    t * t * t * (t * (t * 6.0 - 15.0) + 10.0)
}

#[inline]
fn lerp(a: f32, b: f32, t: f32) -> f32 {
    a + (b - a) * t
}

/// 2D Perlin gradient noise in roughly `[-1, 1]`.
fn perlin(x: f32, z: f32, seed: u32) -> f32 {
    let x0 = floorf(x);
    let z0 = floorf(z);
    let xi = x0 as i32;
    let zi = z0 as i32;
    let xf = x - x0;
    let zf = z - z0;
    let u = fade(xf);
    let v = fade(zf);

    let n00 = grad(hash2(xi, zi, seed), xf, zf);
    let n10 = grad(hash2(xi + 1, zi, seed), xf - 1.0, zf);
    let n01 = grad(hash2(xi, zi + 1, seed), xf, zf - 1.0);
    let n11 = grad(hash2(xi + 1, zi + 1, seed), xf - 1.0, zf - 1.0);

    lerp(lerp(n00, n10, u), lerp(n01, n11, u), v)
}

/// Fractal Brownian motion: `OCTAVES` of Perlin at doubling frequency, normalised
/// to roughly `[-1, 1]`.
fn fbm(x: f32, z: f32, seed: u32) -> f32 {
    let mut amp = 1.0;
    let mut freq = 1.0;
    let mut sum = 0.0;
    let mut norm = 0.0;
    let mut i = 0u32;
    while i < OCTAVES {
        sum += amp * perlin(x * freq, z * freq, seed.wrapping_add(i.wrapping_mul(1013)));
        norm += amp;
        amp *= 0.5;
        freq *= 2.0;
        i += 1;
    }
    sum / norm
}

// ----------------------------------------------------------------- terrain shape

/// Per-biome `(base, amplitude)` height shaping, in blocks. The biome's identity
/// is its terrain *behaviour*: plains/desert are flat near sea level, forest has
/// gentle hills, mountains and snow have large positive amplitude. These are
/// **blended** smoothly between neighbouring biomes (see [`column`]) so a tall
/// mountain tapers down into the desert instead of dropping off a cliff.
#[inline]
fn biome_shape(biome: u32) -> (f32, f32) {
    match biome {
        0 => (22.0, 10.0), // ocean   — well below sea level
        1 => (44.0, 6.0),  // plains  — flat, around sea level
        2 => (46.0, 7.0),  // desert  — flat, dry
        3 => (48.0, 14.0), // forest  — gentle hills
        4 => (72.0, 52.0), // mountain— tall, big positive amplitude
        _ => (88.0, 44.0), // snow    — highest peaks
    }
}

/// Softening constant for the inverse-distance blend (avoids div-by-zero and a
/// sharp spike exactly at a feature point).
const BLEND_EPS: f32 = 1.0;

/// Surface height (blocks) and biome id for a world column.
///
/// Biomes come from a jittered-grid Voronoi over the 3×3 neighbouring cells. The
/// **biome id** is the nearest feature point's region (crisp colour boundaries),
/// but the **height shaping** is a Shepard (inverse-distance²) weighted blend of
/// every nearby region's `(base, amplitude)`. Because the blended parameters and
/// the shared fBm detail are both continuous in space, the surface height is
/// continuous across biome borders — smooth slopes, no cliffs.
fn column(wx: f32, wz: f32, seed: u32) -> (u8, u8) {
    let bs = seed ^ 0x0123_4567;
    let cx = floorf(wx / REGION) as i32;
    let cz = floorf(wz / REGION) as i32;

    let mut best_d2 = f32::MAX;
    let mut best_region = 0u32;
    let mut wsum = 0.0;
    let mut base_acc = 0.0;
    let mut amp_acc = 0.0;

    let mut dz = -1;
    while dz <= 1 {
        let mut dx = -1;
        while dx <= 1 {
            let ccx = cx + dx;
            let ccz = cz + dz;
            let h = hash2(ccx, ccz, bs);
            // Feature point: cell origin jittered inside the cell.
            let fx = (ccx as f32 + rand01(h)) * REGION;
            let fz = (ccz as f32 + rand01(h.wrapping_mul(2_654_435_761))) * REGION;
            let ddx = fx - wx;
            let ddz = fz - wz;
            let d2 = ddx * ddx + ddz * ddz;

            let region = h % NUM_BIOMES;
            let (base, amp) = biome_shape(region);
            let w = 1.0 / (d2 + BLEND_EPS); // inverse-distance² weight
            wsum += w;
            base_acc += w * base;
            amp_acc += w * amp;

            if d2 < best_d2 {
                best_d2 = d2;
                best_region = region;
            }
            dx += 1;
        }
        dz += 1;
    }

    let base = base_acc / wsum;
    let amp = amp_acc / wsum;
    let t = (fbm(wx * HEIGHT_FREQ, wz * HEIGHT_FREQ, seed) + 1.0) * 0.5; // [0, 1]
    let mut hgt = base + t * amp;
    if hgt < 1.0 {
        hgt = 1.0;
    }
    if hgt > MAX_HEIGHT - 1.0 {
        hgt = MAX_HEIGHT - 1.0;
    }
    (hgt as u8, best_region as u8)
}

// ------------------------------------------------------------------------- exports

/// Number of bytes [`generate_chunk`] writes (heights + biomes). The host reads
/// exactly this many from the returned pointer.
#[no_mangle]
pub extern "C" fn chunk_bytes() -> u32 {
    (AREA * 2) as u32
}

/// Generate chunk `(cx, cz)` for `seed` into the static output buffer and return a
/// pointer to its first byte. See the module docs for the buffer layout.
#[no_mangle]
pub extern "C" fn generate_chunk(seed: u32, cx: i32, cz: i32) -> *const u8 {
    // SAFETY: single-threaded wasm; the host fully reads the buffer before the
    // next call, so there is no aliasing across calls.
    let out = unsafe { &mut *addr_of_mut!(OUT) };

    let mut li = 0usize;
    let mut lz = 0i32;
    while lz < CHUNK {
        let mut lx = 0i32;
        while lx < CHUNK {
            let wx = (cx * CHUNK + lx) as f32;
            let wz = (cz * CHUNK + lz) as f32;
            let (height, biome) = column(wx, wz, seed);
            out[li] = height;
            out[AREA + li] = biome;
            li += 1;
            lx += 1;
        }
        lz += 1;
    }
    out.as_ptr()
}
