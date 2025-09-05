import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  uuid: string
  login: string
  balance: number
}

export interface Game {
  id: number
  name: string
  players: User[]
  isStarted: boolean
  createdBy: string
}

export interface CaseItem {
  id: number
  name: string
  rarity: string
  price: number
  image?: string
}

export interface Case {
  id: number
  name: string
  price: number
  image?: string
  items: CaseItem[]
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  updateBalance: (balance: number) => void
}

interface GameState {
  currentGame: Game | null
  games: Game[]
  setCurrentGame: (game: Game | null) => void
  setGames: (games: Game[]) => void
  updateGame: (game: Game) => void
}

interface CaseState {
  cases: Case[]
  setCases: (cases: Case[]) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token: string, user: User) =>
        set({ token, user, isAuthenticated: true }),
      logout: () =>
        set({ token: null, user: null, isAuthenticated: false }),
      updateBalance: (balance: number) =>
        set((state) => ({
          user: state.user ? { ...state.user, balance } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
)

export const useGameStore = create<GameState>((set) => ({
  currentGame: null,
  games: [],
  setCurrentGame: (game) => set({ currentGame: game }),
  setGames: (games) => set({ games }),
  updateGame: (game) =>
    set((state) => ({
      games: state.games.map((g) => (g.id === game.id ? game : g)),
      currentGame: state.currentGame?.id === game.id ? game : state.currentGame,
    })),
}))

export const useCaseStore = create<CaseState>((set) => ({
  cases: [],
  setCases: (cases) => set({ cases }),
}))
