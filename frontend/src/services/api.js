import axios from 'axios'
import { showError } from '../utils/toast'


const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000, // Таймаут 10 секунд
})

// Добавляем токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Обрабатываем ошибки ответов
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Если ошибка 401 (неавторизован) - возможно токен протух
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Не показываем ошибку, просто перенаправим на логин
    }
    
    // Если ошибка сети или сервера
    if (!error.response) {
      showError('Ошибка соединения с сервером')
    }
    
    return Promise.reject(error)
  }
)

export default api

// API методы
export const getChannels = () => api.get('/channels')
export const getMessages = () => api.get('/messages')
export const addChannel = (data) => api.post('/channels', data)
export const removeChannel = (id) => api.delete(`/channels/${id}`)
export const renameChannel = (data) => api.patch(`/channels/${data.id}`, data)
export const addMessage = (data) => api.post('/messages', data)