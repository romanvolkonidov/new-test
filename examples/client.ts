// LiveKit Client Example with Best Audio Quality Settings
// This is an EXAMPLE file - copy this code into your actual project
// Install in your project: npm install livekit-client @types/node

// @ts-nocheck - This is an example file without dependencies installed
import { Room, RoomEvent, AudioPresets, RoomOptions } from 'livekit-client';

/**
 * Connect to LiveKit room with optimized audio settings for
 * noise and echo cancellation with Deepfilter agent
 */
async function connectToRoom(serverUrl: string, token: string) {
  // Room options optimized for audio quality
  const roomOptions: RoomOptions = {
    // Audio capture settings - CRITICAL for noise/echo cancellation
    audioCaptureDefaults: {
      // Enable browser-level echo cancellation
      echoCancellation: true,
      // Enable browser-level noise suppression
      noiseSuppression: true,
      // Automatic gain control for consistent volume
      autoGainControl: true,
      // Mono audio (reduces bandwidth, good for voice)
      channelCount: 1,
      // High sample rate for quality
      sampleRate: 48000,
    },

    // Publishing defaults
    publishDefaults: {
      // Use 'music' preset for highest quality
      // Use 'speech' preset for lower bandwidth
      audioPreset: AudioPresets.music,
      
      // Enable DTX (Discontinuous Transmission) to save bandwidth
      dtx: true,
      
      // Red (Redundant Audio Data) for packet loss recovery
      red: true,
    },

    // Adaptive streaming - adjusts quality based on network
    adaptiveStream: true,
    
    // Dynacast - optimizes bandwidth usage
    dynacast: true,

    // For debugging connectivity issues, you can force TURN
    // rtcConfig: {
    //   iceTransportPolicy: 'relay', // Forces TURN usage
    // },
  };

  // Create room instance
  const room = new Room(roomOptions);

  // Set up event listeners
  setupEventListeners(room);

  try {
    // Connect to the room
    await room.connect(serverUrl, token);
    console.log('Connected to room:', room.name);

    // Enable microphone
    await room.localParticipant.setMicrophoneEnabled(true);
    console.log('Microphone enabled');

    // The Deepfilter agent will automatically process your audio stream
    console.log('Deepfilter agent will process your audio for noise/echo cancellation');

    return room;
  } catch (error) {
    console.error('Failed to connect:', error);
    throw error;
  }
}

/**
 * Set up event listeners for room events
 */
function setupEventListeners(room: Room) {
  // Room connected
  room.on(RoomEvent.Connected, () => {
    console.log('Successfully connected to room');
    console.log('Local participant:', room.localParticipant.identity);
  });

  // Room disconnected
  room.on(RoomEvent.Disconnected, (reason?: string) => {
    console.log('Disconnected from room:', reason);
  });

  // Participant joined
  room.on(RoomEvent.ParticipantConnected, (participant) => {
    console.log('Participant joined:', participant.identity);
  });

  // Participant left
  room.on(RoomEvent.ParticipantDisconnected, (participant) => {
    console.log('Participant left:', participant.identity);
  });

  // Track subscribed (remote participant's audio/video)
  room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
    console.log('Track subscribed:', track.kind, 'from', participant.identity);
    
    if (track.kind === 'audio') {
      // Attach audio track to play through speakers
      const audioElement = track.attach();
      document.body.appendChild(audioElement);
    }
  });

  // Track unsubscribed
  room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
    console.log('Track unsubscribed:', track.kind, 'from', participant.identity);
    track.detach();
  });

  // Audio playback status changed (user needs to interact with page)
  room.on(RoomEvent.AudioPlaybackStatusChanged, () => {
    if (!room.canPlaybackAudio) {
      console.log('Audio playback blocked - user interaction required');
      // Show UI prompt for user to click
    }
  });

  // Connection quality changed
  room.on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
    console.log('Connection quality changed:', quality, 'for', participant.identity);
  });

  // Speaking status changed
  room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
    console.log('Active speakers:', speakers.map(s => s.identity));
  });

  // Track muted/unmuted
  room.on(RoomEvent.TrackMuted, (publication, participant) => {
    console.log('Track muted:', publication.kind, 'from', participant.identity);
  });

  room.on(RoomEvent.TrackUnmuted, (publication, participant) => {
    console.log('Track unmuted:', publication.kind, 'from', participant.identity);
  });

  // Data received (for text chat, etc.)
  room.on(RoomEvent.DataReceived, (payload, participant) => {
    const decoder = new TextDecoder();
    const message = decoder.decode(payload);
    console.log('Data received from', participant?.identity, ':', message);
  });
}

/**
 * Additional audio controls
 */
async function toggleMicrophone(room: Room) {
  const enabled = room.localParticipant.isMicrophoneEnabled;
  await room.localParticipant.setMicrophoneEnabled(!enabled);
  console.log('Microphone', enabled ? 'disabled' : 'enabled');
}

async function setAudioDevice(room: Room, deviceId: string) {
  await room.switchActiveDevice('audioinput', deviceId);
  console.log('Switched to audio device:', deviceId);
}

async function getAudioDevices(): Promise<MediaDeviceInfo[]> {
  const devices = await Room.getLocalDevices('audioinput');
  return devices;
}

/**
 * Send text message to room
 */
async function sendMessage(room: Room, message: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  await room.localParticipant.publishData(data, { reliable: true });
}

/**
 * Disconnect from room
 */
function disconnect(room: Room) {
  room.disconnect();
  console.log('Disconnected from room');
}

// Example usage
async function main() {
  const serverUrl = 'wss://your-app-name.fly.dev';
  
  // You need to generate this token from your backend
  // See: https://docs.livekit.io/guides/access-tokens/
  const token = 'your-access-token';

  try {
    const room = await connectToRoom(serverUrl, token);

    // Get available audio devices
    const devices = await getAudioDevices();
    console.log('Available audio devices:', devices);

    // Example: Toggle microphone after 5 seconds
    setTimeout(() => {
      toggleMicrophone(room);
    }, 5000);

    // Example: Send a message
    await sendMessage(room, 'Hello from LiveKit!');

    // Disconnect after 60 seconds (for demo purposes)
    // setTimeout(() => {
    //   disconnect(room);
    // }, 60000);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Export functions for use in your app
export {
  connectToRoom,
  toggleMicrophone,
  setAudioDevice,
  getAudioDevices,
  sendMessage,
  disconnect,
};

// Run if this is the main module
if (require.main === module) {
  main();
}
