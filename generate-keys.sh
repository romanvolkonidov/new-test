#!/bin/bash

# Generate secure API keys for LiveKit
# This script generates random keys and updates the livekit.yaml file

set -e

echo "🔐 Generating secure API keys for LiveKit..."
echo ""

# Generate random keys
API_KEY="APIKey_$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)"
API_SECRET=$(openssl rand -base64 64 | tr -d '\n')

echo "✅ Generated keys:"
echo "API_KEY: $API_KEY"
echo "API_SECRET: $API_SECRET"
echo ""

# Backup original file
if [ -f "livekit.yaml" ]; then
    cp livekit.yaml livekit.yaml.backup
    echo "📋 Backed up livekit.yaml to livekit.yaml.backup"
fi

# Update livekit.yaml
if [ -f "livekit.yaml" ]; then
    # Use sed to replace the keys
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/API_KEY: .*/API_KEY: $API_KEY/" livekit.yaml
        sed -i '' "s/API_SECRET: .*/API_SECRET: $API_SECRET/" livekit.yaml
    else
        # Linux
        sed -i "s/API_KEY: .*/API_KEY: $API_KEY/" livekit.yaml
        sed -i "s/API_SECRET: .*/API_SECRET: $API_SECRET/" livekit.yaml
    fi
    echo "✅ Updated livekit.yaml with new keys"
else
    echo "❌ Error: livekit.yaml not found"
    exit 1
fi

echo ""
echo "⚠️  IMPORTANT: Save these keys securely!"
echo "⚠️  Add livekit.yaml to .gitignore to prevent committing secrets"
echo ""
echo "Next steps:"
echo "1. Deploy with: ./deploy.sh"
echo "2. Or manually set secrets: flyctl secrets set LIVEKIT_API_KEY=$API_KEY LIVEKIT_API_SECRET=$API_SECRET"
echo ""
