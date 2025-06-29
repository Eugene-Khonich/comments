import { useEffect } from 'react'

export default function useWebSocket(onMessage) {
  useEffect(() => {
    const baseHttpUrl =
      import.meta.env.VITE_API_BASE_URL || window.location.origin
    const wsProtocol = baseHttpUrl.startsWith('https') ? 'wss' : 'ws'
    const wsHost = baseHttpUrl.replace(/^https?:\/\//, '')
    const wsUrl = `${wsProtocol}://${wsHost}`

    const socket = new WebSocket(wsUrl)

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage?.(data)
      } catch {
        // Nothing
      }
    }

    return () => {
      socket.close()
    }
  }, [onMessage])
}
