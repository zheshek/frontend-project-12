import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
})

// Добавляем токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api

// API методы
export const getChannels = () => api.get('/channels')
export const getMessages = () => api.get('/messages')
export const addChannel = (data) => api.post('/channels', data)
export const removeChannel = (id) => api.delete(`/channels/${id}`)
export const renameChannel = (data) => api.patch(`/channels/${data.id}`, data)
export const addMessage = (data) => api.post('/messages', data)
