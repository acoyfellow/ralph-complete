#!/bin/bash
set -e

echo "🚀 deploying ralph..."

echo "📦 installing dependencies..."
bun install

echo "📦 building container..."
docker build -t ralph-opencode .

echo "☁️  pushing to cloudflare..."
bunx wrangler containers push ralph-opencode

echo "🌍 deploying worker..."
bunx wrangler deploy

echo "✅ done!"
echo ""
echo "ralph is live at:"
bunx wrangler deployments list | grep ralph | head -1 | awk '{print $NF}'
