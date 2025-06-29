import WebSocket, { WebSocketServer } from 'ws'

let wss

export function initWebSocket(server) {
  wss = new WebSocketServer({ server })

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {})

    ws.on('close', () => {})
  })
}

export function broadcast(data) {
  if (!wss) {
    return
  }
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  })
}
