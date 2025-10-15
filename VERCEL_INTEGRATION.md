# Connecting Your Vercel App to LiveKit

## 🎯 Your Deployed Services

1. **LiveKit Server**: `wss://livekit-server-lively-moon-9428.fly.dev`
2. **Deepfilter Agent**: `https://rv2class-audio-agent.fly.dev/`
3. **Vercel App**: `rv2class-test.vercel.app` (needs fixing)

## 🔧 Fix Your Vercel Deployment Error

### The Problem
```
Error: No Next.js version detected. Make sure your package.json has "next" 
in either "dependencies" or "devDependencies".
```

### Solution Options:

#### Option A: If you have a Next.js project locally
1. Make sure your `package.json` includes:
```json
{
  "dependencies": {
    "next": "^14.0.0",  // or your version
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

2. Push to your repo:
```bash
git add package.json
git commit -m "Add Next.js dependency"
git push
```

3. Vercel will auto-redeploy

#### Option B: Create a new Next.js app with LiveKit
```bash
# Create a new Next.js app
npx create-next-app@latest rv2class-app
cd rv2class-app

# Install LiveKit dependencies
npm install livekit-client @livekit/components-react

# Deploy to Vercel
vercel
```

## 🎤 Integrate LiveKit into Your Vercel App

### 1. Install Dependencies

```bash
npm install livekit-client @livekit/components-react
```

### 2. Create Environment Variables in Vercel

Go to your Vercel project settings → Environment Variables:

```
LIVEKIT_API_KEY=APIKey_SZcGa8BnYS2JbHeKNkPnzVkEn5XRcn6V
LIVEKIT_API_SECRET=WY0N87xFNjSXXlum/2oMlh7QZJYofKKTs4RaTmVdLpgXPYlZrrLsCBntpk6sDeZ997Unxg8OczFn5LBFUBmmwA==
NEXT_PUBLIC_LIVEKIT_URL=wss://livekit-server-lively-moon-9428.fly.dev
```

### 3. Create API Route for Token Generation

Create `app/api/token/route.ts` (App Router) or `pages/api/token.ts` (Pages Router):

```typescript
// app/api/token/route.ts (Next.js 13+ App Router)
import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const room = request.nextUrl.searchParams.get('room');
  const username = request.nextUrl.searchParams.get('username');

  if (!room || !username) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  // Create access token
  const at = new AccessToken(apiKey, apiSecret, {
    identity: username,
    name: username,
  });

  at.addGrant({
    room,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });

  const token = at.toJwt();

  return NextResponse.json({ 
    token,
    wsUrl,
  });
}
```

### 4. Create LiveKit Room Component

Create `components/LiveKitRoom.tsx`:

```typescript
'use client';

import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';
import { useState, useEffect } from 'react';

export default function LiveKitRoomComponent({ roomName, userName }: { roomName: string; userName: string }) {
  const [token, setToken] = useState('');
  const [wsUrl, setWsUrl] = useState('');

  useEffect(() => {
    // Fetch token from your API route
    fetch(`/api/token?room=${roomName}&username=${userName}`)
      .then((res) => res.json())
      .then((data) => {
        setToken(data.token);
        setWsUrl(data.wsUrl);
      });
  }, [roomName, userName]);

  if (!token || !wsUrl) {
    return <div>Loading...</div>;
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={wsUrl}
      audio={true}
      video={false}
      options={{
        // CRITICAL: Enable echo and noise cancellation
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
        },
        publishDefaults: {
          audioPreset: {
            maxBitrate: 96000,
          },
        },
      }}
      connect={true}
      className="h-screen"
    >
      <VideoConference />
    </LiveKitRoom>
  );
}
```

### 5. Use in Your Page

```typescript
// app/room/[roomName]/page.tsx
import LiveKitRoomComponent from '@/components/LiveKitRoom';

export default function RoomPage({ params }: { params: { roomName: string } }) {
  return (
    <div>
      <h1>Room: {params.roomName}</h1>
      <LiveKitRoomComponent 
        roomName={params.roomName} 
        userName="User123" 
      />
    </div>
  );
}
```

## 🚀 Deploy to Vercel

```bash
# If using Vercel CLI
vercel

# Or push to GitHub and let Vercel auto-deploy
git add .
git commit -m "Add LiveKit integration"
git push
```

## 📊 Architecture

```
User Browser (Vercel App)
    ↓ (requests token)
Your Vercel App API
    ↓ (generates JWT)
User Browser
    ↓ (connects with token)
LiveKit Server (Fly.io)
    ↓ (processes audio)
Deepfilter Agent (Fly.io)
    ↓ (noise cancellation)
Other Participants
```

## ✨ Features You'll Have

- ✅ Crystal-clear audio with echo cancellation
- ✅ Noise suppression via Deepfilter
- ✅ Secure token-based authentication
- ✅ Built-in TURN for reliable connectivity
- ✅ Auto-scaling infrastructure

## 🐛 Troubleshooting

### Vercel Build Fails
- Ensure `package.json` has Next.js in dependencies
- Check Root Directory setting in Vercel project settings
- Verify all dependencies are listed in `package.json`

### Can't Connect to LiveKit
- Check environment variables are set in Vercel
- Verify LiveKit server URL: `wss://livekit-server-lively-moon-9428.fly.dev`
- Check API keys match between Vercel and LiveKit server

### No Audio / Poor Quality
- Ensure browser permissions are granted
- Check echo cancellation is enabled in client options
- Verify Deepfilter agent is running

## 📝 Need Help?

Check your LiveKit server status:
```bash
flyctl status --app livekit-server-lively-moon-9428
```

View LiveKit logs:
```bash
flyctl logs --app livekit-server-lively-moon-9428
```

Test LiveKit server:
```bash
curl https://livekit-server-lively-moon-9428.fly.dev/
```

---

**Your LiveKit server is ready and waiting for connections!** 🎉
