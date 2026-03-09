// services/socket.js
import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
  }

  connect() {
    if (this.socket?.connected) {
      console.log('🔄 Using existing socket connection')
      return this.socket
    }

    if (this.socket) {
      console.log('🔄 Reconnecting existing socket')
      this.socket.connect()
      return this.socket
    }

    const token = localStorage.getItem('token')
    if (!token) {
      console.log('❌ No token available')
      return null
    }

    console.log('🆕 Creating new socket connection')
    
    this.socket = io('/', {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    })

    // Добавим базовые логи
    this.socket.on('connect', () => {
      console.log('✅ Socket connected, id:', this.socket?.id)
    })

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason)
    })

    this.socket.on('connect_error', (error) => {
      console.log('❌ Socket connection error:', error.message)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Manually disconnecting socket')
      this.socket.removeAllListeners()
      this.socket.disconnect()
      this.socket = null
    }
  }

  onNewMessage(callback) {
    console.log('📝 Setting up newMessage listener')
    this.socket?.off('newMessage') // Убираем старые
    this.socket?.on('newMessage', (msg) => {
      console.log('📨 New message received via socket:', msg)
      callback(msg)
    })
  }

  offNewMessage() {
    console.log('🗑️ Removing newMessage listener')
    this.socket?.off('newMessage')
  }

  onConnect(callback) {
    this.socket?.off('connect')
    this.socket?.on('connect', callback)
  }

  offConnect(callback) {
    this.socket?.off('connect', callback)
  }

  onDisconnect(callback) {
    this.socket?.off('disconnect')
    this.socket?.on('disconnect', callback)
  }

  offDisconnect(callback) {
    this.socket?.off('disconnect', callback)
  }

  onReconnecting(callback) {
    this.socket?.off('reconnect_attempt')
    this.socket?.on('reconnect_attempt', callback)
  }

  offReconnecting(callback) {
    this.socket?.off('reconnect_attempt', callback)
  }

  sendMessage(message) {
    if (this.socket?.connected) {
      console.log('📤 Sending message via socket:', message)
      this.socket.emit('newMessage', message)
      return true
    } else {
      console.log('❌ Cannot send message - socket not connected')
      return false
    }
  }

  isConnected() {
    return this.socket?.connected || false
  }
}

export default new SocketService()