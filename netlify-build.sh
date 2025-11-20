#!/bin/bash

echo "🔧 Starting Netlify build for Kashflow Kathy..."

# Check Node version
echo "Node version: $(node -v)"
echo "npm version: $(npm -v)"

# Install deps
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Build app
echo "⚙️  Building Next.js application..."
npm run build

# If build succeeded
if [ $? -eq 0 ]; then
    echo "✅ Build successful"

    # Clean deploy folder
    rm -rf deploy
    mkdir deploy

    # Copy site files safely
    cp -R .next/standalone/* deploy/
    cp -R .next/static deploy/_next/
    cp -R public deploy/public
    cp -R cms deploy/cms

    echo "📁 Deploy folder ready!"
else
    echo "❌ Build failed"
    exit 1
fi