import axios from 'axios'
import { useAuthStore } from '../store'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: async (data: { login: string; email: string; password: string }) => {
    const response = await api.post('/users/register', data)
    return response.data
  },
  
  login: async (data: { login: string; password: string }) => {
    const response = await api.post('/users/login', data)
    return response.data
  },
  
  profile: async () => {
    const response = await api.get('/users/profile')
    return response.data
  },
}

// Game API
export const gameAPI = {
  newGame: async (name: string) => {
    const response = await api.post('/games/new', { name })
    return response.data
  },
  
  joinGame: async (gameId: number) => {
    const response = await api.post('/games/join', { gameid: gameId })
    return response.data
  },
  
  startGame: async (gameId: number) => {
    const response = await api.post('/games/start', { gameid: gameId })
    return response.data
  },
  
  getPlayers: async (gameId: number) => {
    const response = await api.post('/games/players', { gameid: gameId })
    return response.data
  },
  
  listGames: async () => {
    const response = await api.get('/games')
    return response.data
  },
}

// Case API
export const caseAPI = {
  getAllCases: async () => {
    const response = await api.get('/cases')
    return response.data
  },
  
  openCase: async (caseId: number) => {
    const response = await api.post('/cases/open', { caseId })
    return response.data
  },
  
  createCase: async (data: {
    name: string
    price: number
    items: Array<{ cardId: number; dropRate: number }>
  }) => {
    const response = await api.post('/cases', data)
    return response.data
  },
}

// Card API
export const cardAPI = {
  getAllCards: async () => {
    const response = await api.get('/cards')
    return response.data
  },
  
  getCard: async (id: number) => {
    const response = await api.get(`/cards/${id}`)
    return response.data
  },
}

export default api
