import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import socketService from '../../services/socket';
import { notifyNetworkError, notifyLoadError } from '../../utils/toast';
import profanityFilter from '../../utils/profanity';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/messages');
      // Фильтруем сообщения при загрузке
      const filteredMessages = response.data.map(msg => ({
        ...msg,
        text: profanityFilter.clean(msg.text)
      }));
      return filteredMessages;
    } catch (error) {
      notifyLoadError();
      return rejectWithValue('Ошибка загрузки сообщений');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      // Фильтруем текст перед отправкой
      const cleanText = profanityFilter.clean(messageData.text);
      
      socketService.sendMessage({
        text: cleanText,
        channelId: Number(messageData.channelId)
      });
      
      return {
        id: Date.now(),
        text: cleanText,
        channelId: messageData.channelId,
        username: messageData.username,
        createdAt: new Date().toISOString(),
        removable: true
      };
    } catch (error) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: profanityFilter.clean(messageData.text),
            channelId: Number(messageData.channelId),
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          return {
            ...data,
            text: profanityFilter.clean(data.text)
          };
        }
      } catch (postError) {
        notifyNetworkError();
        return rejectWithValue('Ошибка отправки сообщения');
      }
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
      // Фильтруем сообщение перед добавлением
      const filteredMessage = {
        ...action.payload,
        text: profanityFilter.clean(action.payload.text)
      };
      
      const exists = state.messages.some(m => m.id === filteredMessage.id);
      if (!exists) {
        state.messages.push(filteredMessage);
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
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { addMessageFromSocket, setConnectionStatus } = messagesSlice.actions;
export default messagesSlice.reducer;
