import { useEffect, useRef } from 'react'

export default function useWebSocket(onMessage) {
  const socketRef = useRef(null)

  useEffect(() => {
    const baseHttpUrl =
      import.meta.env.VITE_API_BASE_URL || window.location.origin
    const wsProtocol = baseHttpUrl.startsWith('https') ? 'wss' : 'ws'
    const wsHost = baseHttpUrl.replace(/^https?:\/\//, '')
    const wsUrl = `${wsProtocol}://${wsHost}`

    const socket = new WebSocket(wsUrl)
    socketRef.current = socket

    socket.onopen = () => {}

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage?.(data)
      } catch (e) {
        console.log(e)
      }
    }

    socket.onerror = (event) => {
      console.log(event)
    }

    socket.onclose = (event) => {
      console.log(event)
    }

    return () => {
      socket.close()
    }
  }, [onMessage])
}
