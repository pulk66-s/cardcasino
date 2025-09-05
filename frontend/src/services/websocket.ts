import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '../store'

class WebSocketService {
  private socket: Socket | null = null
  private url: string

  constructor() {
    this.url = import.meta.env.VITE_WS_URL || 'http://localhost:3001'
  }

  connect() {
    const token = useAuthStore.getState().token
    
    this.socket = io(this.url, {
      auth: {
        token
      },
      transports: ['websocket']
    })

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket')
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket')
    })

    this.socket.on('error', (error: any) => {
      console.error('WebSocket error:', error)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }

  getSocket() {
    return this.socket
  }

  isConnected() {
    return this.socket?.connected || false
  }
}

export const webSocketService = new WebSocketService()
export default webSocketService
