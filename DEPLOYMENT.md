# Deployment Guide

This guide explains how to deploy WriteItUpX using Docker.

## Prerequisites

- Docker Engine (version 20.10.0 or higher)
- Docker Compose (version 2.0.0 or higher)
- Git

## Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd writeitupx
```

2. Create a `.env` file in the root directory with the following variables:
```env
# Server Configuration
NODE_ENV=production
PORT=8000
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here

# MongoDB Configuration
MONGODB_URI=mongodb://mongodb:27017/writeitupx

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# URLs
CLIENT_URL=http://localhost
SERVER_URL=http://localhost:8000
```

## Docker Deployment

1. Build and start the containers:
```bash
docker-compose up --build
```

This command will:
- Build the client, server, and database containers
- Start all services in the correct order
- Set up the network between containers
- Mount necessary volumes for data persistence

2. Verify the deployment:
- Client: http://localhost
- Server: http://localhost:8000
- MongoDB: mongodb://localhost:27017

## Container Information

The deployment consists of three containers:

1. **Client Container**
   - Nginx server serving the React application
   - Port: 80
   - Configuration: client/nginx.conf

2. **Server Container**
   - Node.js server running the backend API
   - Port: 8000
   - Environment: Production

3. **MongoDB Container**
   - MongoDB database
   - Port: 27017
   - Persistent volume: mongodb_data

## Common Operations

### View logs
```bash
# All containers
docker-compose logs

# Specific container
docker-compose logs client
docker-compose logs server
docker-compose logs mongodb
```

### Restart services
```bash
# All services
docker-compose restart

# Specific service
docker-compose restart client
docker-compose restart server
docker-compose restart mongodb
```

### Stop the application
```bash
docker-compose down
```

### Clean up
```bash
# Remove containers and networks
docker-compose down

# Remove containers, networks, and volumes
docker-compose down -v
```

## Troubleshooting

1. **MongoDB Connection Issues**
   - Check if MongoDB container is running: `docker-compose ps`
   - Verify MongoDB logs: `docker-compose logs mongodb`
   - Ensure MONGODB_URI is correct in .env

2. **Client-Server Communication Issues**
   - Check CORS settings in server/src/index.js
   - Verify CLIENT_URL and SERVER_URL in .env
   - Check Nginx logs: `docker-compose logs client`

3. **Container Build Issues**
   - Clear Docker cache: `docker builder prune`
   - Rebuild specific service: `docker-compose build <service_name>`

## Production Considerations

1. **Security**
   - Use strong secrets for JWT_SECRET and SESSION_SECRET
   - Configure proper CORS settings for production domains
   - Use HTTPS in production
   - Set secure cookie options

2. **Performance**
   - Configure Nginx caching for static assets
   - Set appropriate MongoDB indexes
   - Configure proper connection pool sizes

3. **Monitoring**
   - Set up container health checks
   - Implement logging aggregation
   - Monitor container resource usage

## Backup and Restore

### Database Backup
```bash
# Create a backup
docker-compose exec mongodb mongodump --out /backup

# Copy backup to host
docker cp $(docker-compose ps -q mongodb):/backup ./backup
```

### Database Restore
```bash
# Copy backup to container
docker cp ./backup $(docker-compose ps -q mongodb):/backup

# Restore from backup
docker-compose exec mongodb mongorestore /backup
```

## Additional Commands

- **Pull Latest Environment Variables**
  ```bash
  vercel env pull
  ```

- **View Project Information**
  ```bash
  vercel project ls
  ```

- **Switch Project**
  ```bash
  vercel switch
  ```

- **List Deployments**
  ```bash
  vercel ls
  ```

## Important Notes

1. Ensure `vercel.json` is properly configured:
<augment_code_snippet path="vercel.json" mode="EDIT">
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "client/dist",
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "server/src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/src/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/dist/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}