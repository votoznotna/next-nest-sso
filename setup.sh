#!/bin/bash

# Next.js + NestJS Todo App with Keycloak SSO - Setup Script
# This script sets up the complete development environment

set -e

echo "🚀 Setting up Next.js + NestJS Todo App with Keycloak SSO..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "⚠️  Node.js is not installed. Docker will be used for development."
else
    NODE_VERSION=$(node --version)
    echo "✅ Node.js version: $NODE_VERSION"
fi

echo ""
echo "📦 Installing root dependencies..."
npm install

echo ""
echo "🔧 Setting up API dependencies..."
cd apps/api
npm install
cd ../..

echo ""
echo "🌐 Setting up Web dependencies..."
cd apps/web
npm install
cd ../..

echo ""
echo "🐳 Starting Docker services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

echo ""
echo "📊 Checking service status..."
docker-compose ps

echo ""
echo "✅ Setup complete!"
echo ""
echo "🔗 Access your services:"
echo "   • Web App: http://localhost:3000"
echo "   • GraphQL API: http://localhost:4000/graphql"
echo "   • Keycloak Admin: http://localhost:8080 (admin/admin)"
echo ""
echo "📖 Next steps:"
echo "   1. Configure Keycloak (see README.md)"
echo "   2. Create a test user"
echo "   3. Test the SSO authentication flow"
echo ""
echo "🔍 View logs: docker-compose logs -f"
echo "🛑 Stop services: docker-compose down"
echo ""
echo "Happy coding! 🎉"