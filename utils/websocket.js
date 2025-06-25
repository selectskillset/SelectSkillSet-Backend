import { WebSocketServer } from 'ws'

export const initializeWebSocket = server => {
  const wss = new WebSocketServer({ server })

  wss.on('connection', ws => {
    console.log('Client connected via WebSocket')

    ws.on('close', () => {
      console.log('Client disconnected')
    })
  })

  return wss
}

export const broadcastMessage = (wss, message) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocketServer.OPEN) {
      client.send(JSON.stringify(message))
    }
  })
}
