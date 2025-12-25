<template>
  <div class="home-view">
    <div class="stock-background-overlay">
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
          v-for="n in 6" 
          :key="n" 
          class="graph-line" 
          :style="{ left: `${n * 15}%`, animationDelay: `${n * 0.4}s` }"
          :ref="el => setGraphLineRef(el, n - 1)"
        >
          <polyline fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="2"/>
        </svg>
      </div>
      
      <div class="grid-pattern"></div>
      
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>
    
    <div class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge" :class="{ 'animate': true }">
            <i class="bi bi-lightning-charge-fill"></i>
            <span>Live Market Data</span>
          </div>
          <h1 class="hero-title">
            <span class="title-line">Smart Stock</span>
            <span class="title-line highlight">Analysis</span>
            <span class="title-line">Made Simple</span>
          </h1>
          <p class="hero-subtitle">
            Track live prices, calculate profits, and stay informed with real-time market insights
          </p>
          <div class="hero-actions">
            <router-link to="/login" class="btn-primary-custom">
              <span>Get Started Free</span>
              <i class="bi bi-arrow-right"></i>
            </router-link>
            <button class="btn-secondary-custom" @click="scrollToFeatures">
              <i class="bi bi-play-circle"></i>
              <span>See How It Works</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="features-section" id="features">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Everything You Need</h2>
          <p class="section-subtitle">Powerful tools for smart investing decisions</p>
      </div>

        <div class="features-grid">
          <div class="feature-card" @mouseenter="onCardHover($event)" @mouseleave="onCardLeave($event)">
            <div class="feature-icon">
              <i class="bi bi-graph-up-arrow"></i>
            </div>
            <h3>Live Stock Prices</h3>
            <p>Real-time price updates every 15 seconds. Track stocks and cryptocurrencies with live market data.</p>
            <div class="feature-badge">
              <i class="bi bi-wifi"></i>
              <span>Live Updates</span>
            </div>
          </div>

          <div class="feature-card" @mouseenter="onCardHover($event)" @mouseleave="onCardLeave($event)">
            <div class="feature-icon">
              <i class="bi bi-calculator"></i>
            </div>
            <h3>Profit Calculator</h3>
            <p>Calculate potential profits and losses. Set your purchase price and target price to see returns.</p>
            <div class="feature-badge">
              <i class="bi bi-check-circle"></i>
              <span>Save Calculations</span>
            </div>
          </div>

          <div class="feature-card" @mouseenter="onCardHover($event)" @mouseleave="onCardLeave($event)">
            <div class="feature-icon">
              <i class="bi bi-newspaper"></i>
            </div>
            <h3>Stock News</h3>
            <p>Stay updated with the latest market news and insights. Get real-time updates on your selected stocks.</p>
            <div class="feature-badge">
              <i class="bi bi-clock"></i>
              <span>Real-Time</span>
            </div>
          </div>

          <div class="feature-card" @mouseenter="onCardHover($event)" @mouseleave="onCardLeave($event)">
            <div class="feature-icon">
              <i class="bi bi-star"></i>
            </div>
            <div class="coming-soon-badge">Coming Soon</div>
            <h3>Watchlist</h3>
            <p>Build your personal watchlist. Track your favorite stocks and cryptocurrencies in one place.</p>
            <div class="feature-badge">
              <i class="bi bi-bookmark"></i>
              <span>Personalized</span>
            </div>
          </div>

          <div class="feature-card" @mouseenter="onCardHover($event)" @mouseleave="onCardLeave($event)">
            <div class="feature-icon">
              <i class="bi bi-coin"></i>
        </div>
            <h3>Crypto Support</h3>
            <p>Track both stocks and cryptocurrencies. Comprehensive market coverage in one platform.</p>
            <div class="feature-badge">
              <i class="bi bi-globe"></i>
              <span>All Markets</span>
            </div>
          </div>

          <div class="feature-card" @mouseenter="onCardHover($event)" @mouseleave="onCardLeave($event)">
            <div class="feature-icon">
              <i class="bi bi-shield-check"></i>
        </div>
            <h3>Secure & Free</h3>
            <p>No API keys required. Free access to live market data. Your data is secure and private.</p>
            <div class="feature-badge">
              <i class="bi bi-lock"></i>
              <span>100% Free</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Start?</h2>
          <p>Join thousands of users tracking markets and making smarter investment decisions</p>
          <router-link to="/login" class="btn-primary-custom large">
            <span>Create Free Account</span>
            <i class="bi bi-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import './HomeView.css'

const router = useRouter()
const userStore = useUserStore()

const tickerStocks = [
  { symbol: 'AAPL', price: '178.45', change: 2.34 },
  { symbol: 'GOOGL', price: '142.89', change: -1.23 },
  { symbol: 'MSFT', price: '378.92', change: 3.45 },
  { symbol: 'TSLA', price: '245.67', change: 5.12 },
  { symbol: 'AMZN', price: '148.23', change: -0.89 },
  { symbol: 'META', price: '312.56', change: 1.78 },
  { symbol: 'NVDA', price: '489.34', change: 4.56 },
  { symbol: 'BTC', price: '42,567', change: 2.89 },
  { symbol: 'ETH', price: '2,345', change: 3.21 },
  { symbol: 'SPY', price: '445.23', change: 1.45 }
]

const floatingStocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'BTC', 'ETH', 'SPY', 'QQQ', 'DIA', 'JPM', 'V', 'MA']

const getFloatingStyle = (index) => {
  const delay = index * 0.8
  const duration = 18 + (index % 4) * 4
  const startX = (index * 67) % 100
  return {
    left: `${startX}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

const graphPoints = ref([])

const generateGraphPoints = () => {
  graphPoints.value = []
  for (let n = 0; n < 6; n++) {
    const points = []
    for (let i = 0; i <= 12; i++) {
      const x = (i * 25) + 5
      const y = 50 + Math.sin(i * 0.6 + n) * 35 + Math.random() * 25
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

const scrollToFeatures = () => {
  const features = document.getElementById('features')
  if (features) {
    features.scrollIntoView({ behavior: 'smooth' })
  }
}

const onCardHover = (event) => {
  const card = event.currentTarget
  card.style.transform = 'translateY(-10px) scale(1.02)'
}

const onCardLeave = (event) => {
  const card = event.currentTarget
  card.style.transform = 'translateY(0) scale(1)'
}
</script>
