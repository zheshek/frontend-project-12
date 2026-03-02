import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connectionCount = 0; // Счётчик соединений
  }

  connect() {
    this.connectionCount++;
    console.log(`🔌 Connecting WebSocket... (connection #${this.connectionCount})`);
    
    if (this.socket) {
      console.log('🔄 Socket already exists, reusing');
      return;
    }

    this.socket = io({
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log(`✅ WebSocket подключен, ID: ${this.socket.id} (connection #${this.connectionCount})`);
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`❌ WebSocket отключен: ${reason} (connection #${this.connectionCount})`);
    });

    this.socket.on('connect_error', (error) => {
      console.error(`⚠️ Ошибка подключения: ${error.message} (connection #${this.connectionCount})`);
    });

    this.socket.onAny((event, ...args) => {
      console.log(`📨 [${this.connectionCount}] Socket event:`, event, args);
    });
  }

  disconnect() {
    console.log(`🔌 Disconnecting WebSocket... (connection #${this.connectionCount})`);
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onNewMessage(callback) {
    console.log(`👂 [${this.connectionCount}] Setting up newMessage listener`);
    this.socket?.on('newMessage', (message) => {
      console.log(`📩 [${this.connectionCount}] newMessage received:`, message);
      callback(message);
    });
  }

  offNewMessage() {
    console.log(`🔇 [${this.connectionCount}] Removing newMessage listener`);
    this.socket?.off('newMessage');
  }

  sendMessage(message, callback) {
    console.log(`📤 [${this.connectionCount}] Emitting newMessage:`, message);
    this.socket?.emit('newMessage', message, (response) => {
      console.log(`📬 [${this.connectionCount}] Server ack:`, response);
      if (callback) callback(response);
    });
  }

  isConnected() {
    const connected = this.socket?.connected || false;
    console.log(`📊 [${this.connectionCount}] Connection status:`, connected ? 'connected' : 'disconnected');
    return connected;
  }
}

export default new SocketService();
