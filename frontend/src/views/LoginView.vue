<template>
  <div class="login-container">
    <div class="stock-background">
      <div class="ticker-container ticker-top">
        <div class="ticker-item" v-for="(stock, index) in tickerStocks" :key="`top-${index}`" :style="{ animationDelay: `${index * 0.5}s` }">
          <span class="stock-symbol">{{ stock.symbol }}</span>
          <span class="stock-price" :class="stock.change >= 0 ? 'positive' : 'negative'">
            ${{ stock.price }}
          </span>
          <span class="stock-change" :class="stock.change >= 0 ? 'positive' : 'negative'">
            {{ stock.change >= 0 ? '+' : '' }}{{ stock.change }}%
          </span>
        </div>
      </div>
      
      <div class="ticker-container ticker-bottom">
        <div class="ticker-item" v-for="(stock, index) in tickerStocks" :key="`bottom-${index}`" :style="{ animationDelay: `${index * 0.5}s` }">
          <span class="stock-symbol">{{ stock.symbol }}</span>
          <span class="stock-price" :class="stock.change >= 0 ? 'positive' : 'negative'">
            ${{ stock.price }}
          </span>
          <span class="stock-change" :class="stock.change >= 0 ? 'positive' : 'negative'">
            {{ stock.change >= 0 ? '+' : '' }}{{ stock.change }}%
          </span>
        </div>
      </div>
      
      <div class="floating-stocks">
        <div class="floating-stock" v-for="(stock, index) in floatingStocks" :key="index" :style="getFloatingStyle(index)">
          <span class="floating-symbol">{{ stock }}</span>
        </div>
      </div>
      
      <div class="graph-lines">
        <svg 
          v-for="n in 5" 
          :key="n" 
          class="graph-line" 
          :style="{ left: `${n * 20}%`, animationDelay: `${n * 0.3}s` }"
          :ref="el => setGraphLineRef(el, n - 1)"
        >
          <polyline fill="none" stroke="rgba(255, 255, 255, 0.1)" stroke-width="2"/>
        </svg>
      </div>
      
      <div class="grid-pattern"></div>
    </div>
    
    <div class="login-wrapper">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-icon">
            <i class="bi bi-graph-up-arrow"></i>
          </div>
          <h2 class="login-title">StockSim</h2>
          <p class="login-subtitle">{{ isLogin ? 'Welcome back!' : 'Create your account' }}</p>
        </div>

        <div class="login-body">
          <form @submit.prevent="handleSubmit" class="login-form">
            <div v-if="!isLogin" class="form-group">
              <label class="form-label">
                <i class="bi bi-person"></i>
                Full Name
              </label>
              <input
                type="text"
                v-model="formData.name"
                class="form-input"
                :class="{ 'error': validationErrors.name }"
                placeholder="Enter your name"
                @blur="validateForm"
              />
              <span v-if="validationErrors.name" class="field-error">
                {{ validationErrors.name }}
              </span>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="bi bi-envelope"></i>
                Email
              </label>
              <input
                type="email"
                v-model="formData.email"
                class="form-input"
                :class="{ 'error': validationErrors.email }"
                placeholder="Enter your email"
                autocomplete="email"
                @blur="validateForm"
              />
              <span v-if="validationErrors.email" class="field-error">
                {{ validationErrors.email }}
              </span>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="bi bi-lock"></i>
                Password
              </label>
              <div class="password-wrapper">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="formData.password"
                  class="form-input"
                  :class="{ 'error': validationErrors.password }"
                  placeholder="Enter your password"
                  :autocomplete="isLogin ? 'current-password' : 'new-password'"
                  @blur="validateForm"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                  tabindex="-1"
                >
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
              <span v-if="validationErrors.password" class="field-error">
                {{ validationErrors.password }}
              </span>
            </div>

            <div v-if="error" class="error-message">
              <i class="bi bi-exclamation-circle"></i>
              {{ error }}
            </div>

            <button
              type="submit"
              class="submit-btn"
              :disabled="loading || !isFormValid"
            >
              <span v-if="loading" class="spinner"></span>
              <span v-else>
                <i :class="isLogin ? 'bi bi-box-arrow-in-right' : 'bi bi-person-plus'"></i>
                {{ isLogin ? 'Sign In' : 'Sign Up' }}
              </span>
            </button>
          </form>

          <div class="login-footer">
            <p>
              {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
              <button
                @click="toggleMode"
                class="link-btn"
                :disabled="loading"
                type="button"
              >
                {{ isLogin ? 'Sign Up' : 'Sign In' }}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { auth } from '../config/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { validateLoginForm, validateSignupForm, getAuthErrorMessage } from '../utils/validation'
import { handleAuthSuccess, redirectUser } from '../utils/authHelpers'

const router = useRouter()
const userStore = useUserStore()

const tickerStocks = ref([
  { symbol: 'AAPL', price: '178.45', change: 2.34 },
  { symbol: 'GOOGL', price: '142.89', change: -1.23 },
  { symbol: 'MSFT', price: '378.92', change: 3.45 },
  { symbol: 'TSLA', price: '245.67', change: 5.12 },
  { symbol: 'AMZN', price: '148.23', change: -0.89 },
  { symbol: 'META', price: '312.56', change: 1.78 },
  { symbol: 'NVDA', price: '489.34', change: 4.56 },
  { symbol: 'BTC', price: '42,567', change: 2.89 }
])

const floatingStocks = ref(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'BTC', 'ETH', 'SPY', 'QQQ', 'DIA'])

const getFloatingStyle = (index) => {
  const delay = index * 0.8
  const duration = 15 + (index % 3) * 5
  const startX = (index * 73) % 100
  return {
    left: `${startX}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

const graphPoints = ref([])
const graphLineRefs = ref([])

const generateGraphPoints = () => {
  graphPoints.value = []
  for (let n = 0; n < 5; n++) {
    const points = []
    for (let i = 0; i <= 10; i++) {
      const x = (i * 30) + 10
      const y = 50 + Math.sin(i * 0.5 + n) * 30 + Math.random() * 20
      points.push(`${x},${y}`)
    }
    graphPoints.value.push(points.join(' '))
  }
}

const setGraphLineRef = async (el, index) => {
  if (el) {
    await nextTick()
    const polyline = el.querySelector('polyline')
    if (polyline && graphPoints.value[index]) {
      polyline.setAttribute('points', graphPoints.value[index])
    }
  }
}

const isLogin = ref(true)
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const validationErrors = ref({})

const formData = ref({
  name: '',
  email: '',
  password: ''
})

const isFormValid = computed(() => {
  if (isLogin.value) {
    return formData.value.email && formData.value.password && !validationErrors.value.email && !validationErrors.value.password
  }
  return formData.value.name && formData.value.email && formData.value.password && 
         !validationErrors.value.name && !validationErrors.value.email && !validationErrors.value.password
})

const toggleMode = () => {
  isLogin.value = !isLogin.value
  error.value = ''
  validationErrors.value = {}
  formData.value = {
    name: '',
    email: '',
    password: ''
  }
}

const validateForm = () => {
  validationErrors.value = {}
  
  if (isLogin.value) {
    const validation = validateLoginForm(formData.value.email, formData.value.password)
    validationErrors.value = validation.errors
  } else {
    const validation = validateSignupForm(formData.value.name, formData.value.email, formData.value.password)
    validationErrors.value = validation.errors
  }
}

const handleSubmit = async () => {
  validateForm()
  
  if (!isFormValid.value) {
    error.value = 'Please fix the errors above'
    return
  }

  loading.value = true
  error.value = ''

  try {
    if (isLogin.value) {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.value.email.trim(),
        formData.value.password
      )
      
      const userRole = await handleAuthSuccess(userCredential, userStore, router)
      redirectUser(userRole, router)
    } else {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.value.email.trim(),
        formData.value.password
      )
      
      if (formData.value.name.trim()) {
        await updateProfile(userCredential.user, {
          displayName: formData.value.name.trim()
        })
      }

      const userRole = await handleAuthSuccess(
        userCredential, 
        userStore, 
        router, 
        formData.value.name.trim()
      )
      redirectUser(userRole, router)
    }
  } catch (err) {
    const errorMsg = getAuthErrorMessage(err.code, err.message)
    if (errorMsg) {
      error.value = errorMsg
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (userStore.isAuthenticated) {
    router.push('/dashboard')
  }
  generateGraphPoints()
  await nextTick()
  const graphLines = document.querySelectorAll('.graph-line')
  graphLines.forEach((svg, index) => {
    const polyline = svg.querySelector('polyline')
    if (polyline && graphPoints.value[index]) {
      polyline.setAttribute('points', graphPoints.value[index])
    }
  })
})
</script>

<style>
@import './LoginView.css';
</style>

