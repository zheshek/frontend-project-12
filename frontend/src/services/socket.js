import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
  }

  connect() {
    if (this.socket?.connected) return this.socket
    if (this.socket) {
      this.socket.connect()
      return this.socket
    }

    const token = localStorage.getItem('token')
    if (!token) return null

    this.socket = io('/', {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    })

    this.socket.on('connect_error', err => {
      console.error('Socket connect_error:', err.message)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners()
      this.socket.disconnect()
      this.socket = null
    }
  }

  onNewMessage(callback) {
    this.socket?.on('newMessage', callback)
  }

  offNewMessage(callback) {
    this.socket?.off('newMessage', callback)
  }

  onConnect(callback) {
    this.socket?.on('connect', callback)
  }

  offConnect(callback) {
    this.socket?.off('connect', callback)
  }

  onDisconnect(callback) {
    this.socket?.on('disconnect', callback)
  }

  offDisconnect(callback) {
    this.socket?.off('disconnect', callback)
  }

  onReconnecting(callback) {
    this.socket?.on('reconnect_attempt', callback)
  }

  offReconnecting(callback) {
    this.socket?.off('reconnect_attempt', callback)
  }

  sendMessage(message) {
    if (this.socket?.connected) {
      this.socket.emit('newMessage', message)
      return true
    }
    return false
  }

  isConnected() {
    return this.socket?.connected || false
  }
}

export default new SocketService()
