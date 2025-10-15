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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-8"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-apple-blue via-blue-500 to-blue-600 shadow-2xl mb-6 relative">
                  <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-t from-black/20 to-transparent"></div>
                  <svg className="w-12 h-12 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </motion.div>

              <h1 className="text-7xl md:text-8xl font-display font-bold text-apple-gray-900 mb-6 tracking-tight leading-none">
                RV2Class
              </h1>
              
              <p className="text-3xl md:text-4xl text-apple-gray-700 mb-4 font-semibold tracking-tight">
                1-on-1 Teaching Platform
              </p>
              
              <p className="text-xl text-apple-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
                Crystal-clear video and audio for personalized online lessons.<br />
                Perfect for tutoring sessions with 1-3 students.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
                {[
                  { icon: '👨‍�', title: '1-on-1 Teaching', desc: 'Personal attention' },
                  { icon: '🔇', title: 'Noise Cancellation', desc: 'Distraction-free' },
                  { icon: '�', title: 'Works Everywhere', desc: 'Desktop & Mobile' },
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
                <div className="apple-card p-10 shadow-2xl">
                  <h2 className="text-3xl font-bold text-apple-gray-900 mb-2">
                    Start a Lesson
                  </h2>
                  <p className="text-base text-apple-gray-500 mb-8">
                    Create or join a teaching session with HD video
                  </p>
                  
                  <form onSubmit={handleJoinRoom} className="space-y-5">
                    <div>
                      <label htmlFor="roomName" className="block text-sm font-semibold text-apple-gray-700 mb-2">
                        Lesson Room Name
                      </label>
                      <input
                        type="text"
                        id="roomName"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        className="w-full px-5 py-4 text-lg rounded-2xl border-2 border-apple-gray-300 focus:border-apple-blue focus:ring-4 focus:ring-apple-blue/10 outline-none transition-all bg-white"
                        placeholder="e.g., math-lesson-1"
                        required
                      />
                      <p className="text-sm text-apple-gray-500 mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Use the same name to meet your student
                      </p>
                    </div>

                    <div>
                      <label htmlFor="userName" className="block text-sm font-semibold text-apple-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-5 py-4 text-lg rounded-2xl border-2 border-apple-gray-300 focus:border-apple-blue focus:ring-4 focus:ring-apple-blue/10 outline-none transition-all bg-white"
                        placeholder="Teacher Name"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full apple-button-primary text-lg py-4 font-semibold mt-2"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="apple-spinner w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Joining...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          🎓 Start Teaching Session
                        </span>
                      )}
                    </button>
                  </form>

                  <div className="mt-8 p-5 bg-gradient-to-br from-apple-blue/5 to-purple-500/5 rounded-2xl border border-apple-blue/10">
                    <p className="text-sm font-semibold text-apple-gray-800 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-apple-blue" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      How it works
                    </p>
                    <ol className="text-sm text-apple-gray-700 space-y-2 ml-7 list-decimal">
                      <li>Enter a unique room name</li>
                      <li>Share the room name with your student</li>
                      <li>Both join the same room to connect</li>
                    </ol>
                  </div>
                </div>
              </motion.div>

              {/* Footer Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-20 text-base text-apple-gray-500"
              >
                <p className="flex items-center justify-center gap-3">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-apple-green/10 rounded-full">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-apple-green opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-apple-green"></span>
                    </span>
                    <span className="text-apple-green font-semibold">Online</span>
                  </span>
                  <span className="text-apple-gray-400">•</span>
                  <span className="font-medium">HD Video • AI Audio • Screen Share</span>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
