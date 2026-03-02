import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { showSuccess, showError } from '../../utils/toast'
import socketService from '../../services/socket'

const saveToken = (token) => {
  localStorage.setItem('token', token)
}

const clearToken = () => {
  localStorage.removeItem('token')
}

const reconnectSocket = () => {
  socketService.disconnect()
  socketService.connect()
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/v1/login', {
        username,
        password,
      })

      saveToken(data.token)
      reconnectSocket()

      showSuccess('Добро пожаловать!')

      return data
    } catch (err) {
      if (err.response?.status === 401) {
        return rejectWithValue(
          'Неверные имя пользователя или пароль',
        )
      }

      showError('Ошибка сервера')
      return rejectWithValue('Ошибка сервера')
    }
  },
)

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/v1/signup', {
        username,
        password,
      })

      saveToken(data.token)
      reconnectSocket()

      showSuccess(
        'Регистрация успешна! Добро пожаловать!',
      )

      return data
    } catch (err) {
      if (err.response?.status === 409) {
        showError(
          'Пользователь с таким именем уже существует',
        )
        return rejectWithValue('Conflict')
      }

      showError('Ошибка сервера')
      return rejectWithValue('Ошибка сервера')
    }
  },
)

export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token')

    if (!token) {
      return rejectWithValue('No token')
    }

    return { token }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
    isAuthenticated: Boolean(
      localStorage.getItem('token'),
    ),
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
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(checkAuth.rejected, (state) => {
        state.token = null
        state.isAuthenticated = false
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer