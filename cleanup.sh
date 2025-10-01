#!/bin/bash

# 🧹 Docker Compose Cleanup Script
# This script completely removes all containers, images, volumes, and networks
# created by the docker-compose.yml file

set -e

echo "🧹 Starting Docker Compose cleanup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yml not found in current directory"
    exit 1
fi

print_status "Stopping all services..."
docker compose down

print_status "Removing all containers..."
docker compose down --remove-orphans

print_status "Removing all volumes..."
docker compose down -v

print_status "Removing all images created by this compose file..."
docker compose down --rmi all

print_status "Removing all networks created by this compose file..."
docker compose down --remove-orphans

print_status "Cleaning up unused Docker resources..."
docker system prune -f

print_status "Removing unused volumes..."
docker volume prune -f

print_status "Removing unused networks..."
docker network prune -f

print_success "✅ Complete cleanup finished!"
print_warning "All containers, images, volumes, and networks from this project have been removed."

echo ""
echo "📋 Summary of what was cleaned:"
echo "  • All running containers stopped and removed"
echo "  • All project images removed"
echo "  • All project volumes removed"
echo "  • All project networks removed"
echo "  • Unused Docker resources cleaned up"
echo ""
echo "🚀 To start fresh, run: docker compose up -d --build"
