import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (this.socket) return;

    this.socket = io({
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket подключен');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket отключен:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('⚠️ Ошибка подключения:', error.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onNewMessage(callback) {
    this.socket?.on('newMessage', callback);
  }

  offNewMessage() {
    this.socket?.off('newMessage');
  }

  sendMessage(message, callback) {
    this.socket?.emit('newMessage', message, callback);
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export default new SocketService();
