# Build stage
FROM node:18.18-slim as build

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV NODE_ENV=production
ENV VITE_API_URL=http://localhost:8000
ENV TAILWIND_MODE=build
ENV NODE_OPTIONS="--max_old_space_size=4096"

# Copy package files
COPY package*.json ./

# Install dependencies and rebuild native modules
RUN npm install --legacy-peer-deps && \
    npm rebuild @tailwindcss/oxide --platform=linux --arch=x64

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
