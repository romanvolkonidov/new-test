#!/bin/bash

# LiveKit Deployment Script for Fly.io
# This script automates the deployment of LiveKit server with all necessary configurations

set -e  # Exit on error

echo "🚀 LiveKit Deployment Script for Fly.io"
echo "========================================"
echo ""

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ Error: flyctl is not installed"
    echo "Install it from: https://fly.io/docs/hands-on/install-flyctl/"
    exit 1
fi

# Check if user is logged in
if ! flyctl auth whoami &> /dev/null; then
    echo "❌ Error: Not logged in to Fly.io"
    echo "Run: flyctl auth login"
    exit 1
fi

# Check if livekit.yaml exists
if [ ! -f "livekit.yaml" ]; then
    echo "❌ Error: livekit.yaml not found"
    exit 1
fi

# Check if keys are still default (insecure)
if grep -q "API_KEY: devkey" livekit.yaml; then
    echo "⚠️  WARNING: You're using default API keys!"
    echo ""
    read -p "Do you want to generate secure keys now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ -f "generate-keys.sh" ]; then
            bash generate-keys.sh
        else
            echo "❌ generate-keys.sh not found"
            exit 1
        fi
    else
        echo "⚠️  Proceeding with default keys (NOT RECOMMENDED FOR PRODUCTION)"
    fi
fi

echo ""
echo "📦 Step 1: Checking if app exists..."
APP_NAME=$(grep "^app = " fly.toml | cut -d'"' -f2)

if flyctl status -a "$APP_NAME" &> /dev/null; then
    echo "✅ App '$APP_NAME' exists"
    echo ""
    read -p "Do you want to deploy updates? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 0
    fi
else
    echo "📝 App '$APP_NAME' doesn't exist, creating..."
    flyctl launch --no-deploy --copy-config --name "$APP_NAME"
fi

echo ""
echo "💾 Step 2: Creating volume (if not exists)..."
if ! flyctl volumes list -a "$APP_NAME" 2>/dev/null | grep -q "livekit_data"; then
    REGION=$(grep "^primary_region = " fly.toml | cut -d'"' -f2)
    echo "Creating volume in region: $REGION"
    flyctl volumes create livekit_data --size 1 --region "$REGION" -a "$APP_NAME" || echo "⚠️  Volume might already exist"
else
    echo "✅ Volume already exists"
fi

echo ""
echo "🔐 Step 3: Setting up secrets..."
# Extract keys from livekit.yaml
API_KEY=$(grep "API_KEY:" livekit.yaml | awk '{print $2}')
API_SECRET=$(grep "API_SECRET:" livekit.yaml | awk '{print $2}')

if [ "$API_KEY" != "devkey" ]; then
    echo "Setting LIVEKIT_API_KEY secret..."
    echo "$API_KEY" | flyctl secrets set LIVEKIT_API_KEY=- -a "$APP_NAME"
    echo "Setting LIVEKIT_API_SECRET secret..."
    echo "$API_SECRET" | flyctl secrets set LIVEKIT_API_SECRET=- -a "$APP_NAME"
else
    echo "⚠️  Skipping secrets (using default keys from config file)"
fi

echo ""
echo "🚀 Step 4: Deploying to Fly.io..."
flyctl deploy -a "$APP_NAME"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Your LiveKit server information:"
echo "=================================="
flyctl info -a "$APP_NAME"
echo ""
echo "🌐 Server URL: wss://$(flyctl info -a "$APP_NAME" | grep Hostname | awk '{print $2}')"
echo ""
echo "📊 View logs: flyctl logs -a $APP_NAME"
echo "📈 Check status: flyctl status -a $APP_NAME"
echo "🔍 Monitor: https://fly.io/apps/$APP_NAME"
echo ""
echo "🎤 Don't forget to:"
echo "  1. Update your client applications with the server URL"
echo "  2. Test the Deepfilter agent integration"
echo "  3. Enable echo cancellation in your client code"
echo ""
