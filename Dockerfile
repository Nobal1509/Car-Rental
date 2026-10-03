# ==========================================
# Stage 1: Build the Frontend (Vite + React)
# ==========================================
FROM node:22-alpine AS frontend-build

WORKDIR /app/client

# Install frontend dependencies
COPY client/package.json client/package-lock.json ./
RUN npm ci

# Copy frontend source code
COPY client/ ./

# Build arguments for Vite (leave empty for same-origin relative API calls)
ARG VITE_BASE_URL=""
ARG VITE_CURRENCY="$"
ENV VITE_BASE_URL=${VITE_BASE_URL}
ENV VITE_CURRENCY=${VITE_CURRENCY}

# Build production static assets (into /app/client/dist)
RUN npm run build

# ==========================================
# Stage 2: Production Server (Node.js + Express)
# ==========================================
FROM node:22-alpine AS production

ENV NODE_ENV=production
# Render automatically sets PORT at runtime; default to 3000 locally
ENV PORT=3000

WORKDIR /app/server

# Install backend production dependencies only
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy backend source code and static frontend build
COPY --chown=node:node server/ ./
COPY --from=frontend-build --chown=node:node /app/client/dist /app/client/dist

# Ensure proper file ownership
RUN chown -R node:node /app

# Switch to non-root user for security
USER node

# Expose port (Render ignores EXPOSE and binds to $PORT)
EXPOSE 3000

# Run the server directly with Node for proper signal handling (SIGTERM/SIGINT)
CMD ["node", "server.js"]
