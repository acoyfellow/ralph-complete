#!/bin/bash
# End-to-end test script - run this to verify everything works

set -e

echo "🧪 Running end-to-end tests for Ralph..."
echo ""

cd ralph-minimal

echo "📦 Checking dependencies..."
bun install --silent

echo "🔍 Type checking..."
bunx tsc --noEmit

echo "🌐 Testing production deployment..."
bun run test:prod

echo ""
echo "✅ All tests passed!"
echo "🎉 Ralph is working end-to-end"
