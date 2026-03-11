import axios from 'axios'
import { showError } from '../utils/toast'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  (error) => {
    const status = error.response?.status
    const dataMessage = error.response?.data?.message

    if (status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      showError('Неавторизован. Пожалуйста, войдите снова.')
    }
    else if (!error.response) {
      showError('Ошибка соединения с сервером')
    }
    else if (dataMessage) {
      showError(dataMessage)
    }
    else {
      showError('Произошла ошибка')
    }

    return Promise.reject(error)
  },
)

export default api

// API методы
export const getChannels = () => api.get('/channels')
export const getMessages = () => api.get('/messages')
export const addChannel = data => api.post('/channels', data)
export const removeChannel = id => api.delete(`/channels/${id}`)
export const renameChannel = data => api.patch(`/channels/${data.id}`, data)
export const addMessage = data => api.post('/messages', data)
