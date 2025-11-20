#!/bin/bash

# Production Deployment Script for Kashflow Kathy
# Run this script to prepare for Netlify deployment

echo "🚀 Kashflow Kathy - Netlify Deployment Preparation"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this from the project root."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Warning: Node version should be 18 or higher. Current: $(node -v)"
    echo "   Install Node 18: https://nodejs.org/"
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies
echo "📦 Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi

# Run linter (optional, will continue even if it fails)
echo "🔍 Running ESLint..."
npm run lint || echo "⚠️  Linting warnings found (non-blocking)"

# Build the application
echo "🔨 Building Next.js application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Fix errors above before deploying."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""
echo "Next steps:"
echo "1. Commit your changes: git add . && git commit -m 'Ready for deployment'"
echo "2. Push to GitHub: git push origin main"
echo "3. Netlify will auto-deploy, or deploy manually with: netlify deploy --prod"
echo ""
echo "Don't forget to:"
echo "- Set environment variables in Netlify dashboard"
echo "- Deploy database schema to Supabase"
echo "- Configure custom domain (if applicable)"
echo ""
echo "📚 See DEPLOYMENT-CHECKLIST.md for full deployment guide"
echo ""
