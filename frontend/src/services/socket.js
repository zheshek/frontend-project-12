// services/socket.js
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map(); // универсальные колбэки on/off
    this.connectCallbacks = [];
    this.disconnectCallbacks = [];
    this.reconnectingCallbacks = [];
  }

  getSocket() {
    if (this.socket) return this.socket;

    const token = localStorage.getItem('token');

    this.socket = io({
      path: '/socket.io',
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      timeout: 20000,
      withCredentials: true,
      auth: { token: token || undefined },
    });

    this.socket.on('connect', () => {
      this.connectCallbacks.forEach(cb => cb());
    });

    this.socket.on('disconnect', (reason) => {
      this.disconnectCallbacks.forEach(cb => cb());
    });

    this.socket.io.on('reconnect_attempt', () => {
      this.reconnectingCallbacks.forEach(cb => cb());
    });

    this.socket.onAny((event, ...args) => {
      console.log(`📨 Event: ${event}`, args);
    });

    return this.socket;
  }

  connect() {
    return this.getSocket();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      this.connectCallbacks = [];
      this.disconnectCallbacks = [];
      this.reconnectingCallbacks = [];
    }
  }

  on(event, cb) {
    const socket = this.getSocket();
    socket.on(event, cb);
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(cb);
  }

  off(event) {
    const socket = this.socket;
    if (!socket) return;
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => socket.off(event, cb));
    this.listeners.delete(event);
  }

  onNewMessage(cb) { this.on('newMessage', cb); }
  offNewMessage() { this.off('newMessage'); }

  sendMessage(message, callback) {
    if (!this.socket?.connected) return;
    this.socket.emit('newMessage', message, (ack) => {
      if (callback) callback(ack);
    });
  }

  isConnected() { return this.socket?.connected ?? false; }

  // ⚡ Методы для трёхсостоятий
  onConnect(cb) { this.connectCallbacks.push(cb); if(this.isConnected()) cb(); }
  offConnect(cb) { this.connectCallbacks = this.connectCallbacks.filter(fn => fn !== cb); }

  onDisconnect(cb) { this.disconnectCallbacks.push(cb); }
  offDisconnect(cb) { this.disconnectCallbacks = this.disconnectCallbacks.filter(fn => fn !== cb); }

  onReconnecting(cb) { this.reconnectingCallbacks.push(cb); }
  offReconnecting(cb) { this.reconnectingCallbacks = this.reconnectingCallbacks.filter(fn => fn !== cb); }
}

export default new SocketService();