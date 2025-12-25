import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDYt5F-V_bF8BhyuBzaHBvzfzyvnR1UG3I",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "stocksim-3ab78.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "stocksim-3ab78",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "stocksim-3ab78.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1041842358696",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1041842358696:web:2d84685862567b2771359d",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-YBFGYF1810"
}

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error('Firebase configuration error: Missing required fields')
}

let app
let auth
let db

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
} catch (error) {
  throw error
}

export { auth, db }
export default app

