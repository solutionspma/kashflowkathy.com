#!/bin/bash

# Netlify Build Script for Kashflow Kathy
# This script runs before the main build

echo "🚀 Starting Netlify build for Kashflow Kathy..."

# Check Node version
echo "Node version: $(node -v)"
echo "npm version: $(npm -v)"

# Install dependencies with legacy peer deps
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Check if build succeeds
echo "🔨 Building Next.js application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Build completed successfully!"
