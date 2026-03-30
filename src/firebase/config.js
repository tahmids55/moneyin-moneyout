import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  enableIndexedDbPersistence,
  getFirestore,
  serverTimestamp,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const missingFirebaseConfigKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key)

export const firebaseReady = missingFirebaseConfigKeys.length === 0

export const firebaseConfigError = firebaseReady
  ? null
  : `Missing Firebase env values: ${missingFirebaseConfigKeys.join(', ')}`

const app = firebaseReady ? initializeApp(firebaseConfig) : null

export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null

if (db) {
  enableIndexedDbPersistence(db).catch(() => {
    // Persistence can fail in private mode or multi-tab ownership conflicts.
  })
}

export { serverTimestamp }
