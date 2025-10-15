import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import LiveKitRoom from '@/components/LiveKitRoom'
import { motion } from 'framer-motion'

export default function RoomPage() {
  const router = useRouter()
  const { roomName, name } = router.query
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (roomName && name) {
      setIsReady(true)
    }
  }, [roomName, name])

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-apple-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-apple-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Preparing room...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{roomName} - RV2Class</title>
      </Head>

      <LiveKitRoom
        roomName={roomName as string}
        participantName={name as string}
      />
    </>
  )
}
