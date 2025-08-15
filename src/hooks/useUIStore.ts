import { useStore } from '@tanstack/react-store'
import { uiStore, uiActions } from '@/stores/uiStore'

export function useUIStore() {
  const state = useStore(uiStore)
  return {
    state,
    actions: uiActions
  }
}

export function useMobileMenu() {
  const { isMobileMenuOpen } = useStore(uiStore)
  
  return {
    isOpen: isMobileMenuOpen,
    toggle: uiActions.toggleMobileMenu,
    close: uiActions.closeMobileMenu,
  }
}

export function useAuthModal() {
  const { modals } = useStore(uiStore)
  
  return {
    mode: modals.authDemo,
    setMode: uiActions.setAuthMode,
  }
}

export function useProblemsViewMode() {
  const { problemsViewMode } = useStore(uiStore)
  
  return {
    viewMode: problemsViewMode,
    setViewMode: uiActions.setProblemsViewMode,
  }
}

export function useFilterPanel() {
  const { filterPanelOpen } = useStore(uiStore)
  
  return {
    isOpen: filterPanelOpen,
    toggle: uiActions.toggleFilterPanel,
    setOpen: uiActions.setFilterPanelOpen,
  }
}

export function usePagination(page: 'submissions' | 'problems') {
  const { currentPages } = useStore(uiStore)
  
  return {
    currentPage: currentPages[page],
    setCurrentPage: (pageNumber: number) => uiActions.setCurrentPage(page, pageNumber),
  }
}

export function useCalendarSelection() {
  const { selectedDate } = useStore(uiStore)
  
  return {
    selectedDate,
    setSelectedDate: uiActions.setSelectedDate,
  }
}