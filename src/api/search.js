import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_SEARCH_SERVICE_URL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

export const searchAPI = {
  healthcheck: () => api.get('/api/search/healthcheck'),
  
  listFiles: () => api.get('/api/search/files'),
  
  viewFile: (filepath, n = 10) => 
    api.get(`/api/search/files/${encodeURIComponent(filepath)}`, { params: { n } }),
  
  search: (query, params = {}) => 
    api.get('/api/search', { 
      params: { 
        query, 
        fuzziness: params.fuzziness, 
        page: params.page, 
        size: params.size 
      } 
    })
}
