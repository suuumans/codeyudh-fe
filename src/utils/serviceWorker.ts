/**
 * Service Worker registration and management utilities
 */

// Check if service workers are supported
export function isServiceWorkerSupported(): boolean {
  return 'serviceWorker' in navigator
}

// Register service worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isServiceWorkerSupported()) {
    console.warn('Service Workers are not supported in this browser')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })

    console.log('Service Worker registered successfully:', registration)

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker is available
            showUpdateAvailableNotification()
          }
        })
      }
    })

    return registration
  } catch (error) {
    console.error('Service Worker registration failed:', error)
    return null
  }
}

// Unregister service worker
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!isServiceWorkerSupported()) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      const result = await registration.unregister()
      console.log('Service Worker unregistered:', result)
      return result
    }
    return false
  } catch (error) {
    console.error('Service Worker unregistration failed:', error)
    return false
  }
}

// Check for service worker updates
export async function checkForUpdates(): Promise<void> {
  if (!isServiceWorkerSupported()) {
    return
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      await registration.update()
    }
  } catch (error) {
    console.error('Failed to check for service worker updates:', error)
  }
}

// Skip waiting and activate new service worker
export function skipWaitingAndReload(): void {
  if (!isServiceWorkerSupported()) {
    return
  }

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload()
  })

  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' })
  }
}

// Show update available notification
function showUpdateAvailableNotification(): void {
  // This would integrate with your notification system
  console.log('New version available! Please refresh the page.')
  
  // You can integrate this with your toast notification system
  if (window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent('sw-update-available'))
  }
}

// Cache management utilities
export async function clearAllCaches(): Promise<void> {
  if (!('caches' in window)) {
    return
  }

  try {
    const cacheNames = await caches.keys()
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    )
    console.log('All caches cleared')
  } catch (error) {
    console.error('Failed to clear caches:', error)
  }
}

// Get cache storage usage
export async function getCacheStorageUsage(): Promise<{ used: number; quota: number } | null> {
  if (!('storage' in navigator && 'estimate' in navigator.storage)) {
    return null
  }

  try {
    const estimate = await navigator.storage.estimate()
    return {
      used: estimate.usage || 0,
      quota: estimate.quota || 0,
    }
  } catch (error) {
    console.error('Failed to get storage estimate:', error)
    return null
  }
}

// Preload critical resources
export async function preloadCriticalResources(urls: string[]): Promise<void> {
  if (!isServiceWorkerSupported()) {
    return
  }

  try {
    const cache = await caches.open('critical-resources')
    await cache.addAll(urls)
    console.log('Critical resources preloaded')
  } catch (error) {
    console.error('Failed to preload critical resources:', error)
  }
}