# ── Stage 1: Build React admin SPA ───────────────────────────────────────────
FROM node:20-alpine AS client-builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

# ── Stage 2: Production server ────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Install server dependencies (production only)
COPY package*.json ./
RUN npm ci --only=production

# Copy server source
COPY --chown=node:node src/ ./src/
COPY --chown=node:node public/ ./public/
COPY --chown=node:node views/ ./views/
COPY --chown=node:node knexfile.js ./

# Copy built React admin from stage 1 (Vite outputs to /app/public/admin per vite.config.js)
COPY --from=client-builder --chown=node:node /app/public/admin ./public/admin

# Remove SQLite database — production uses PostgreSQL
RUN rm -f database.db

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD wget -qO- http://localhost:3000/health || exit 1

USER node

CMD ["node", "src/server.js"]
