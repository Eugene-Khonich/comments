import { useEffect, useRef } from 'react'

export default function useWebSocket(onMessage) {
  const socketRef = useRef(null)

  useEffect(() => {
    const baseHttpUrl =
      import.meta.env.VITE_API_BASE_URL || window.location.origin
    const wsProtocol = baseHttpUrl.startsWith('https') ? 'wss' : 'ws'
    const wsHost = baseHttpUrl.replace(/^https?:\/\//, '')
    const wsUrl = `${wsProtocol}://${wsHost}`

    console.log('[WebSocket] Підключення до', wsUrl)
    const socket = new WebSocket(wsUrl)
    socketRef.current = socket

    socket.onopen = () => {
      console.log('[WebSocket] Відкрито зʼєднання')
    }

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage?.(data)
      } catch (e) {
        console.error('[WebSocket] Помилка розбору повідомлення:', e)
      }
    }

    socket.onerror = (event) => {
      console.error('[WebSocket] Помилка:', event)
    }

    socket.onclose = (event) => {
      console.log(
        `[WebSocket] Зʼєднання закрите (код: ${event.code}, причина: ${event.reason})`
      )
    }

    return () => {
      console.log('[WebSocket] Закриваємо зʼєднання')
      socket.close()
    }
  }, [onMessage])
}
