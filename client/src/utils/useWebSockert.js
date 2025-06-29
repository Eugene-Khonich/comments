import { useEffect } from 'react'

export default function useWebSocket(onMessage) {
  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const wsProtocol = baseUrl.startsWith('https') ? 'wss' : 'ws'
    const wsUrl = baseUrl.replace(/^https?:\/\//, '')
    const socket = new WebSocket(`${wsProtocol}://${wsUrl}`)

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage?.(data)
      } catch (e) {
        console.error('Invalid WebSocket data:', e)
      }
    }

    socket.onerror = (e) => {
      console.error('WebSocket error:', e)
    }

    return () => socket.close()
  }, [onMessage])
}
