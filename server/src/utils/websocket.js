import WebSocket, { WebSocketServer } from 'ws'

let wss

export function initWebSocket(server) {
  wss = new WebSocketServer({ server })
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
