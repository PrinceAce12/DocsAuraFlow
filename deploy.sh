#!/bin/bash

# Production Deployment Script for Document & Image Suite
# This script prepares the application for production deployment

set -e

echo "🚀 Starting production deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run type checking
echo "🔍 Running type checking..."
npm run type-check

# Run linting
echo "🧹 Running linting..."
npm run lint

# Build the application
echo "🏗️ Building application..."
npm run build

# Run tests (if available)
if [ -f "jest.config.js" ] || grep -q "test" package.json; then
    echo "🧪 Running tests..."
    npm test
fi

# Create production environment file
echo "⚙️ Creating production environment..."
if [ ! -f ".env.production" ]; then
    echo "Creating .env.production from env.example..."
    cp env.example .env.production
    echo "⚠️ Please update .env.production with your production values!"
fi

# Optimize images
echo "🖼️ Optimizing images..."
if command -v imagemin &> /dev/null; then
    npx imagemin public/**/*.{jpg,jpeg,png,gif,svg} --out-dir=public/optimized
fi

# Create deployment package
echo "📦 Creating deployment package..."
tar -czf deployment-$(date +%Y%m%d-%H%M%S).tar.gz \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.next \
    --exclude=*.log \
    --exclude=.env.local \
    .

echo "✅ Deployment package created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.production with your production values"
echo "2. Upload the deployment package to your server"
echo "3. Extract and run: npm ci --only=production"
echo "4. Start the application: npm start"
echo ""
echo "🌐 For Vercel deployment:"
echo "1. Connect your repository to Vercel"
echo "2. Set environment variables in Vercel dashboard"
echo "3. Deploy automatically on push to main branch"
echo ""
echo "🔧 For Docker deployment:"
echo "1. Build: docker build -t document-suite ."
echo "2. Run: docker run -p 3000:3000 document-suite" 