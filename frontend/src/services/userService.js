import { db } from '../config/firebase'
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore'

export const getUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (userDoc.exists()) {
      return userDoc.data().role || 'user'
    }
    return 'user'
  } catch (error) {
    return 'user'
  }
}

export const setUserRole = async (uid, role) => {
  try {
    const userRef = doc(db, 'users', uid)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      await updateDoc(userRef, { role, updatedAt: new Date() })
    } else {
      await setDoc(userRef, { role, createdAt: new Date(), updatedAt: new Date() })
    }
    return true
  } catch (error) {
    return false
  }
}

export const createUserProfile = async (uid, userData) => {
  try {
    const userRef = doc(db, 'users', uid)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      const isFirstUser = await checkIfFirstUser()
      await setDoc(userRef, {
        ...userData,
        role: isFirstUser ? 'admin' : 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return isFirstUser ? 'admin' : 'user'
    }
    
    const data = userDoc.data()
    return data.role || 'user'
  } catch (error) {
    return 'user'
  }
}

const checkIfFirstUser = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'))
    return usersSnapshot.empty
  } catch (error) {
    return false
  }
}

export const getAllUsers = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'))
    return usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    return []
  }
}

export const updateUserRole = async (uid, newRole) => {
  try {
    await setUserRole(uid, newRole)
    return true
  } catch (error) {
    return false
  }
}

