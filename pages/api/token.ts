import { AccessToken } from 'livekit-server-sdk'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { roomName, participantName } = req.body

  if (!roomName || !participantName) {
    return res.status(400).json({ error: 'Missing roomName or participantName' })
  }

  const apiKey = process.env.LIVEKIT_API_KEY
  const apiSecret = process.env.LIVEKIT_API_SECRET
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL

  if (!apiKey || !apiSecret || !wsUrl) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      name: participantName,
    })

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    })

    const token = await at.toJwt()

    return res.status(200).json({
      token,
      wsUrl,
    })
  } catch (error) {
    console.error('Token generation error:', error)
    return res.status(500).json({ error: 'Failed to generate token' })
  }
}
