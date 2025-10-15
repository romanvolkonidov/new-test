# Fix Vercel "No Next.js version detected" Error

## The Error You're Seeing
```
Warning: Could not identify Next.js version, ensure it is defined as a project dependency.
Error: No Next.js version detected. Make sure your package.json has "next" in either 
"dependencies" or "devDependencies".
```

## Quick Fix (Choose One)

### Option 1: Add Next.js to Existing Project

1. Add to your `package.json`:
```json
{
  "name": "rv2class-test",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "livekit-client": "^2.0.0",
    "@livekit/components-react": "^2.0.0",
    "livekit-server-sdk": "^2.0.0"
  }
}
```

2. Commit and push:
```bash
git add package.json
git commit -m "Add Next.js dependencies"
git push
```

### Option 2: Start Fresh with Next.js + LiveKit

```bash
# Create new Next.js app
npx create-next-app@latest rv2class-app

# Navigate into it
cd rv2class-app

# Install LiveKit
npm install livekit-client @livekit/components-react livekit-server-sdk

# Deploy to Vercel
vercel
```

### Option 3: Check Vercel Root Directory

If you have Next.js in a subdirectory:

1. Go to Vercel Dashboard → Your Project → Settings
2. Find "Root Directory"
3. Set it to where your `package.json` is located (e.g., `frontend/` or `app/`)

## After Fixing

### Set Environment Variables in Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these:

```
LIVEKIT_API_KEY=APIKey_SZcGa8BnYS2JbHeKNkPnzVkEn5XRcn6V
LIVEKIT_API_SECRET=WY0N87xFNjSXXlum/2oMlh7QZJYofKKTs4RaTmVdLpgXPYlZrrLsCBntpk6sDeZ997Unxg8OczFn5LBFUBmmwA==
NEXT_PUBLIC_LIVEKIT_URL=wss://livekit-server-lively-moon-9428.fly.dev
```

### Redeploy

Vercel will automatically redeploy when you push, or manually redeploy from dashboard.

## Need the Full Integration?

See `VERCEL_INTEGRATION.md` for complete setup instructions including:
- Token generation API
- LiveKit room component
- Full code examples

---

**Your LiveKit server is already running and waiting! Just fix the Vercel build and you're done! 🚀**
