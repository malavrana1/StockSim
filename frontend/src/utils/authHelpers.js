import { createUserProfile, getUserRole } from '../services/userService'

export const handleAuthSuccess = async (userCredential, userStore, router, displayName = null) => {
  const user = userCredential.user
  const name = displayName || user.displayName || 'User'
  
  let userRole = await getUserRole(user.uid)
  
  if (!userRole || userRole === 'user') {
    userRole = await createUserProfile(user.uid, {
      email: user.email,
      name,
      photoURL: user.photoURL
    })
  }

  await userStore.setUser({
    uid: user.uid,
    email: user.email,
    name,
    photoURL: user.photoURL
  })

  return userRole
}

export const redirectUser = (userRole, router) => {
  if (userRole === 'admin') {
    router.push('/admin')
  } else {
    router.push('/dashboard')
  }
}

