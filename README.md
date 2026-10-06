_This project has been created as part of the 42 curriculum by bcabocel, nofanizz, tlutz, abonneau._

# Light Keepers

## Description

**Light Keepers** is our take on **ft_transcendence**, the final project of the 42 common core. The goal is to build a complete, production-like web application as a team: a real-time multiplayer game inside a social platform, served over HTTPS and started with a single command.

The application has two halves:

- **A social network**: sign-up and login, customizable profiles, a feed of posts (with images, replies, quotes, reposts and likes), friends and moderation, real-time presence, and a full chat (direct messages and group chats with roles, attachments and shared posts).
- **A cooperative 3D survival game**: up to 4 players fight endless waves of monsters together in a procedurally generated world. They level up, pick weapons and passive "tomes", revive each other and try to survive as long as possible. Every game is saved, so players get a game history, profile stats and a global leaderboard.

### Key features

- 🔐 JWT authentication with refresh-token rotation, password reset by email
- 👤 Profiles, friends, moderation, real-time online status
- 📝 Feed with posts, images, replies, quotes, reposts and likes
- 🔎 Search for users, posts, friends and conversations
- 💬 Real-time chat: direct messages, group chats, roles, attachments, post sharing
- 🎮 Real-time multiplayer 3D game (Babylon.js + Colyseus) with an authoritative server
- 📊 Game history, per-player statistics and leaderboard
- 🌍 6 languages, light and dark themes, responsive layout
- 🐳 Fully dockerized, HTTPS through Nginx

---

## Instructions

### Prerequisites

| Tool                                                       | Version               | Why                                                                                                                                   |
| ---------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| [Git](https://git-scm.com/)                                | any recent version    | Clone the repository and its submodules ([`transcendence-survivors`](https://github.com/transcendence-survivors) GitHub organization) |
| [Docker Engine](https://docs.docker.com/engine/install/)   | ≥ 24                  | Runs every service                                                                                                                    |
| [Docker Compose](https://docs.docker.com/compose/install/) | v2 (`docker compose`) | Orchestrates the stack                                                                                                                |
| [GNU Make](https://www.gnu.org/software/make/)             | any                   | Shortcut commands (`Makefile`)                                                                                                        |
| [OpenSSL](https://www.openssl.org/)                        | any                   | Generates the self-signed TLS certificate                                                                                             |
| A recent browser                                           | Chrome or Firefox     | WebGL 2 is required for the game                                                                                                      |

You do **not** need Node.js, pnpm or Bun on your machine: everything is built inside the containers (`node:20-alpine` and `oven/bun:1-alpine`).

### 1. Clone the repository with its submodules

```bash
git clone --recurse-submodules git@github.com:transcendence-survivors/transcendence.git
cd transcendence
# if you already cloned without submodules:
git submodule update --init --recursive
```

### 2. Configure the environment

Copy the template, then fill in the values:

```bash
cp .env.example .env.prod   # production stack (used by `make`)
cp .env.example .env.dev    # development stack (used by `make dev`)
```

| Group           | Variables                                                                                                | Notes                                                                                                                                     |
| --------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| PostgreSQL      | `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `DATABASE_URL`                                      | `DATABASE_URL` must match the three other values (host `postgres`).                                                                       |
| Secrets         | `JWT_ACCESS_TOKEN_SECRET`, `JWT_REFRESH_TOKEN_SECRET`, `JWT_GAME_TOKEN_SECRET`                           | Use long random strings, for example `openssl rand -base64 48`.                                                                           |
| Token lifetimes | `JWT_ACCESS_TOKEN_EXPIRATION_S`, `JWT_REFRESH_TOKEN_EXPIRATION_S`, `RESET_PASSWORD_TOKEN_EXPIRATION_S`   |                                                                                                                                           |
| URLs            | `FRONTEND_URL`, `API_URL`, `API_INTERNAL`, `CHAT_SOCKET_URL`, `GAME_SOCKET_URL`, `MINIO_PUBLIC_ENDPOINT` | In production, all public URLs go through Nginx: `https://<host>:8443`, `https://<host>:8443/api/v1` and `wss://<host>:8443/game-socket`. |
| SMTP            | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_NAME`, `SMTP_FROM_EMAIL`                  | Needed for password-reset emails (any SMTP provider works).                                                                               |
| MinIO           | `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD`, `MINIO_BUCKET_*`                                               | Object storage for uploaded files.                                                                                                        |

### 3. Generate the TLS certificate

Nginx serves the app over HTTPS only. Generate a self-signed certificate for any IP the app will be reached from:

```bash
./gen_certs.sh 127.0.0.1            # or: ./gen_certs.sh <your-LAN-ip>
```

This writes `certs/cert.pem` and `certs/key.pem`. Your browser will show a warning for a self-signed certificate. Accept it once.

### 4. Run

```bash
make            # build and start the production stack in the background
```

Then open **<https://{FRONTEND_URL}:8443>**. Database migrations run automatically when the API starts.

| Command              | Description                                                                   |
| -------------------- | ----------------------------------------------------------------------------- |
| `make` / `make prod` | Build and start the production stack                                          |
| `make clean`         | Stop the stack                                                                |
| `make fclean`        | Stop the stack and delete volumes (⚠️ database and uploads) and Docker images |
| `make rebuild-prod`  | Force a full rebuild                                                          |

### Development mode

```bash
make dev        # starts the stack with hot reload, applies migrations, syncs node_modules for your IDE
make dev-migrate M_NAME=my_migration   # create and apply a new Prisma migration
make dev-stop
```

In dev, each service is exposed on its own port: web app <http://localhost:3000>, API <http://localhost:3001/api/v1>, Swagger <http://localhost:3001/docs>, game server `ws://localhost:4000`, MinIO console <http://localhost:9001>.

---

## Resources

### Documentation

**Frontend**

- [Next.js documentation](https://nextjs.org/docs) — [App Router](https://nextjs.org/docs/app), [Middleware / Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
- [React documentation](https://react.dev/learn)
- [Tailwind CSS](https://tailwindcss.com/docs) · [shadcn/ui](https://ui.shadcn.com/docs)
- [TanStack Query — Infinite queries](https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries) · [Optimistic updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
- [Zustand](https://zustand.docs.pmnd.rs/) · [React Hook Form](https://react-hook-form.com/get-started) · [Zod](https://zod.dev/)
- [next-intl](https://next-intl.dev/docs/getting-started) · [nuqs (URL state)](https://nuqs.dev/docs) · [next-themes](https://github.com/pacocoursey/next-themes)

**Backend**

- [NestJS documentation](https://docs.nestjs.com/) — [Authentication](https://docs.nestjs.com/security/authentication), [Passport](https://docs.nestjs.com/recipes/passport), [Gateways (WebSockets)](https://docs.nestjs.com/websockets/gateways), [Rate limiting](https://docs.nestjs.com/security/rate-limiting), [Helmet](https://docs.nestjs.com/security/helmet), [Validation](https://docs.nestjs.com/techniques/validation), [Events](https://docs.nestjs.com/techniques/events), [OpenAPI (Swagger)](https://docs.nestjs.com/openapi/introduction)
- [Socket.IO documentation](https://socket.io/docs/v4/) — [Rooms](https://socket.io/docs/v4/rooms/), [Middlewares](https://socket.io/docs/v4/middlewares/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [Nodemailer](https://nodemailer.com/) · [class-validator](https://github.com/typestack/class-validator)

**Database and storage**

- [PostgreSQL documentation](https://www.postgresql.org/docs/15/index.html)
- [Prisma ORM](https://www.prisma.io/docs/orm) — [Schema / relations](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations), [Migrate](https://www.prisma.io/docs/orm/prisma-migrate), [Seeding](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding), [Cursor pagination](https://www.prisma.io/docs/orm/prisma-client/queries/pagination)
- [MinIO documentation](https://min.io/docs/minio/container/index.html) · [AWS SDK for JavaScript v3 — S3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/) · [Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html)

**Game**

- [Babylon.js documentation](https://doc.babylonjs.com/) — [Loading glTF/GLB](https://doc.babylonjs.com/features/featuresDeepDive/importers/glTF), [Animations](https://doc.babylonjs.com/features/featuresDeepDive/animation), [Babylon GUI](https://doc.babylonjs.com/features/featuresDeepDive/gui/gui), [Playground](https://playground.babylonjs.com/)
- [Colyseus documentation](https://docs.colyseus.io/) — [Room](https://docs.colyseus.io/room), [State synchronization (Schema)](https://docs.colyseus.io/state), [Authentication](https://docs.colyseus.io/auth)
- [Bun documentation](https://bun.sh/docs)
- [Gabriel Gambetta — Fast-Paced Multiplayer (client-side prediction, server reconciliation)](https://www.gabrielgambetta.com/client-server-game-architecture.html)
- [Valve — Source Multiplayer Networking](https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking)
- [Babylon Online GUI Editor](https://gui.babylonjs.com/)

**Infrastructure and security**

- [Docker documentation](https://docs.docker.com/) — [Multi-stage builds](https://docs.docker.com/build/building/multi-stage/), [Compose file reference](https://docs.docker.com/reference/compose-file/)
- [Nginx documentation](https://nginx.org/en/docs/) — [Reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/), [WebSocket proxying](https://nginx.org/en/docs/http/websocket.html), [SSL module](https://nginx.org/en/docs/http/ngx_http_ssl_module.html)
- [pnpm workspaces](https://pnpm.io/workspaces) · [Git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [RFC 7519 — JSON Web Token](https://datatracker.ietf.org/doc/html/rfc7519) · [OAuth 2.0 Security BCP — refresh token rotation](https://datatracker.ietf.org/doc/html/rfc9700#name-refresh-token-protection)
- [MDN — HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) · [MDN — WebSockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) · [MDN — WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)

### How AI was used

<!-- TODO (team): complete this list with how each member actually used AI. -->

AI assistants were used as a support tool, never as a replacement for understanding.

---

## Team Information

- Product Owner (PO): Defines the product vision, prioritizes features, and en-
  sures the project meets user needs.
  ◦ Maintains the product backlog.
  ◦ Makes decisions on features and priorities.
  ◦ Validates completed work.
  ◦ Communicates with stakeholders (evaluators, peers).

  tlutz(game) & bcabocel(network)

- Project Manager (PM) / Scrum Master: Facilitates team coordination and
  removes obstacles.
  ◦ Organizes team meetings and planning sessions.
  ◦ Tracks progress and deadlines.
  ◦ Ensures team communication.
  ◦ Manages risks and blockers.

  nofanizz(network)

- Technical Lead / Architect: Oversees technical decisions and architecture.
  ◦ Defines technical architecture.
  ◦ Makes technology stack decisions.
  ◦ Ensures code quality and best practices.
  ◦ Reviews critical code changes.

  bcabocel(network) & tlutz(game)

- Developers (all team members): Implement features and modules.
  ◦ Write code for assigned features.
  ◦ Participate in code reviews.
  ◦ Test their implementations.
  ◦ Document their work.

  tlutz & abonneau(game) | bcabocel & nofanizz(network)

## Project Management

- Meetings: weekly
- Task Distribution: in each halves of the project (network and game), the tasks and features were assigned equally based on the motivation and knowledge of each member.

- Tools used: Figma, Babylon GUI editor, Github (submodules and organization)

- Communication channels used: Discord

## Technical Stack

The project is a **pnpm monorepo** (`apps/*/*`) made of five Git submodules, all written in **TypeScript**:

| Package                      | Path                       | Role                                                                                       |
| ---------------------------- | -------------------------- | ------------------------------------------------------------------------------------------ |
| `front`                      | `apps/network/client`      | Web application (social network + game host page)                                          |
| `server`                     | `apps/network/server`      | REST API + Socket.IO gateways (auth, users, posts, chat, presence, game stats)             |
| `@transcendence/game-server` | `apps/game/server`         | Authoritative real-time game server                                                        |
| `@transcendence/game-ui`     | `apps/game/ui`             | 3D game client, embedded in the web app                                                    |
| `@transcendence/game-shared` | `apps/game/shared-package` | Network protocol, synchronized schemas and gameplay rules shared by game client and server |

### Frontend

- **Next.js 16** (App Router) + **React 19**: routing, layouts and server-side rendering. A middleware/proxy handles locale routing and protected routes.
- **Tailwind CSS 4** + **shadcn/ui** (Radix UI primitives), `lucide-react` icons, `sonner` toasts, `vaul` drawers, `next-themes` for light/dark themes.
- **TanStack Query 5**: server-state caching, infinite scrolling and cache invalidation.
- **Zustand**: client-side state (chat, presence, socket state).
- **React Hook Form** + **Zod 4**: typed form validation, with schemas matching the backend DTOs.
- **next-intl**: internationalization (English, French, German, Spanish, Italian and Swiss German).
- **socket.io-client**: real-time chat and presence.
- **Babylon.js 9** (`@babylonjs/core`, `gui`, `loaders`): 3D rendering of the game (glTF/GLB models, animations, HUD, shaders).
- **Colyseus SDK**: connection to the game server and automatic state synchronization.

### Backend

- **NestJS 11** on Express: modular architecture (`auth`, `user`, `post`, `relationship`, `chat`, `presence`, `upload`, `game`) with dependency injection, guards, pipes and interceptors.
- **Passport** (`passport-local`, `passport-jwt`) + **@nestjs/jwt**: authentication with short-lived access tokens and rotated refresh tokens (stored hashed, grouped by family to detect reuse) in HTTP-only cookies. Passwords are hashed with **bcrypt**.
- **Socket.IO** (`@nestjs/websockets`) with a custom adapter and authentication middleware: real-time chat and presence.
- **@nestjs/event-emitter**: decoupled domain events (for example a chat event triggers broadcasting and notifications).
- **class-validator / class-transformer**: DTO validation with a custom validation pipe and global exception filters.
- **@nestjs/throttler**: rate limiting per route.
- **Helmet**: secure HTTP headers.
- **@nestjs/swagger**: interactive API docs at `/docs`.
- **@nestjs-modules/mailer** + **Nodemailer**: transactional emails (password reset) with localized templates.
- **AWS SDK S3 client**: file storage in MinIO with presigned URLs.

### Game server

- **Bun** runtime + **Colyseus 0.17** (`@colyseus/bun-websockets`): authoritative multiplayer rooms (up to 4 players) with reconnection support.
- **@colyseus/schema**: binary delta synchronization of the game state.
- **jose**: verifies the game JWT issued by the API when a player joins, and signs the end-of-game stats sent back to the API.

### Database

- **PostgreSQL 15** accessed through **Prisma 7** (`@prisma/adapter-pg`), with versioned migrations.

**Why PostgreSQL:** our data is highly relational (users ↔ friendships ↔ blocks, posts ↔ replies ↔ quotes ↔ likes, chat rooms ↔ members ↔ messages, games ↔ players ↔ weapons). PostgreSQL gives us foreign keys with cascading deletes, composite unique constraints (one like per user per post, one friendship per pair of users), transactions, enums and native array columns (`attachmentUrls String[]`). **Prisma** gives us a schema that is the single source of truth, generated TypeScript types and reproducible migrations.

### Infrastructure and other tools

- **Docker / Docker Compose**: one command (`make`) builds and starts the whole stack. There are separate `dev` (hot reload) and `prod` (multi-stage builds) compose files.
- **Nginx**: the single HTTPS entry point (TLS 1.2/1.3, port `8443`). It redirects HTTP to HTTPS, sets security headers and reverse-proxies `/` → Next.js, `/api/` → NestJS, `/socket.io` → NestJS gateways, `/game-socket/` → game server, and `/avatars|post|chat/` → MinIO.
- **MinIO**: S3-compatible object storage for avatars, cover images, post images and chat attachments (buckets `avatars`, `post`, `chat`).
- **ESLint**, **Prettier**, **Vitest** (game packages in dev).

### Justification for major technical choices

- **TypeScript everywhere**: one language for the whole team, and types can be shared across packages (for example `@transcendence/game-shared` is consumed by both the game server and the game UI).
- **Separate API and game server**: the social network needs a classic request/response API, while the game needs a tick-based, authoritative simulation. Splitting them keeps the game loop out of the API process, lets each part scale and fail on its own, and lets us use the best tool for each job (NestJS for structure, Bun + Colyseus for real-time performance).
- **Authoritative server + shared package**: all gameplay (movement, combat, monster AI, upgrades) is validated server-side to prevent cheating. Clients only send inputs. The shared package keeps the protocol and rules identical on both sides, so the code has no "magic strings".
- **Next.js + TanStack Query**: file-based routing for many pages (feed, profiles, chat, settings, wiki, game), with robust caching and optimistic updates for a social feed.
- **Babylon.js**: a complete 3D engine (scene graph, GLB loader, animations, GUI) that is well suited to a browser game written in TypeScript.
- **MinIO instead of storing files in the database**: binary files stay out of PostgreSQL, and the S3 API makes it easy to move to a cloud provider later.

---

## Database Schema

<!-- TODO -->

All primary keys are `UUID` strings (`String @id @default(uuid())`), except `RefreshToken.id` (auto-incremented `Int`). Timestamps are `DateTime`.

### Users and authentication

| Table                  | Key fields                                                                                                                                                                                                                                                                                                                    | Notes                                                                                                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **User**               | `id`, `username` (unique), `email` (unique), `firstName`, `lastName`, `birthDate: DateTime`, `gender: UserGender`, `displayName`, `bio?`, `avatarUrl?`, `coverImageUrl?`, `location?`, `website?`, `localePreference: LocalePreference`, `role: UserRole`, `preferedPresenceStatus`, `lastActiveAt`, `createdAt`, `updatedAt` | Central entity. Enums: `UserRole` (USER, ADMIN, SUPER_ADMIN), `LocalePreference` (EN, FR, DE, ES, IT), `PresencePreferedStatus` (ONLINE, INVISIBLE, DO_NOT_DISTURB). |
| **AuthProvider**       | `provider: AuthProviderType`, `providerId?`, `password?` (bcrypt hash), `userId → User`                                                                                                                                                                                                                                       | Unique on (`userId`, `provider`). Separates credentials from the user profile so other providers can be added.                                                       |
| **RefreshToken**       | `id: Int`, `hashToken` (unique), `familyId`, `isRevoked: Boolean`, `userAgent?`, `ip?`, `deviceId?`, `expiredAt`, `userId → User`                                                                                                                                                                                             | Refresh-token rotation. Tokens are grouped by family to detect reuse.                                                                                                |
| **ResetPasswordToken** | `tokenHash` (unique), `used: Boolean`, `expiresAt`, `userId → User`                                                                                                                                                                                                                                                           | Single-use password-reset links.                                                                                                                                     |

### Social graph

| Table          | Key fields                                                                                   | Notes                                                                                               |
| -------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Friendship** | `userAId → User`, `userBId → User`, `senderId`, `state: FriendshipState` (PENDING, ACCEPTED) | Unique on (`userAId`, `userBId`): one row per pair of users. `senderId` tells who sent the request. |
| **Block**      | `blockerId → User`, `blockedId → User`                                                       | Unique on (`blockerId`, `blockedId`).                                                               |

### Posts

| Table    | Key fields                                                                                                                                | Notes                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Post** | `content?`, `imageUrl?`, `type: PostType` (POST, REPLY, QUOTE, REPOST), `authorId → User`, `parentPostId? → Post`, `quotedPostId? → Post` | Self-relations: a reply points to its parent, and a quote or repost points to the quoted post. |
| **Like** | `userId → User`, `postId → Post`                                                                                                          | Unique on (`userId`, `postId`).                                                                |

### Chat

| Table                   | Key fields                                                                                                                                                                            | Notes                                                                                                                                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ChatRoom**            | `type: ChatRoomType` (DIRECT, GROUP), `name?`, `avatarUrl?`, `createdBy? → User`, `lastActivityAt`                                                                                    | Direct messages and group chats.                                                                                                                                                                                             |
| **ChatMember**          | `roomId → ChatRoom`, `userId → User`, `role: ChatMemberRole` (OWNER, ADMIN, MEMBER), `joinedAt`, `lastReadAt?`, `isMuted: Boolean`                                                    | Unique on (`roomId`, `userId`). `lastReadAt` is used to compute unread counts.                                                                                                                                               |
| **ChatMessage**         | `roomId → ChatRoom`, `senderId? → User`, `type: ChatMessageType`, `content?`, `replyToId? → ChatMessage`, `attachmentUrls: String[]`, `sharedPostId? → Post`, `isEdited`, `isDeleted` | `type` covers text messages, shared posts and system events (JOINED, LEFT, KICKED, ROLE_UPDATED, OWNERSHIP_TRANSFERRED, ROOM_CREATED, ROOM_RENAMED, ROOM_AVATAR_CHANGED). Indexed on (`roomId`, `createdAt`) for pagination. |
| **ChatMessageMetadata** | `messageId → ChatMessage` (unique), `targetUserId? → User`, `oldRole?`, `newRole?`, `oldValue?`, `newValue?`                                                                          | Extra data for system messages (who was kicked or promoted, old and new room name, etc.).                                                                                                                                    |

### Game statistics

| Table                                               | Key fields                                                                                                                                                                                                                                  | Notes                                                                                                                        |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **GameStats**                                       | `survivalTime: Int`, `totalKills: Int`, `createdAt`                                                                                                                                                                                         | One row per finished game.                                                                                                   |
| **GamePlayerStats**                                 | `gameStatsId → GameStats`, `userId? → User`, `killAmount: Int`, `maxHealth: Int`, `attackDamage: Int`, `armor: Int`, `attackSpeed`, `moveSpeed`, `luck`, `lifesteal`, `range`, `size`, `duration`, `penetration` (`Float`), `quantity: Int` | Final build of each player in a game.                                                                                        |
| **GamePlayerWeaponStats**                           | `kind: GameWeaponKind` (AURA, STAFF, BOW, SWORD, AXE), `level: Int`                                                                                                                                                                         | Weapons owned at the end of the game.                                                                                        |
| **GamePlayerTomeStats**                             | `kind: GameTomeKind` (DAMAGE, COOLDOWN, AGILITY, VITALITY, ARMOR, BLOOD, RANGE, SIZE, DURATION, QUANTITY, FORTUNE), `level: Int`                                                                                                            | Passive upgrades ("tomes") owned at the end of the game.                                                                     |
| **UserGameSummary**                                 | `userId → User` (unique), `totalGamesPlayed`, `totalKills`, `totalSurvivalTime`, `highestKills`, `highestSurvivalTime`, `lastPlayedAt?`                                                                                                     | Per-user totals, updated after each game. They feed the profile stats and the leaderboard without re-aggregating every game. |
| **UserGameWeaponSummary** / **UserGameTomeSummary** | `userGameSummaryId`, `kind`, `timesUsed: Int`, `highestLevel: Int`                                                                                                                                                                          | Unique on (`userGameSummaryId`, `kind`).                                                                                     |

### **Deletion rules:**

- Deleting a user cascades to their credentials, tokens, posts, likes, relationships and chat memberships.
- Messages, room creators and game participation are kept with `SET NULL`, so conversations and game history stay consistent.

---

## Features List

> Team members: **bcabocel** (Benoit Cabocel), **nofanizz** (Noa Fanizzi), **tlutz** (Thyanoui Lutz), **abonneau** (Antoine Bonneau).

### Authentication and account

| Feature                 | Description                                                                                                                                 | Member(s)          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| Registration and login  | Multi-step sign-up form (identity, birth date, credentials) and login by email or username, with Zod/DTO validation on both sides.          | bcabocel, tlutz    |
| JWT sessions            | Access and refresh tokens in HTTP-only cookies, silent refresh, refresh-token rotation with reuse detection, logout.                        | bcabocel, tlutz    |
| Forgot / reset password | Sends a localized email with a single-use, time-limited link to set a new password.                                                         | bcabocel           |
| Route protection        | The Next.js proxy redirects unauthenticated users. API guards protect every private endpoint and socket connection.                         | bcabocel           |
| Account settings        | Edit profile (display name, bio, location, website, avatar, cover), account data, security (password) and a danger zone (account deletion). | bcabocel, nofanizz |

### User profiles and social graph

| Feature         | Description                                                                                                                | Member(s)          |
| --------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| Public profiles | `/[username]` page with avatar, cover, bio, and tabs for posts, comments, likes, reposts and game history.                 | bcabocel, nofanizz |
| Friends         | Send, accept, decline or cancel friend requests, list friends and pending requests, remove friends.                        | bcabocel           |
| Block           | Block or unblock users. Blocked users cannot interact with you, and a dedicated page lists them.                           | bcabocel           |
| Presence        | Real-time online / offline / do-not-disturb / invisible status for friends, based on Socket.IO and last-activity tracking. | bcabocel           |

### Search

| Feature                    | Description                                                                                                                                                                                                                      | Member(s)          |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| Search page                | `/search` page with a **Users** tab and a **Posts** tab. The query and the active tab live in the URL (`?search=…&tab=…`), so a search can be shared, bookmarked and restored with the back button. Input is debounced (500 ms). | bcabocel           |
| User search                | Case-insensitive match on username or display name. Prefix with `@` to search usernames only. Users who blocked you are excluded. Results load with infinite scroll.                                                             | bcabocel, nofanizz |
| Post search                | Case-insensitive search in post content, with blocked authors excluded and the same post cards as the feed.                                                                                                                      | nofanizz, bcabocel |
| Friends and blocked search | Search bar on the friends, friend-requests and blocked-users pages to filter each list. The "add a friend" panel searches only among users who are not already friends.                                                          | bcabocel           |
| Chat search                | Filter conversations by group name or member display name. Search members inside a room. Pick users through a search when creating a group or adding members.                                                                    | bcabocel           |
| Message search (API)       | The API can search messages in a room by content, or by sender with `@username text`. The UI does not expose it yet.                                                                                                             | bcabocel           |
| Search protection          | Every `search` parameter is validated (string, 100 characters max). Search endpoints have their own rate limit (20 requests/s, 100/min, 10,000/day).                                                                             | bcabocel           |

### Posts and feed

| Feature               | Description                                                                   | Member(s)          |
| --------------------- | ----------------------------------------------------------------------------- | ------------------ |
| Feed                  | Infinite-scrolling timeline of posts.                                         | nofanizz, bcabocel |
| Create / delete posts | Text posts with an optional image (uploaded to MinIO).                        | nofanizz, bcabocel |
| Replies (comments)    | Threaded replies on a dedicated post page.                                    | nofanizz           |
| Likes                 | Like or unlike posts with optimistic UI updates, and a likes tab on profiles. | nofanizz           |
| Reposts and quotes    | Repost a post or quote it with your own comment.                              | nofanizz           |
| Share a post in chat  | Send a post to a conversation as a rich preview.                              | bcabocel           |

### Chat

| Feature                  | Description                                                                                                      | Member(s) |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- | --------- |
| Direct messages          | Real-time one-to-one conversations over Socket.IO.                                                               | bcabocel  |
| Group chats              | Create groups, rename them, change the avatar, invite or kick members, leave.                                    | bcabocel  |
| Roles and moderation     | Owner, admin and member roles, promotion and demotion, ownership transfer. Each action creates a system message. | bcabocel  |
| Rich messages            | Replies to messages, edit and delete, emoji picker, file and image attachments.                                  | bcabocel  |
| Unread and notifications | Unread counters based on `lastReadAt`, mute per room, rooms sorted by last activity.                             | bcabocel  |

### Game: Light Keepers (cooperative 3D survival)

| Feature                      | Description                                                                                                                                                                                           | Member(s)          |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| Real-time multiplayer        | Cooperative rooms for up to 4 players on an authoritative Colyseus server, with input validation and reconnection.                                                                                    | tlutz, abonneau    |
| Lobby and game flow          | Main menu, lobby, waiting screen, in-game scene and ending screen, embedded in the web app. Access is authenticated with a game JWT.                                                                  | tlutz              |
| 3D world                     | Procedurally generated map (noise-based) rendered with Babylon.js, with animated GLB models for players and monsters.                                                                                 | abonneau           |
| Monsters and AI              | Monster catalog, wave spawning with scaling difficulty, server-side AI and collision solving.                                                                                                         | abonneau           |
| Combat and weapons           | Five weapons (aura, staff, bow, sword, axe) with automatic targeting, projectiles, hitboxes and damage resolution.                                                                                    | abonneau           |
| Progression                  | XP and level-ups with a random choice of upgrades: new or improved weapons and eleven passive "tomes" (damage, cooldown, agility, vitality, armor, lifesteal, range, size, duration, quantity, luck). | tlutz, abonneau    |
| Downed and revive            | A player at 0 HP is downed and can be revived by teammates.                                                                                                                                           | abonneau           |
| HUD and controls             | Health and XP bars, timer, kill counter, level-up menu, revive prompt, rebindable keys, mobile touch controls, music and settings menu.                                                               | tlutz, abonneau    |
| Game statistics              | At the end of a game, the game server sends signed stats to the API, which stores per-game and per-player data and updates the user summaries.                                                        | tlutz, bcabocel    |
| Game history and leaderboard | Per-user history of past games with details, a stats summary on the profile, and a global leaderboard sortable by kills or survival time.                                                             | bcabocel           |
| Wiki                         | Public pages that present the lore, the arsenal (weapons) and the bestiary (monsters).                                                                                                                | nofanizz, bcabocel |

### Cross-cutting

| Feature                 | Description                                                                                                                                                                      | Member(s)                    |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| Internationalization    | Full UI translation in 6 languages (EN, FR, DE, ES, IT, Swiss German) with a language switcher, a persisted user preference and localized dates. The game UI is also translated. | bcabocel, nofanizz, abonneau |
| Themes                  | Light and dark themes.                                                                                                                                                           | bcabocel                     |
| Responsive UI           | Layouts adapted to desktop and mobile.                                                                                                                                           | bcabocel, nofanizz, tlutz    |
| File storage            | Avatar, cover, post and chat uploads to MinIO with MIME validation and presigned URLs.                                                                                           | bcabocel, nofanizz           |
| Security                | HTTPS through Nginx, Helmet headers, CORS, rate limiting, bcrypt hashing, validation of every input (DTOs and Zod).                                                              | bcabocel, nofanizz           |
| API documentation       | Swagger UI generated from the controllers and DTOs, served by the API at `/docs`.                                                                                                | bcabocel                     |
| Landing and legal pages | Landing page, privacy policy, terms of service and support pages.                                                                                                                | nofanizz, bcabocel, abonneau |
| DevOps                  | Docker Compose dev and prod stacks, Makefile, Nginx reverse proxy, TLS certificate generation script.                                                                            | all                          |

---

## Modules

### Summary and point calculation

| #   | Category             | Module                                             | Type  | Points | Member(s)                 |
| --- | -------------------- | -------------------------------------------------- | ----- | ------ | ------------------------- |
| 1   | Web                  | Use a frontend framework (Next.js / React)         | Minor | 1      | bcabocel, nofanizz        |
| 2   | Web                  | Use a backend framework (NestJS)                   | Minor | 1      | bcabocel, nofanizz, tlutz |
| 3   | Web                  | Real-time features with WebSockets                 | Major | 2      | bcabocel, tlutz, abonneau |
| 4   | Web                  | Allow users to interact with other users           | Major | 2      | bcabocel, nofanizz        |
| 5   | Web                  | Public API (API key, rate limiting, documentation) | Major | 2      | bcabocel, nofanizz        |
| 6   | Web                  | Use an ORM for the database (Prisma)               | Minor | 1      | bcabocel, nofanizz, tlutz |
| 7   | Web                  | Complete notification system                       | Minor | 1      | bcabocel                  |
| 8   | Web                  | Server-Side Rendering (SSR)                        | Minor | 1      | bcabocel, nofanizz        |
| 9   | Web                  | Custom-made design system                          | Minor | 1      | bcabocel, nofanizz        |
| 10  | Web                  | Advanced search (filters, sorting, pagination)     | Minor | 1      | bcabocel, nofanizz        |
| 11  | Web                  | File upload and management system                  | Minor | 1      | bcabocel, nofanizz        |
| 12  | Accessibility & i18n | Accessibility compliance (WCAG 2.1 AA)             | Major | 2      | all                       |
| 13  | Accessibility & i18n | Support for multiple languages                     | Minor | 1      | all                       |
| 14  | Accessibility & i18n | Support for additional browsers                    | Minor | 1      | all                       |
| 15  | User management      | Standard user management and authentication        | Major | 2      | bcabocel, nofanizz, tlutz |
| 16  | User management      | Game statistics and match history                  | Minor | 1      | bcabocel, tlutz           |
| 17  | User management      | Organization system (group chats)                  | Major | 2      | bcabocel                  |
| 18  | Gaming & UX          | Complete web-based game                            | Major | 2      | tlutz, abonneau           |
| 19  | Gaming & UX          | Remote players                                     | Major | 2      | tlutz, abonneau           |
| 20  | Gaming & UX          | Multiplayer game (more than two players)           | Major | 2      | tlutz, abonneau           |
| 21  | Gaming & UX          | Advanced 3D graphics (Babylon.js)                  | Major | 2      | abonneau, tlutz           |
| 22  | Gaming & UX          | Game customization options                         | Minor | 1      | tlutz, abonneau           |
| 23  | Data & Analytics     | GDPR compliance features                           | Minor | 1      | bcabocel, abonneau        |

|               | Count      | Points                      |
| ------------- | ---------- | --------------------------- |
| Major modules | 10 × 2     | **20**                      |
| Minor modules | 13 × 1     | **13**                      |
| **Total**     | 23 modules | **33 points** (14 required) |

> ℹ️ We used the two **Minor** framework modules (frontend + backend) rather than the Major "framework for both frontend and backend". Next.js is only used as a frontend here (the backend is NestJS), so it does not count as both.

---

### Web

#### 1. Minor — Use a frontend framework

- **Why:** we have dozens of pages (feed, profiles, chat, settings, wiki, game) that share layouts, data and state. A component framework is the only reasonable way to keep that maintainable.
- **How:** [Next.js 16](https://nextjs.org/docs) (App Router) with [React 19](https://react.dev/). Routes are grouped into `(landing)` (public pages) and `(socket)/(hub)` (authenticated pages that open the WebSocket connections). Features live in `src/features/*` (api, hooks, components, schemas, stores). Server state is handled with [TanStack Query](https://tanstack.com/query/latest) and client state with [Zustand](https://zustand.docs.pmnd.rs/).
- **Who:** bcabocel, nofanizz.

#### 2. Minor — Use a backend framework

- **Why:** [NestJS](https://docs.nestjs.com/) gives us a strict modular architecture, dependency injection, guards, pipes and first-class WebSocket and Swagger support, which suits a team of several developers working on the same API.
- **How:** `apps/network/server` is split into core modules (`config`, `database`, `security`, `rate-limit`, `storage`, `email`, `websocket`) and domain modules (`auth`, `user`, `post`, `relationship`, `chat`, `presence`, `upload`, `game`). Each domain module follows the same layers: controller → service → repository, with DTOs and mappers. Modules mainly talk to each other through [domain events](https://docs.nestjs.com/techniques/events) instead of direct imports.
- **Who:** bcabocel, nofanizz, tlutz.

#### 3. Major — Real-time features using WebSockets

- **Why:** chat, presence, notifications and the game all need instant updates without polling.
- **How:**
  - **Socket.IO** ([NestJS gateways](https://docs.nestjs.com/websockets/gateways)) for chat and presence. A custom adapter authenticates each socket with the JWT cookie, and users join per-user and per-room channels so broadcasts only reach the right people ([rooms](https://socket.io/docs/v4/rooms/)). On disconnection, a timer marks the user offline only if they don't reconnect (multiple tabs and short drops are handled). Messages, edits, deletions, typing state, membership changes and friend requests are pushed live.
  - **Colyseus** ([docs](https://docs.colyseus.io/)) over WebSockets for the game, with binary delta-encoded state sync and a reconnection window.
  - Nginx proxies both protocols (`/socket.io`, `/game-socket/`) with the `Upgrade` headers and long timeouts.
- **Who:** bcabocel (Socket.IO: chat and presence), tlutz and abonneau (Colyseus game).

#### 4. Major — Allow users to interact with other users

- **Why:** this is the core of the "social network" half of the project.
- **How:**
  - **Chat**: direct and group conversations with persistent history.
  - **Profiles**: `/[username]` with tabs for posts, comments, likes, reposts and game history.
  - **Friends**: requests with the PENDING and ACCEPTED states, friends list, removal, online status.
  - On top of that: blocking, posts, likes, replies, quotes and reposts.
- **Who:** bcabocel (chat, friends, blocks, profiles), nofanizz (posts and social interactions).

#### 5. Major — Public API

- **Why:** we wanted our data to be usable by external tools, and NestJS + Swagger made documentation almost free.
- **How:**
  - A versioned REST API under `/api/v1` with more than 5 endpoints using GET, POST, PATCH and DELETE.
  - Documentation is generated with [@nestjs/swagger](https://docs.nestjs.com/openapi/introduction) and served at `/docs`.
  - Rate limiting uses [@nestjs/throttler](https://docs.nestjs.com/security/rate-limiting) with per-route presets (burst, sustained and daily limits).
  - Every input is validated by DTOs.

<!-- TODO (team): the subject requires a secured API key and PUT routes. Describe here how the API key is generated, sent (header) and checked, and list the 5+ public endpoints. -->

- **Who:** bcabocel, nofanizz.

#### 6. Minor — Use an ORM for the database

- **Why:** type-safe queries, one schema as the source of truth, and reproducible migrations shared by the whole team.
- **How:** [Prisma 7](https://www.prisma.io/docs/orm) with the PostgreSQL adapter.
  - `prisma/schema.prisma` defines 22 models.
  - 30+ [versioned migrations](https://www.prisma.io/docs/orm/prisma-migrate) are applied automatically when the API starts.
  - Repositories use typed `select` objects, [cursor pagination](https://www.prisma.io/docs/orm/prisma-client/queries/pagination#cursor-based-pagination) and [transactions](https://www.prisma.io/docs/orm/prisma-client/queries/transactions) (a unit-of-work service).
- **Who:** bcabocel, nofanizz, tlutz.

#### 7. Minor — Complete notification system

- **Why:** users must know immediately when something that concerns them is created, updated or deleted.
- **How:** domain events (`@nestjs/event-emitter`) are turned into Socket.IO events by broadcasters, and shown on the client by:
  - unread badges on the navigation (chat and friend requests), using a `chat-notification` module based on `lastReadAt`;
  - toasts ([Sonner](https://sonner.emilkowal.ski/)) for creation, update and deletion results (posts, messages, rooms, friendships, settings…);
  - automatic cache invalidation so lists update without a reload;
  - localized emails for account events (password reset, password change, account deletion).
- **Who:** bcabocel.

#### 8. Minor — Server-Side Rendering

- **Why:** faster first paint, localized metadata for SEO on public pages (landing, wiki, legal pages), and no flash of untranslated content.
- **How:** Next.js [Server Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) render pages on the server. Translations are loaded server-side with `getTranslations`, and `generateMetadata` produces localized titles and descriptions. Interactive parts are isolated in client components.
- **Who:** bcabocel, nofanizz.

#### 9. Minor — Custom-made design system

- **Why:** a consistent look between the social network and the game, plus faster page development.
- **How:**
  - 45 reusable components in `src/components/ui`, built on [shadcn/ui](https://ui.shadcn.com/docs) and [Radix](https://www.radix-ui.com/primitives) and restyled. Examples: `button` (with variants), `input-search`, `input-password`, `step-indicator`, `media-modal`, `notification-bubble`, `kicker` and `progress-bar`.
  - A theme palette defined as CSS variables (light and dark, see [Tailwind theming](https://tailwindcss.com/docs/theme)), with typography and a [lucide](https://lucide.dev/) icon set plus custom icons (`components/icons`).
- **Who:** bcabocel, nofanizz.

#### 10. Minor — Advanced search

- **Why:** users need to find people, posts, friends and conversations quickly.
- **How:**
  - A `/search` page with Users and Posts tabs. The query and tab are stored in the URL with [nuqs](https://nuqs.dev/) and the input is debounced.
  - **Filters:** username or display name; `@` restricts the search to usernames; post content; feed filters (`all-not-blocked`, `not-friends`); message sender with `@user`.
  - **Sorting:** `orderBy` parameters.
  - **Pagination:** cursor-based pagination with infinite scroll.
  - Searches are validated (100 characters max) and rate-limited.
- **Who:** bcabocel, nofanizz.

#### 11. Minor — File upload and management system

- **Why:** avatars, cover images, post images and chat attachments.
- **How:**
  - Files go to [MinIO](https://min.io/docs/minio/container/index.html) (S3-compatible) in separate buckets, each with its own size limit.
  - The client uploads directly with [presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html).
  - The type, size and format are checked on the client (Zod) and on the server (MIME whitelist).
  - Images and documents are previewed in `media-attachment-previews` and `media-modal`.
  - Files can be deleted. Files of deleted entities are cleaned up by event listeners.

<!-- TODO (team): the subject requires progress indicators for uploads, and none was found in the client. Add one (e.g. XHR upload progress), then describe it here. -->

- **Who:** bcabocel, nofanizz.

### Accessibility and internationalization

#### 12. Major — Accessibility compliance (WCAG 2.1 AA)

- **Why:** the app should be usable by everyone, including keyboard and screen-reader users.
- **How:**
  - [Radix primitives](https://www.radix-ui.com/primitives/docs/overview/accessibility) provide accessible dialogs, menus, selects and tabs (focus trapping, ARIA roles, keyboard navigation).
  - Interactive elements have `aria-*` labels, visible focus styles and `sr-only` text.
  - The `lang` attribute follows the active locale.

<!-- TODO (team): describe the audit (Lighthouse / axe / WAVE), the screen readers tested (NVDA, VoiceOver…) and how keyboard navigation works in the game. References: https://www.w3.org/TR/WCAG21/ , https://www.w3.org/WAI/WCAG21/quickref/?levels=aaa -->

- **Who:** bcabocel, abonneau.

#### 13. Minor — Support for multiple languages

- **Why:** our team and our users speak several languages.
- **How:**
  - [next-intl](https://next-intl.dev/docs/getting-started) with locale-prefixed routes (`/[locale]/…`) and 6 complete translations: EN, FR, DE, ES, IT and Swiss German (`che`).
  - A language switcher in the UI, and the choice is saved in the user profile (`localePreference`).
  - Dates are localized with [date-fns](https://date-fns.org/docs/I18n), and emails use localized templates.
  - The game UI has its own i18n layer.
- **Who:** bcabocel, nofanizz, abonneau.

#### 14. Minor — Support for additional browsers

- **Why:** players should not be forced onto one browser.
- **How:** the app and the game were tested on Chrome plus Firefox and other browsers. We use standard Web APIs only, and Babylon.js handles WebGL 2 differences.

<!-- TODO (team): list the browsers and versions tested, and any browser-specific limitations. -->

- **Who:** all.

### User management

#### 15. Major — Standard user management and authentication

- **Why:** everything else (social features, game stats) depends on identified users.
- **How:**
  - Sign-up and login with [Passport](https://docs.nestjs.com/recipes/passport) (local + JWT). Passwords are hashed with bcrypt.
  - The access token and the rotated refresh token are stored in HTTP-only cookies.
  - Password reset by email.
  - Users can edit their profile (display name, bio, location, website, cover) and upload an avatar, with a default avatar when none is set.
  - Friends with online status (presence module).
  - A public profile page for every user.
- **Who:** bcabocel, nofanizz, tlutz.

#### 16. Minor — Game statistics and match history

- **Why:** players want to see their progress and compare themselves with others.
- **How:**
  - At the end of a game, the game server signs the stats with a JWT (`jose`) and sends them to the API (`POST /game`).
  - The API stores `GameStats`, `GamePlayerStats` and the weapon and tome levels, and updates `UserGameSummary` in a transaction.
  - The client shows the history (`/[username]/games-history`), game details (`/game/[id]`), profile stats (best survival time, kills, favorite weapons) and a leaderboard (`/game/leaderboard`) sortable by kills or survival time.
- **Who:** bcabocel (API and pages), tlutz (game-side upload).

#### 17. Major — Organization system

- **Why:** we chose group chats as our "organizations": they are the natural way for users of a social network and game to gather into teams.
- **How:**
  - Groups (`ChatRoom` of type `GROUP`) can be created, renamed, given an avatar and deleted.
  - Users can be added or removed (kick and leave).
  - Every member can view the group. Actions depend on the member's role (`OWNER`, `ADMIN`, `MEMBER`): owners and admins edit the group and manage members, owners promote or demote admins and can transfer ownership.
  - Each action creates a system message (`ChatMessageMetadata`) and is broadcast in real time.
- **Who:** bcabocel.

### Gaming and user experience

#### 18. Major — Complete web-based game

- **Why:** the game is the heart of the project, and we wanted something more original than Pong.
- **How:** **Light Keepers** is a 3d survival game. Players fight endless waves of monsters with automatic weapons. Compete with your friends to become the most powerful being in the universe.
  - **Rules:** gain XP by killing monsters, level up, choose upgrades. A downed player can be revived by other players.
  - **Win and loss:** the game is lost when every player is down. The score is the survival time and the number of kills.
  - It is played live in the browser from `/game/play`.
- **Who:** tlutz, abonneau.

#### 19. Major — Remote players

- **Why:** a co-op game is only fun if friends can play together from different computers.
- **How:**
  - The [Colyseus](https://docs.colyseus.io/) server is authoritative: clients only send inputs, which are validated by `InputValidator`.
  - The state is synchronized as binary deltas.
  - Network input cadence is tuned to limit latency.
  - A disconnected player has a reconnection window of `40s` before being removed.
- **Who:** tlutz, abonneau.

#### 20. Major — Multiplayer game (more than two players)

- **Why:** survival games are built for squads.
- **How:**
  - Rooms accept up to **4 players**.
  - All players share the same monsters, world and timer.
  - Difficulty scales with time, and every simulation step runs on the server, so all clients see the same thing and nobody can cheat.
  - The protocol and gameplay rules live in `@transcendence/game-shared`, so every client follows exactly the same rules.
- **Who:** tlutz, abonneau.

#### 21. Major — Advanced 3D graphics

- **Why:** a 3D world makes the game much more immersive than a 2D canvas.
- **How:** [Babylon.js](https://doc.babylonjs.com/):
  - a procedurally generated, chunked world based on noise;
  - animated [glTF/GLB models](https://doc.babylonjs.com/features/featuresDeepDive/importers/glTF) with optimized animations and an asset cache;
  - dynamic lighting and shadows, tone mapping and anti-aliasing, a custom level-up shader effect and a glowing boundary;
  - a HUD built with [Babylon GUI](https://doc.babylonjs.com/features/featuresDeepDive/gui/gui);
  - performance tooling (frame-time history).
- **Who:** abonneau, tlutz.

#### 22. Minor — Game customization options

- **Why:** each run and each player should feel different.
- **How:**
  - **Abilities and power-ups:** 5 weapons (aura, staff, bow, sword, axe) and 11 tomes, offered as upgrade choices at each level-up.
  - **Maps:** the world is generated from a seed, so every game has a different map.
  - **Settings:** field of view and rebindable keys, with a "reset to defaults" button. Default values are always available.
- **Who:** tlutz, abonneau.

### Data and analytics

#### 23. Minor — GDPR compliance features

- **Why:** users must stay in control of their personal data.
- **How:**
  - **Data request and export:** a "Danger zone" settings page lets users download their data as JSON, CSV, TXT or XML.
  - **Data deletion:** account deletion with password confirmation. It cascades to the user's personal data and keeps conversations consistent.
  - **Confirmation emails:** sent for the sensitive operations (password change, account deletion).
  - [Privacy policy](https://gdpr.eu/privacy-notice/) and terms of service pages.
- **Who:** bcabocel, abonneau.
