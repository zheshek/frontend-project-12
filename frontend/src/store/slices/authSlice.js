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
  if (connectionTimer) clearTimeout(connectionTimer)
  
  connectionTimer = setTimeout(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const status = socketService.isConnected()
    if (!status) {
      socketService.connect()
    }

    connectionTimer = null
  }, 1000)
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/v1/login', { username, password })

      saveToken(data.token)
      saveUser({ username: data.username })
      ensureSocketConnection()

      showSuccess('Добро пожаловать!') // ✅ toast при успешном входе
      return data
    } catch (err) {
      if (err.response?.status === 401) {
        const msg = 'Неверные имя пользователя или пароль'
        showError(msg) // ✅ toast при ошибке
        return rejectWithValue(msg)
      }

      const msg = 'Ошибка сервера'
      showError(msg)
      return rejectWithValue(msg)
    }
  }
)

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
    } catch (err) {
      if (err.response?.status === 409) {
        const msg = 'Пользователь с таким именем уже существует'
        showError(msg)
        return rejectWithValue(msg)
      }

      const msg = 'Ошибка сервера'
      showError(msg)
      return rejectWithValue(msg)
    }
  }
)

export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')

    if (!token || !userStr) return rejectWithValue('Нет авторизации')

    try {
      const user = JSON.parse(userStr)
      ensureSocketConnection()
      return { token, user }
    } catch (e) {
      return rejectWithValue('Неверные данные пользователя')
    }
  }
)

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
      .addCase(login.pending, (state) => { state.loading = true; state.error = null })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = { username: action.payload.username }
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        // showError вызывается внутри thunk, поэтому здесь не нужно
      })
      .addCase(signup.pending, (state) => { state.loading = true; state.error = null })
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
      .addCase(checkAuth.pending, (state) => { state.loading = true })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.token = action.payload.token
        state.user = action.payload.user
        state.isAuthenticated = true
        state.loading = false
      })
      .addCase(checkAuth.rejected, (state) => {
        state.token = null
        state.user = null
        state.isAuthenticated = false
        state.loading = false
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
