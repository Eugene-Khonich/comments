import WebSocket, { WebSocketServer } from 'ws'

let wss

export function initWebSocket(server) {
  wss = new WebSocketServer({ server })

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection')

    ws.on('message', (message) => {
      console.log(`Received message:`, message.toString())
    })

    ws.on('close', () => {
      console.log('WebSocket connection closed')
    })
  })
}

export function broadcast(data) {
  if (!wss) {
    console.error('WebSocket server is not initialized')
    return
  }
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  })
}
