# 🚀 Quick Start Guide

## What You Need to Deploy

**Only 1 thing needs to be deployed: Your LiveKit Server on Fly.io**

Your Deepfilter agent is already deployed at `https://rv2class-audio-agent.fly.dev/`

## Complete Deployment Checklist

### ✅ Step 1: Generate Secure Keys (5 minutes)

```bash
cd /home/roman/Documents/LiveKit
./generate-keys.sh
```

This creates secure API keys for your LiveKit server.

### ✅ Step 2: Deploy to Fly.io (10 minutes)

```bash
./deploy.sh
```

This script will:
- Create your app on Fly.io
- Create storage volume
- Set up secrets
- Deploy LiveKit server
- Give you your server URL

### ✅ Step 3: Update Configuration (2 minutes)

After deployment, get your Fly.io URL:

```bash
flyctl info
```

You'll see something like: `your-app-name.fly.dev`

Update `livekit.yaml` line 47:

```yaml
turn:
  enabled: true
  domain: your-app-name.fly.dev  # <-- Add your actual domain here
```

Then redeploy:

```bash
flyctl deploy
```

### ✅ Step 4: Test Your Setup (5 minutes)

1. Open `examples/web-client.html` in a browser
2. Enter your server URL: `wss://your-app-name.fly.dev`
3. Generate a test token (see below)
4. Connect and test audio

## Generate Test Token

### Option A: Using Python (Recommended)

```bash
cd examples
pip install livekit

# Get your keys from livekit.yaml
export LIVEKIT_API_KEY="your-api-key-from-yaml"
export LIVEKIT_API_SECRET="your-api-secret-from-yaml"

# Generate token
python generate-token.py "test-room" "user123" "Test User"
```

### Option B: Using LiveKit CLI

```bash
# Install LiveKit CLI
brew install livekit  # macOS
# or
curl -sSL https://get.livekit.io/cli | bash  # Linux

# Generate token
livekit-cli create-token \
  --api-key your-api-key \
  --api-secret your-api-secret \
  --join --room test-room \
  --identity user123 \
  --valid-for 24h
```

### Option C: Deploy Token Server

Deploy the Python backend from `examples/generate-token.py`:

**Flask:**
```bash
cd examples
pip install flask flask-cors livekit
export LIVEKIT_API_KEY="your-key"
export LIVEKIT_API_SECRET="your-secret"
flask --app generate-token:create_flask_api run
```

**FastAPI:**
```bash
cd examples
pip install fastapi uvicorn livekit
export LIVEKIT_API_KEY="your-key"
export LIVEKIT_API_SECRET="your-secret"
uvicorn generate-token:create_fastapi_api --reload
```

Then call the API:
```bash
curl -X POST http://localhost:5000/token \
  -H "Content-Type: application/json" \
  -d '{"room": "test-room", "identity": "user123", "name": "Test User"}'
```

## What Gets Deployed Where?

### On Fly.io (Your LiveKit Server):
- ✅ WebRTC server (audio/video routing)
- ✅ Built-in TURN server (connectivity)
- ✅ STUN server (NAT traversal)
- ✅ Room management
- ✅ Integration with your Deepfilter agent

### Already Deployed (Your Deepfilter Agent):
- ✅ https://rv2class-audio-agent.fly.dev/
- ✅ Noise cancellation
- ✅ Echo suppression
- ✅ Audio processing

### Not Deployed Yet (Your Client Apps):
- ⏳ Web frontend (examples/web-client.html)
- ⏳ Token generation backend (examples/generate-token.py)
- ⏳ Your actual application

## Client Integration

### For Browser/Web Apps:
Use `examples/web-client.html` or `examples/client.ts`

Key settings for best audio quality:
```javascript
audioCaptureDefaults: {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  sampleRate: 48000,
}
```

### For Mobile Apps:
Use LiveKit's official SDKs:
- iOS: [livekit-client-sdk-swift](https://github.com/livekit/client-sdk-swift)
- Android: [livekit-client-sdk-android](https://github.com/livekit/client-sdk-android)
- React Native: [livekit-react-native](https://github.com/livekit/livekit-react-native)

### For Desktop Apps:
- Electron: Use the web client SDK
- Native: Use platform-specific SDKs

## Audio Quality Optimization

### Maximum Quality Configuration:

1. **Server-side** (already configured in `livekit.yaml`):
   - ✅ TURN server enabled
   - ✅ High bitrate limits (5 Mbps)
   - ✅ Simulcast enabled
   - ✅ Deepfilter agent integrated

2. **Client-side** (configure in your app):
   - ✅ Echo cancellation enabled
   - ✅ Noise suppression enabled
   - ✅ Auto gain control enabled
   - ✅ 48kHz sample rate
   - ✅ Music preset (highest quality)

3. **Network optimization**:
   - ✅ UDP ports 50000-60000 open
   - ✅ TCP fallback (port 7881)
   - ✅ TURN fallback (ports 3478, 5349)

## Monitoring Your Deployment

```bash
# Check status
flyctl status

# View logs
flyctl logs

# Monitor in real-time
flyctl logs -f

# SSH into server
flyctl ssh console

# Scale resources if needed
flyctl scale vm shared-cpu-2x --memory 4096
```

## Cost Estimate

**Fly.io costs:**
- Small setup (2 CPU, 2GB RAM): ~$10-15/month
- Medium setup (4 CPU, 4GB RAM): ~$30-40/month
- Bandwidth: ~$0.02/GB (first 100GB free)

**For 100 concurrent users with audio:**
- Bandwidth: ~50-100GB/month
- Total: ~$10-40/month depending on usage

## Troubleshooting

### "Cannot connect to server"
- Check firewall allows UDP/TCP traffic
- Verify server URL is correct (wss://)
- Check Fly.io status: `flyctl status`

### "No audio from other participants"
- Click page to enable audio playback
- Check browser permissions
- Verify Deepfilter agent is running

### "Poor audio quality"
- Check network bandwidth
- Verify echo cancellation is enabled client-side
- Monitor with: `flyctl logs`
- Consider using TURN only: `forceTURN: true`

### "Deepfilter agent not working"
- Verify agent URL is accessible: `curl https://rv2class-audio-agent.fly.dev/`
- Check LiveKit logs for agent connection
- Ensure agent is configured in `livekit.yaml`

## Next Steps

1. ✅ Deploy LiveKit server
2. ✅ Test with web client
3. ⏳ Deploy token generation backend
4. ⏳ Build your application
5. ⏳ Add monitoring and analytics
6. ⏳ Set up automatic scaling
7. ⏳ Configure webhooks for events
8. ⏳ Add recording if needed

## Support Resources

- [LiveKit Docs](https://docs.livekit.io/)
- [LiveKit Discord](https://livekit.io/discord)
- [Fly.io Docs](https://fly.io/docs/)
- [Fly.io Community](https://community.fly.io/)

## Security Reminders

- ⚠️ Never commit `livekit.yaml` with real keys to git
- ⚠️ Generate tokens server-side, not in client code
- ⚠️ Use environment variables for secrets
- ⚠️ Rotate API keys periodically
- ⚠️ Monitor for unusual activity
