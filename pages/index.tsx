import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

export default function Home() {
  const router = useRouter()
  const [roomName, setRoomName] = useState('')
  const [userName, setUserName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roomName || !userName) return

    setIsLoading(true)
    router.push(`/room/${encodeURIComponent(roomName)}?name=${encodeURIComponent(userName)}`)
  }

  const handleQuickJoin = () => {
    const quickRoomName = `room-${Math.random().toString(36).substring(2, 8)}`
    const quickUserName = `user-${Math.random().toString(36).substring(2, 6)}`
    router.push(`/room/${quickRoomName}?name=${quickUserName}`)
  }

  return (
    <>
      <Head>
        <title>RV2Class - Crystal Clear Audio</title>
        <meta name="description" content="Experience crystal-clear audio with advanced noise cancellation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-white via-apple-gray-50 to-apple-gray-100">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-apple-blue/5 via-transparent to-apple-green/5" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {/* Logo/Brand */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-apple-blue to-blue-600 shadow-lg mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
              </motion.div>

              <h1 className="text-6xl md:text-7xl font-display font-bold text-apple-gray-900 mb-6 tracking-tight">
                RV2Class
              </h1>
              
              <p className="text-2xl md:text-3xl text-apple-gray-600 mb-4 font-medium">
                Crystal-clear audio
              </p>
              
              <p className="text-lg text-apple-gray-500 max-w-2xl mx-auto mb-12">
                Experience next-generation audio communication with AI-powered noise cancellation and echo suppression.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
                {[
                  { icon: '🎤', title: 'Clear Audio', desc: '48kHz high-quality' },
                  { icon: '🔇', title: 'Noise Cancellation', desc: 'AI-powered Deepfilter' },
                  { icon: '📶', title: 'Always Connected', desc: '99%+ reliability' },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="apple-card p-6"
                  >
                    <div className="text-4xl mb-3">{feature.icon}</div>
                    <h3 className="text-lg font-semibold text-apple-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-apple-gray-500">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Join Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-md mx-auto"
              >
                <div className="apple-card p-8">
                  <h2 className="text-2xl font-semibold text-apple-gray-900 mb-6">
                    Join a Room
                  </h2>
                  
                  <form onSubmit={handleJoinRoom} className="space-y-4">
                    <div>
                      <label htmlFor="roomName" className="block text-sm font-medium text-apple-gray-700 mb-2">
                        Room Name
                      </label>
                      <input
                        type="text"
                        id="roomName"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-apple-gray-300 focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 outline-none transition-all"
                        placeholder="my-awesome-room"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="userName" className="block text-sm font-medium text-apple-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-apple-gray-300 focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 outline-none transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full apple-button-primary text-lg"
                    >
                      {isLoading ? 'Joining...' : 'Join Room'}
                    </button>
                  </form>

                  <div className="mt-4 text-center">
                    <button
                      onClick={handleQuickJoin}
                      className="text-apple-blue hover:text-blue-600 font-medium text-sm transition-colors"
                    >
                      Quick Join (Random Room)
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Footer Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-16 text-sm text-apple-gray-500"
              >
                <p className="flex items-center justify-center gap-2">
                  <span className="inline-block w-2 h-2 bg-apple-green rounded-full animate-pulse" />
                  Server online • Deepfilter AI active • TURN enabled
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
