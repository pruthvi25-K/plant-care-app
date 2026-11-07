import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth'
import { getDatabase, connectDatabaseEmulator, type Database } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'plant-care-app.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://plant-care-app-default-rtdb.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'plant-care-app',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'plant-care-app.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef',
}

let app: FirebaseApp
let auth: Auth
let database: Database

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  database = getDatabase(app)

  // Connect to emulator in development if specified or if running against local emulators
  const useEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true'
  if (useEmulator && typeof window !== 'undefined') {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
      connectDatabaseEmulator(database, 'localhost', 9000)
      console.info('Connected to Firebase Emulators (Auth: 9099, RTDB: 9000)')
    } catch {
      // Emulator connection already established or failed
    }
  }
} else {
  app = getApps()[0]
  auth = getAuth(app)
  database = getDatabase(app)
}

export { app, auth, database }
