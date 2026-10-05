#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <ip> [ip ...]" >&2
  exit 1
fi

OUT_DIR="${OUT_DIR:-./certs}"
DAYS="${DAYS:-365}"

SAN="DNS:localhost,IP:127.0.0.1"
for ip in "$@"; do
  if ! [[ "$ip" =~ ^[0-9]{1,3}(\.[0-9]{1,3}){3}$ ]]; then
    echo "Invalid IPv4 address: $ip" >&2
    exit 1
  fi
  SAN+=",IP:$ip"
done

mkdir -p "$OUT_DIR"

openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout "$OUT_DIR/key.pem" -out "$OUT_DIR/cert.pem" \
  -days "$DAYS" -subj "/CN=$1" \
  -addext "subjectAltName=$SAN" \
  -addext "basicConstraints=CA:FALSE" \
  -addext "keyUsage=digitalSignature,keyEncipherment" \
  -addext "extendedKeyUsage=serverAuth"

chmod 600 "$OUT_DIR/key.pem"

echo "Certs Generated"