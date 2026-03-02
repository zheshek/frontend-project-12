import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import socketService from '../../services/socket';
import { notifyNetworkError } from '../../utils/toast';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/messages');
      return data;
    } catch {
      notifyNetworkError();
      return rejectWithValue('Ошибка загрузки сообщений');
    }
  },
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/messages', messageData);

      socketService.sendMessage(data);

      return data;
    } catch {
      notifyNetworkError();
      return rejectWithValue('Ошибка отправки сообщения');
    }
  },
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
    addMessageFromSocket: (state, { payload }) => {
      const exists = state.messages.some((m) => m.id === payload.id);

      if (!exists) {
        state.messages.push(payload);
      }
    },
    setConnectionStatus: (state, { payload }) => {
      state.connectionStatus = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.messages = payload;
      })
      .addCase(fetchMessages.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(sendMessage.fulfilled, () => {});
  },
});

export const { addMessageFromSocket, setConnectionStatus } =
  messagesSlice.actions;

export default messagesSlice.reducer;
