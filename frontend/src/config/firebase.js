import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDYt5F-V_bF8BhyuBzaHBvzfzyvnR1UG3I",
  authDomain: "stocksim-3ab78.firebaseapp.com",
  projectId: "stocksim-3ab78",
  storageBucket: "stocksim-3ab78.firebasestorage.app",
  messagingSenderId: "1041842358696",
  appId: "1:1041842358696:web:2d84685862567b2771359d",
  measurementId: "G-YBFGYF1810"
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

