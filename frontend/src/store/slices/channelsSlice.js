import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import {
  notifyChannelCreated,
  notifyChannelRenamed,
  notifyChannelRemoved,
  notifyNetworkError,
} from '../../utils/toast'

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/channels')
      return response.data
    } catch (error) {
      notifyNetworkError()
      return rejectWithValue('Ошибка загрузки каналов')
    }
  }
)

export const addChannel = createAsyncThunk(
  'channels/addChannel',
  async (name, { rejectWithValue }) => {
    try {
      // Убираем проверку нецензурных слов - она уже сделана в модальном окне!
      const response = await api.post('/channels', { name })
      notifyChannelCreated()
      return response.data
    } catch (error) {
      notifyNetworkError()
      return rejectWithValue('Ошибка при создании канала')
    }
  }
)

export const removeChannel = createAsyncThunk(
  'channels/removeChannel',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/channels/${id}`)
      notifyChannelRemoved()
      return id
    } catch (error) {
      notifyNetworkError()
      return rejectWithValue('Ошибка при удалении канала')
    }
  }
)

export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      // Для переименования тоже убираем проверку
      const response = await api.patch(`/channels/${id}`, { name })
      notifyChannelRenamed()
      return response.data
    } catch (error) {
      notifyNetworkError()
      return rejectWithValue('Ошибка при переименовании канала')
    }
  }
)

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    channels: [],
    currentChannelId: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false
        state.channels = action.payload
        if (!state.currentChannelId && action.payload.length > 0) {
          const defaultChannel = action.payload.find(c => !c.removable)
          state.currentChannelId = defaultChannel?.id || action.payload[0].id
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(addChannel.fulfilled, (state, action) => {
        state.channels.push(action.payload)
        state.currentChannelId = action.payload.id // ← ВАЖНО: автоматически выбираем новый канал
      })
      .addCase(addChannel.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(removeChannel.fulfilled, (state, action) => {
        state.channels = state.channels.filter(c => c.id !== action.payload)
        if (state.currentChannelId === action.payload) {
          const defaultChannel = state.channels.find(c => !c.removable)
          state.currentChannelId = defaultChannel?.id || null
        }
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        const index = state.channels.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.channels[index] = action.payload
        }
      })
      .addCase(renameChannel.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { setCurrentChannel } = channelsSlice.actions
export default channelsSlice.reducer