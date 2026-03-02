// frontend/src/store/slices/messagesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import socketService from '../../services/socket';
import { notifyNetworkError } from '../../utils/toast';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      console.log('📥 Fetching messages from server...');
      const response = await api.get('/messages');
      console.log('📥 Messages loaded:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error loading messages:', error);
      notifyNetworkError();
      return rejectWithValue('Ошибка загрузки сообщений');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      console.log('📤 Sending message to server:', messageData);
      const response = await api.post('/messages', messageData);
      console.log('📤 Message saved on server:', response.data);
      
      // Отправляем через сокет для real-time
      socketService.sendMessage(response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error sending message:', error);
      notifyNetworkError();
      return rejectWithValue('Ошибка отправки сообщения');
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    loading: false,
    error: null,
    connectionStatus: 'disconnected',
  },
  reducers: {
    addMessageFromSocket: (state, action) => {
      console.log('📨 Adding message from socket:', action.payload);
      // Проверяем, нет ли уже такого сообщения (чтобы избежать дубликатов)
      const exists = state.messages.some(m => m.id === action.payload.id);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload; // ← Заменяем, а не добавляем!
        console.log('✅ Messages state updated:', state.messages.length);
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        // Не добавляем здесь, так как сообщение придёт через socket
        console.log('✅ Message sent, will arrive via socket');
      });
  },
});

export const { addMessageFromSocket, setConnectionStatus } = messagesSlice.actions;
export default messagesSlice.reducer;
