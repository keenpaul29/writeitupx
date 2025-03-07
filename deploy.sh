#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if running in production mode
if [ "$1" = "prod" ]; then
    echo "Deploying in production mode..."
    COMPOSE_FILE="docker-compose.prod.yml"
else
    echo "Deploying in development mode..."
    COMPOSE_FILE="docker-compose.yml"
fi

# Stop existing containers
docker-compose -f $COMPOSE_FILE down

# Build and start containers
docker-compose -f $COMPOSE_FILE up --build -d

# Show container status
docker-compose -f $COMPOSE_FILE ps

echo "Deployment completed successfully!"