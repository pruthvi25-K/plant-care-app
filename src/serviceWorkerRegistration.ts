export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.info('PlantCare PWA ServiceWorker registered with scope:', reg.scope)
        })
        .catch((err) => {
          console.warn('PlantCare ServiceWorker registration failed:', err)
        })
    })
  }
}
