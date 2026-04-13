# ── Stage 1: Build React admin SPA ───────────────────────────────────────────
FROM node:20-alpine AS client-builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

# ── Stage 2: Build TypeScript server ─────────────────────────────────────────
FROM node:20-alpine AS server-builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# ── Stage 3: Production image ─────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled server
COPY --chown=node:node --from=server-builder /app/dist ./dist/

# Copy runtime assets
COPY --chown=node:node public/ ./public/
COPY --chown=node:node views/ ./views/
COPY --chown=node:node knexfile.js ./
COPY --chown=node:node src/db/migrations ./src/db/migrations/

# Copy built React admin from stage 1
COPY --from=client-builder --chown=node:node /app/public/admin ./public/admin

# Remove SQLite database — production uses PostgreSQL
RUN rm -f database.db

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD wget -qO- http://localhost:3000/health || exit 1

USER node

CMD ["node", "dist/server.js"]
