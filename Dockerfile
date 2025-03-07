# Build stage for client
FROM node:18-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

# Build stage for server
FROM node:18-alpine AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy built client files
COPY --from=client-builder /app/client/dist ./client/dist

# Copy server files and dependencies
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/package*.json ./server/

# Install production dependencies for server
WORKDIR /app/server
RUN npm ci --only=production

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "dist/index.js"]
