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
      video={true}
      screen={true}
      connect={true}
      options={{
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
        },
        videoCaptureDefaults: {
          resolution: {
            width: 1280,
            height: 720,
            frameRate: 30,
          },
        },
        publishDefaults: {
          audioPreset: {
            maxBitrate: 96000,
          },
          videoCodec: 'vp9',
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
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
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
          {/* Microphone Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMuted(!isMuted)}
            className={`control-button ${
              isMuted
                ? 'bg-apple-red text-white hover:bg-red-600'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </motion.button>

          {/* Camera Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCameraOff(!isCameraOff)}
            className={`control-button ${
              isCameraOff
                ? 'bg-apple-red text-white hover:bg-red-600'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={isCameraOff ? 'Turn On Camera' : 'Turn Off Camera'}
            aria-label={isCameraOff ? 'Enable Camera' : 'Disable Camera'}
          >
            {isCameraOff ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </motion.button>

          {/* Screen Share Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`control-button ${
              isScreenSharing
                ? 'bg-apple-green text-white hover:bg-green-600'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={isScreenSharing ? 'Stop Sharing Screen' : 'Share Your Screen'}
            aria-label={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </motion.button>

          <div className="hidden md:block text-sm text-apple-gray-400 px-4">
            HD Video • Screen Share • AI Audio
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ParticipantCard({ participant, isLocal }: any) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const videoTrack = participant.getTrack('video')
  const screenShareTrack = participant.getTrack('screen_share')
  const displayTrack = screenShareTrack || videoTrack

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
      className="relative aspect-video"
    >
      <div
        className={`relative h-full video-container transition-all duration-300 ${
          isSpeaking ? 'ring-4 ring-apple-green shadow-2xl scale-[1.02]' : 'shadow-lg'
        }`}
      >
        {/* Video Track */}
        {displayTrack && displayTrack.track && (
          <video
            ref={(el) => {
              if (el && displayTrack.track) {
                displayTrack.track.attach(el)
              }
            }}
            autoPlay
            playsInline
            muted={isLocal}
            className="w-full h-full object-cover"
          />
        )}

        {/* Fallback Avatar when no video */}
        {(!displayTrack || !displayTrack.track) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-apple-blue to-blue-600">
            <span className="text-6xl font-bold text-white">
              {participant.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        )}

        {/* Screen Share Label */}
        {screenShareTrack && (
          <div className="absolute top-4 left-4 badge-green shadow-lg animate-pulse">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Screen Sharing
            </span>
          </div>
        )}

        {/* Name Badge */}
        <div className="absolute bottom-4 left-4 badge-dark shadow-lg">
          <span className="font-medium">
            {participant.name || 'Anonymous'}
            {isLocal && ' (You)'}
          </span>
        </div>

        {/* Speaking Indicator */}
        {isSpeaking && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-4 right-4 w-10 h-10 bg-apple-green rounded-full flex items-center justify-center shadow-lg speaking-indicator"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zM6 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm8 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" />
            </svg>
          </motion.div>
        )}

        {/* Muted Indicator */}
        {!participant.isMicrophoneEnabled && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute bottom-4 right-4 w-9 h-9 badge-red shadow-lg flex items-center justify-center"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          </motion.div>
        )}
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
