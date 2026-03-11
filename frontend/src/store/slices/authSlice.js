import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { showSuccess, showError } from '../../utils/toast'
import socketService from '../../services/socket'

const saveToken = (token) => {
  localStorage.setItem('token', token)
}

const saveUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user))
}

const clearToken = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

let connectionTimer = null

const ensureSocketConnection = () => {
  if (connectionTimer) {
    clearTimeout(connectionTimer)
  }

  connectionTimer = setTimeout(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const status = socketService.getStatus()
    console.log('🔌 Socket status in auth:', status)

    if (!status.connected && !status.socketConnected) {
      socketService.connect()
    }
    connectionTimer = null
  }, 1000)
}

// ======================== LOGIN ========================
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/v1/login', { username, password })

      saveToken(data.token)
      saveUser({ username: data.username })
      ensureSocketConnection()

      showSuccess('Добро пожаловать!')

      return data
    }
    catch (err) {
      if (err.response?.status === 401) {
        const errorText = 'Неверные имя пользователя или пароль' // ✅ тест ищет этот текст
        return rejectWithValue(errorText)
      }

      const errorText = 'Ошибка сервера'
      showError(errorText)
      return rejectWithValue(errorText)
    }
  },
)

// ======================== SIGNUP ========================
export const signup = createAsyncThunk(
  'auth/signup',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/v1/signup', { username, password })

      saveToken(data.token)
      saveUser({ username: data.username })
      ensureSocketConnection()

      showSuccess('Регистрация успешна! Добро пожаловать!')

      return data
    }
    catch (err) {
      if (err.response?.status === 409) {
        const errorText = 'Такой пользователь уже существует' // ✅ точно как ищет тест
        showError(errorText)
        return rejectWithValue(errorText)
      }

      const errorText = 'Ошибка сервера'
      showError(errorText)
      return rejectWithValue(errorText)
    }
  },
)

// ======================== CHECK AUTH ========================
export const checkAuth = createAsyncThunk('auth/check', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')

  if (!token || !userStr) {
    return rejectWithValue('No auth data')
  }

  try {
    const user = JSON.parse(userStr)
    return { token, user }
  }
  catch {
    return rejectWithValue('Invalid user data')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
    isAuthenticated: Boolean(localStorage.getItem('token') && localStorage.getItem('user')),
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false

      clearToken()
      socketService.disconnect()

      showSuccess('До встречи!')
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------- LOGIN ----------
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = { username: action.payload.username }
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ---------- SIGNUP ----------
      .addCase(signup.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false
        state.user = { username: action.payload.username }
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ---------- CHECK AUTH ----------
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.token = action.payload.token
        state.user = action.payload.user
        state.isAuthenticated = true
        state.loading = false
        ensureSocketConnection()
      })
      .addCase(checkAuth.rejected, (state) => {
        state.token = null
        state.user = null
        state.isAuthenticated = false
        state.loading = false
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
