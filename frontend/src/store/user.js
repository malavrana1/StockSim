import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth } from '../config/firebase'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { getUserRole, createUserProfile } from '../services/userService'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const authReady = ref(false)
  const role = ref('user')
  const badges = ref([])
  const achievements = ref([])
  const rank = ref(0)
  const score = ref(0)

  const displayName = computed(() => {
    return user.value?.name || 'Guest'
  })

  const badgeCount = computed(() => {
    return badges.value.length
  })

  const isAdmin = computed(() => {
    return role.value === 'admin'
  })

  async function setUser(userData) {
    user.value = userData
    isAuthenticated.value = true
    
    if (userData.uid) {
      try {
        const userRole = await getUserRole(userData.uid)
        role.value = userRole || 'user'
      } catch (error) {
        role.value = 'user'
      }
    }
  }

  async function logout() {
    try {
      await signOut(auth)
    user.value = null
    isAuthenticated.value = false
      role.value = 'user'
    badges.value = []
    achievements.value = []
    } catch (error) {
      throw error
    }
  }

  async function initAuth() {
    if (authReady.value) {
      return Promise.resolve()
    }

    return new Promise((resolve) => {
      let resolved = false
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            let userRole = await getUserRole(firebaseUser.uid)
            
            if (!userRole || userRole === 'user') {
              userRole = await createUserProfile(firebaseUser.uid, {
                email: firebaseUser.email,
                name: firebaseUser.displayName || 'User',
                photoURL: firebaseUser.photoURL
              })
            }
            
            role.value = userRole || 'user'

            await setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'User',
              photoURL: firebaseUser.photoURL
            })
          } catch (error) {
            role.value = 'user'
            await setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'User',
              photoURL: firebaseUser.photoURL
            })
          }
        } else {
          user.value = null
          isAuthenticated.value = false
          role.value = 'user'
        }
        
        if (!resolved) {
          resolved = true
          authReady.value = true
          resolve()
        }
      })
    })
  }

  async function refreshRole() {
    if (user.value?.uid) {
      const userRole = await getUserRole(user.value.uid)
      role.value = userRole
    }
  }

  function addBadge(badge) {
    if (!badges.value.find(b => b.id === badge.id)) {
      badges.value.push(badge)
    }
  }

  function addAchievement(achievement) {
    if (!achievements.value.find(a => a.id === achievement.id)) {
      achievements.value.push(achievement)
    }
  }

  function updateRank(newRank) {
    rank.value = newRank
  }

  function updateScore(newScore) {
    score.value = newScore
  }

  return {
    user,
    isAuthenticated,
    authReady,
    role,
    badges,
    achievements,
    rank,
    score,
    displayName,
    badgeCount,
    isAdmin,
    setUser,
    logout,
    initAuth,
    refreshRole,
    addBadge,
    addAchievement,
    updateRank,
    updateScore
  }
})

