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
      const { data } = await api.get('/channels')
      return data
    } catch {
      notifyNetworkError()
      return rejectWithValue('Ошибка загрузки каналов')
    }
  },
)

export const addChannel = createAsyncThunk(
  'channels/addChannel',
  async (name, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/channels', { name })
      notifyChannelCreated()
      return data
    } catch {
      notifyNetworkError()
      return rejectWithValue('Ошибка при создании канала')
    }
  },
)

export const removeChannel = createAsyncThunk(
  'channels/removeChannel',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/channels/${id}`)
      notifyChannelRemoved()
      return id
    } catch {
      notifyNetworkError()
      return rejectWithValue('Ошибка при удалении канала')
    }
  },
)

export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/channels/${id}`, { name })
      notifyChannelRenamed()
      return data
    } catch {
      notifyNetworkError()
      return rejectWithValue('Ошибка при переименовании канала')
    }
  },
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
    setCurrentChannel: (state, { payload }) => {
      state.currentChannelId = payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchChannels.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchChannels.fulfilled, (state, { payload }) => {
        state.loading = false
        state.channels = payload

        if (!state.currentChannelId && payload.length > 0) {
          const defaultChannel = payload.find(c => !c.removable)
          state.currentChannelId =
            defaultChannel?.id ?? payload[0].id
        }
      })
      .addCase(fetchChannels.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload
      })
      .addCase(addChannel.fulfilled, (state, { payload }) => {
        state.channels.push(payload)
        state.currentChannelId = payload.id
      })
      .addCase(addChannel.rejected, (state, { payload }) => {
        state.error = payload
      })
      .addCase(removeChannel.fulfilled, (state, { payload }) => {
        state.channels = state.channels.filter(
          c => c.id !== payload,
        )

        if (state.currentChannelId === payload) {
          const defaultChannel =
            state.channels.find(c => !c.removable)

          state.currentChannelId =
            defaultChannel?.id ?? null
        }
      })
      .addCase(renameChannel.fulfilled, (state, { payload }) => {
        const index = state.channels.findIndex(
          c => c.id === payload.id,
        )

        if (index !== -1) {
          state.channels[index] = payload
        }
      })
      .addCase(renameChannel.rejected, (state, { payload }) => {
        state.error = payload
      })
  },
})

export const { setCurrentChannel } = channelsSlice.actions
export default channelsSlice.reducer