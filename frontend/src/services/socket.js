// services/socket.js
import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
  }

  connect() {
    // Если сокет уже есть и подключен - возвращаем его
    if (this.socket?.connected) {
      return this.socket
    }

    // Если сокет есть но отключен - пробуем переподключиться
    if (this.socket) {
      this.socket.connect()
      return this.socket
    }

    const token = localStorage.getItem('token')
    if (!token) {
      console.log('No token available')
      return null
    }

    console.log('Creating new socket connection')
    
    // Создаем новое подключение
    this.socket = io('/', {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
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

  // Методы для событий
  onNewMessage(callback) {
    this.socket?.on('newMessage', callback)
  }

  offNewMessage() {
    this.socket?.off('newMessage')
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
    this.socket?.emit('newMessage', message)
  }

  isConnected() {
    return this.socket?.connected || false
  }
}

export default new SocketService()