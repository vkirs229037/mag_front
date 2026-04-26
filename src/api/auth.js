import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_AUTH_SERVICE_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Интерцептор для добавления токена
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

export const authAPI = {
  healthcheck: () => api.get('/api/auth/healthcheck'),
  
  register: (email, password) => 
    api.post('/api/auth/register', { email, password }),
  
  login: (email, password) => 
    api.post('/api/auth/login', { email, password }),
  
  getMe: () => api.get('/api/auth/me'),
  
  listUsers: () => api.get('/api/auth/users'),
  
  deleteUser: (userId) => api.delete(`/api/auth/users/${userId}`)
}
