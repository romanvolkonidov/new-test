'use client'

import { useState, useEffect } from 'react'
import { LiveKitRoom as LKRoom, useParticipants, useTracks, RoomAudioRenderer } from '@livekit/components-react'
import { Track } from 'livekit-client'
import '@livekit/components-styles'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

interface LiveKitRoomProps {
  roomName: string
  participantName: string
}

export default function LiveKitRoom({ roomName, participantName }: LiveKitRoomProps) {
  const [token, setToken] = useState('')
  const [wsUrl, setWsUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function getToken() {
      try {
        const response = await fetch('/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomName,
            participantName,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to get token')
        }

        const data = await response.json()
        setToken(data.token)
        setWsUrl(data.wsUrl)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to connect. Please try again.')
        setIsLoading(false)
      }
    }

    getToken()
  }, [roomName, participantName])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error) {
    return <ErrorScreen error={error} onRetry={() => router.push('/')} />
  }

  return (
    <LKRoom
      token={token}
      serverUrl={wsUrl}
      audio={true}
      video={false}
      connect={true}
      options={{
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
          dtx: true,
        },
      }}
      className="h-screen bg-apple-gray-900"
    >
      <RoomContent roomName={roomName} participantName={participantName} />
      <RoomAudioRenderer />
    </LKRoom>
  )
}

function RoomContent({ roomName, participantName }: { roomName: string; participantName: string }) {
  const participants = useParticipants()
  const tracks = useTracks()
  const router = useRouter()
  const [isMuted, setIsMuted] = useState(false)
  const [showCopied, setShowCopied] = useState(false)

  const handleLeave = () => {
    router.push('/')
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}/room/${roomName}?name=Guest`
    navigator.clipboard.writeText(link)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-morphism border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white mb-1">{roomName}</h1>
            <p className="text-sm text-apple-gray-400">
              {participants.length} participant{participants.length !== 1 ? 's' : ''} • Deepfilter Active
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all relative"
            >
              {showCopied ? '✓ Copied!' : 'Invite'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLeave}
              className="px-4 py-2 rounded-full bg-apple-red hover:bg-red-600 text-white text-sm font-medium transition-all"
            >
              Leave
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Participants Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {participants.map((participant) => (
                <ParticipantCard
                  key={participant.identity}
                  participant={participant}
                  isLocal={participant.identity === participantName}
                />
              ))}
            </AnimatePresence>
          </div>

          {participants.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-apple-gray-800 mb-4">
                <svg className="w-8 h-8 text-apple-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Waiting for others...</h3>
              <p className="text-apple-gray-400">Share the invite link to get started</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer Controls */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-morphism border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isMuted
                ? 'bg-apple-red text-white'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isMuted ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </motion.button>

          <div className="text-sm text-apple-gray-400">
            Echo cancellation • Noise suppression • Auto gain
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ParticipantCard({ participant, isLocal }: any) {
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    const handleSpeaking = () => setIsSpeaking(true)
    const handleStoppedSpeaking = () => setIsSpeaking(false)

    participant.on('isSpeakingChanged', (speaking: boolean) => {
      setIsSpeaking(speaking)
    })

    return () => {
      participant.off('isSpeakingChanged', handleSpeaking)
    }
  }, [participant])

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="relative"
    >
      <div
        className={`apple-card p-6 transition-all duration-300 ${
          isSpeaking ? 'ring-4 ring-apple-green shadow-2xl' : ''
        }`}
      >
        {/* Avatar */}
        <div className="flex items-center justify-center mb-4">
          <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br from-apple-blue to-blue-600 flex items-center justify-center ${
            isSpeaking ? 'speaking-indicator' : ''
          }`}>
            <span className="text-3xl font-bold text-white">
              {participant.name?.charAt(0).toUpperCase() || 'U'}
            </span>
            {isSpeaking && (
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-apple-green rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-apple-gray-900 mb-1">
            {participant.name || 'Anonymous'}
            {isLocal && <span className="text-sm text-apple-gray-500 ml-2">(You)</span>}
          </h3>
          
          <div className="flex items-center justify-center gap-2 text-sm text-apple-gray-500">
            {participant.isMicrophoneEnabled ? (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Active
              </span>
            ) : (
              <span className="flex items-center gap-1 text-apple-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
                Muted
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-apple-gray-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 border-4 border-apple-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white text-lg">Connecting...</p>
        <p className="text-apple-gray-400 text-sm mt-2">Initializing Deepfilter AI</p>
      </motion.div>
    </div>
  )
}

function ErrorScreen({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-apple-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-16 h-16 bg-apple-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-apple-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">Connection Failed</h2>
        <p className="text-apple-gray-400 mb-6">{error}</p>
        <button
          onClick={onRetry}
          className="apple-button-primary"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  )
}
