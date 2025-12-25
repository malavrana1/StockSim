export const validateEmail = (email) => {
  if (!email) {
    return 'Email is required'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address'
  }
  return null
}

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required'
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters'
  }
  return null
}

export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'Name is required'
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters'
  }
  if (name.trim().length > 50) {
    return 'Name must be less than 50 characters'
  }
  return null
}

export const validateLoginForm = (email, password) => {
  const errors = {}
  
  const emailError = validateEmail(email)
  if (emailError) errors.email = emailError
  
  const passwordError = validatePassword(password)
  if (passwordError) errors.password = passwordError
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validateSignupForm = (name, email, password) => {
  const errors = {}
  
  const nameError = validateName(name)
  if (nameError) errors.name = nameError
  
  const emailError = validateEmail(email)
  if (emailError) errors.email = emailError
  
  const passwordError = validatePassword(password)
  if (passwordError) errors.password = passwordError
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const getAuthErrorMessage = (errorCode, errorMessage) => {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/user-not-found': 'No account found with this email address. Please check your email or sign up.',
    'auth/wrong-password': 'Incorrect password. Please try again or reset your password.',
    'auth/invalid-credential': 'Invalid email or password. Please check your credentials and try again.',
    'auth/invalid-verification-code': 'The verification code is invalid or has expired.',
    'auth/invalid-verification-id': 'The verification ID is invalid.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later or reset your password.',
    'auth/configuration-not-found': 'Firebase Authentication is not enabled. Please enable it in Firebase Console.',
    'auth/api-key-not-valid': 'Invalid Firebase API key. Please check your configuration.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled. Please enable it in Firebase Console.',
    'auth/popup-closed-by-user': null,
    'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
    'auth/requires-recent-login': 'For security reasons, please sign in again to complete this action.'
  }

  if (errorCode === 'auth/popup-closed-by-user') {
    return null
  }

  if (errorMessages[errorCode]) {
    return errorMessages[errorCode]
  }

  if (errorMessage && errorMessage.includes('400')) {
    return 'Authentication service not enabled. Please enable Email/Password authentication in Firebase Console.'
  }

  return errorMessage || 'An unexpected error occurred. Please try again.'
}

