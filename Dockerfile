# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Build applications
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files and built assets
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server/dist ./server/dist

# Install production dependencies
RUN npm ci --only=production

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"] 
