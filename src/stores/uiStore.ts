import { Store } from '@tanstack/store'

export interface UIState {
  // Mobile menu state
  isMobileMenuOpen: boolean
  
  // Modal states
  modals: {
    authDemo: 'login' | 'register'
  }
  
  // View modes
  problemsViewMode: 'grid' | 'list'
  
  // Editing states
  profileEditing: boolean
  
  // Filter panel states
  filterPanelOpen: boolean
  
  // Pagination states
  currentPages: {
    submissions: number
    problems: number
  }
  
  // Calendar selection
  selectedDate: Date | undefined
}

export const uiStore = new Store<UIState>({
  isMobileMenuOpen: false,
  modals: {
    authDemo: 'login',
  },
  problemsViewMode: 'grid',
  profileEditing: false,
  filterPanelOpen: false,
  currentPages: {
    submissions: 1,
    problems: 1,
  },
  selectedDate: new Date(),
})

// Actions
export const uiActions = {
  // Mobile menu
  toggleMobileMenu: () => {
    uiStore.setState((state) => ({
      ...state,
      isMobileMenuOpen: !state.isMobileMenuOpen,
    }))
  },
  
  closeMobileMenu: () => {
    uiStore.setState((state) => ({
      ...state,
      isMobileMenuOpen: false,
    }))
  },
  
  // Auth demo modal
  setAuthMode: (mode: 'login' | 'register') => {
    uiStore.setState((state) => ({
      ...state,
      modals: { ...state.modals, authDemo: mode },
    }))
  },
  
  // View modes
  setProblemsViewMode: (mode: 'grid' | 'list') => {
    uiStore.setState((state) => ({
      ...state,
      problemsViewMode: mode,
    }))
  },
  
  // Profile editing
  setProfileEditing: (editing: boolean) => {
    uiStore.setState((state) => ({
      ...state,
      profileEditing: editing,
    }))
  },
  
  // Filter panel
  toggleFilterPanel: () => {
    uiStore.setState((state) => ({
      ...state,
      filterPanelOpen: !state.filterPanelOpen,
    }))
  },
  
  setFilterPanelOpen: (open: boolean) => {
    uiStore.setState((state) => ({
      ...state,
      filterPanelOpen: open,
    }))
  },
  
  // Pagination
  setCurrentPage: (page: keyof UIState['currentPages'], pageNumber: number) => {
    uiStore.setState((state) => ({
      ...state,
      currentPages: {
        ...state.currentPages,
        [page]: pageNumber,
      },
    }))
  },
  
  // Calendar
  setSelectedDate: (date: Date | undefined) => {
    uiStore.setState((state) => ({
      ...state,
      selectedDate: date,
    }))
  },
}