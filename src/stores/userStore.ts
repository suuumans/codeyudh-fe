import { Store } from '@tanstack/store'
import type { User, UserStatistics } from '@/types'

export interface UserState {
  currentUser: User | null
  statistics: UserStatistics | null
  isAuthenticated: boolean
  loading: boolean
}

export const userStore = new Store<UserState>({
  currentUser: null,
  statistics: null,
  isAuthenticated: false,
  loading: false,
})

// Actions
export const userActions = {
  setUser: (user: User | null) => {
    userStore.setState((state) => ({
      ...state,
      currentUser: user,
      isAuthenticated: !!user,
      statistics: user?.statistics || null,
    }))
  },

  setStatistics: (statistics: UserStatistics) => {
    userStore.setState((state) => ({
      ...state,
      statistics,
    }))
  },

  setLoading: (loading: boolean) => {
    userStore.setState((state) => ({
      ...state,
      loading,
    }))
  },

  logout: () => {
    userStore.setState({
      currentUser: null,
      statistics: null,
      isAuthenticated: false,
      loading: false,
    })
  },
}