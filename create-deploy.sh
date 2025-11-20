#!/bin/bash

echo "📦 Creating deployment folder..."

# Clean and create deploy folder
rm -rf deploy
mkdir -p deploy/_next/static
mkdir -p deploy/cms
mkdir -p deploy/crm

# Copy static assets from .next/static to deploy/_next/static
cp -r .next/static/* deploy/_next/static/ 2>/dev/null || echo "No static files"

# Copy public assets
cp -r public/* deploy/ 2>/dev/null || echo "No public files"

# For Next.js with output: 'export', we need to use next export or the server-rendered pages
# Let's check if we have HTML in server/pages
if [ -d ".next/server/pages" ]; then
    # Copy HTML files if they exist
    find .next/server/pages -name "*.html" -exec cp {} deploy/ \; 2>/dev/null
    
    # Copy CMS HTML files
    find .next/server/pages/cms -name "*.html" -exec cp {} deploy/cms/ \; 2>/dev/null
    
    # Copy CRM HTML files  
    find .next/server/pages/crm -name "*.html" -exec cp {} deploy/crm/ \; 2>/dev/null
fi

# Count files
echo "✅ Deploy folder created!"
echo "📊 Contents:"
echo "   - HTML pages: $(find deploy -name "*.html" | wc -l | tr -d ' ')"
echo "   - Static files: $(find deploy/_next/static -type f | wc -l | tr -d ' ')"
echo "   - Public assets: $(find deploy -maxdepth 1 -type f | wc -l | tr -d ' ')"

ls -la deploy/ | head -20
