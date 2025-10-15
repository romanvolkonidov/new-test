# LiveKit Server on Fly.io with Deepfilter Noise Agent

This setup deploys a LiveKit server on Fly.io with integrated Deepfilter noise cancellation agent for the best possible audio quality with noise and echo cancellation.

## 🎯 Features

- ✅ LiveKit WebRTC server with optimized audio settings
- ✅ Built-in TURN server for maximum connectivity
- ✅ Deepfilter noise agent integration (https://rv2class-audio-agent.fly.dev/)
- ✅ Echo cancellation and noise suppression
- ✅ UDP + TCP fallback for firewall traversal
- ✅ Auto-scaling and health checks

## 📋 Prerequisites

1. [Fly.io CLI](https://fly.io/docs/hands-on/install-flyctl/) installed
2. Fly.io account (sign up at https://fly.io)
3. Your Deepfilter agent running at https://rv2class-audio-agent.fly.dev/

## 🚀 Deployment Steps

### 1. Install Fly.io CLI (if not installed)

```bash
curl -L https://fly.io/install.sh | sh
```

### 2. Login to Fly.io

```bash
flyctl auth login
```

### 3. Generate Secure API Keys

Before deploying, you MUST generate secure API keys. Run:

```bash
./generate-keys.sh
```

This will update `livekit.yaml` with secure keys. **Never commit the file with real keys to git!**

### 4. Create Secrets in Fly.io

```bash
# Set your LiveKit API key and secret
flyctl secrets set LIVEKIT_API_KEY="your-generated-api-key"
flyctl secrets set LIVEKIT_API_SECRET="your-generated-api-secret"
```

### 5. Create a Volume for Persistence (Optional)

```bash
flyctl volumes create livekit_data --size 1 --region ord
```

### 6. Deploy to Fly.io

```bash
./deploy.sh
```

Or manually:

```bash
flyctl launch --no-deploy
flyctl deploy
```

### 7. Get Your Server URL

```bash
flyctl info
```

Your LiveKit server will be at: `wss://your-app-name.fly.dev`

## 🔧 Configuration

### Update Your Domain

After deployment, update `livekit.yaml` with your actual Fly.io domain:

```yaml
turn:
  domain: your-app-name.fly.dev
```

Then redeploy:

```bash
flyctl deploy
```

### Configure Deepfilter Agent

The agent is already configured in `livekit.yaml`:

```yaml
agents:
  - name: deepfilter-noise-agent
    url: https://rv2class-audio-agent.fly.dev/
    namespace: "default"
```

## 🎤 Client-Side Setup for Best Audio Quality

### Browser/Web Client

```javascript
import { Room, RoomEvent, AudioPresets } from 'livekit-client';

const room = new Room({
  audioCaptureDefaults: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  publishDefaults: {
    audioPreset: AudioPresets.music, // Highest quality
    // or AudioPresets.speech for lower bandwidth
  },
});

await room.connect('wss://your-app-name.fly.dev', token);
```

### React Client

```javascript
import { LiveKitRoom, useParticipant } from '@livekit/components-react';

<LiveKitRoom
  serverUrl="wss://your-app-name.fly.dev"
  token={token}
  audio={true}
  video={false}
  options={{
    audioCaptureDefaults: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  }}
>
  {/* Your app */}
</LiveKitRoom>
```

## 🔐 Security Best Practices

1. **Never expose API keys**: Use environment variables or secrets management
2. **Generate tokens server-side**: Use LiveKit's token generation in your backend
3. **Use HTTPS/WSS**: Always use secure connections (automatically handled by Fly.io)
4. **Rotate keys**: Periodically regenerate your API keys
5. **Add webhook authentication**: If using webhooks, secure them with API keys

## 📊 Monitoring

### Check Server Status

```bash
flyctl status
```

### View Logs

```bash
flyctl logs
```

### SSH into Container

```bash
flyctl ssh console
```

### Health Check

Your server has a health endpoint at: `https://your-app-name.fly.dev/health`

## 🎛️ Scaling

### Scale Vertically (More Resources)

```bash
flyctl scale vm shared-cpu-2x --memory 4096
```

### Scale Horizontally (More Instances)

```bash
flyctl scale count 2 --region ord
```

For production with multiple regions:

```bash
flyctl scale count 3 --region ord,iad,sjc
```

## 🐛 Troubleshooting

### Connection Issues

1. Check firewall settings - ensure UDP ports 50000-60000 are accessible
2. Verify TURN is enabled in `livekit.yaml`
3. Test with TURN only: Use `forceTURN: true` in client options

### Audio Quality Issues

1. Ensure Deepfilter agent is running and accessible
2. Check that `echoCancellation` and `noiseSuppression` are enabled client-side
3. Use `AudioPresets.music` for highest quality
4. Monitor bandwidth - reduce quality if network is poor

### Agent Not Connecting

1. Verify agent URL: `https://rv2class-audio-agent.fly.dev/`
2. Check agent logs for errors
3. Ensure agent is configured to accept LiveKit connections
4. Test agent endpoint directly

### Debug Mode

Enable debug logging in `livekit.yaml`:

```yaml
logging:
  level: debug
```

Then redeploy and check logs:

```bash
flyctl deploy
flyctl logs
```

## 📚 Resources

- [LiveKit Documentation](https://docs.livekit.io/)
- [LiveKit GitHub](https://github.com/livekit/livekit)
- [Fly.io Documentation](https://fly.io/docs/)
- [WebRTC Best Practices](https://webrtc.org/getting-started/overview)

## 🔄 Updates

To update LiveKit to the latest version:

```bash
flyctl deploy --image livekit/livekit-server:latest
```

## 💰 Cost Estimation

Fly.io pricing (approximate):

- VM (2 CPU, 2GB RAM): ~$0.0000008/sec (~$2/month per instance)
- Bandwidth: $0.02/GB (first 100GB free per month)
- Volume (1GB): ~$0.15/month

For a small-medium app with ~100 concurrent users, expect ~$10-30/month.

## 📝 License

This configuration is provided as-is. LiveKit is licensed under Apache 2.0.
# new-test
