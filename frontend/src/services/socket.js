import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
    this.connectionCount = 0
    this.listeners = new Map() // храним коллбэки для off
  }

  getSocket() {
    if (this.socket) return this.socket

    this.connectionCount++
    console.log(`🔌 Инициализация сокета (попытка #${this.connectionCount})`)

    const token = localStorage.getItem('token')

    this.socket = io({
      path: '/socket.io',
      transports: ['websocket'], // только websocket — быстрее и стабильнее в CI
      reconnection: true,
      reconnectionAttempts: Infinity, // бесконечно пытаться
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      timeout: 20000,
      withCredentials: true,
      auth: {
        token: token || undefined,
      },
    })

    // Логи подключения
    this.socket.on('connect', () => {
      console.log(`✅ Подключено! Socket ID: ${this.socket.id} (попытка #${this.connectionCount})`)
    })

    this.socket.on('connect_error', (err) => {
      console.error(`⚠️ Ошибка подключения: ${err.message} (попытка #${this.connectionCount})`)
    })

    this.socket.on('disconnect', (reason) => {
      console.log(`❌ Отключено: ${reason} (попытка #${this.connectionCount})`)
    })

    // Логи всех входящих событий (очень полезно для дебага)
    this.socket.onAny((event, ...args) => {
      console.log(`📨 Получено событие: ${event}`, args)
    })

    return this.socket
  }

  connect() {
    this.getSocket() // просто инициализирует, если ещё нет
  }

  disconnect() {
    if (this.socket) {
      console.log(`🔌 Принудительное отключение сокета (попытка #${this.connectionCount})`)
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Универсальный метод подписки с сохранением коллбэка
  on(event, callback) {
    if (!this.socket) this.connect()
    this.socket.on(event, callback)
    if (!this.listeners.has(event)) this.listeners.set(event, [])
    this.listeners.get(event).push(callback)
  }

  // Отписка всех коллбэков от события
  off(event) {
    if (!this.socket) return
    const callbacks = this.listeners.get(event) || []
    callbacks.forEach(cb => this.socket.off(event, cb))
    this.listeners.delete(event)
  }

  // Специальные методы для newMessage (для совместимости с твоим кодом)
  onNewMessage(callback) {
    this.on('newMessage', callback)
  }

  offNewMessage() {
    this.off('newMessage')
  }

  // Отправка сообщения
  sendMessage(message, callback) {
    if (!this.socket?.connected) {
      console.warn('⚠️ Сокет не подключён при отправке сообщения')
      return
    }
    console.log('📤 Отправка сообщения:', message)
    this.socket.emit('newMessage', (message, ack) => {
      console.log('📬 Подтверждение от сервера:', ack)
      if (callback) callback(ack)
    })
  }

  isConnected() {
    return this.socket?.connected ?? false
  }
}

export default new SocketService()
