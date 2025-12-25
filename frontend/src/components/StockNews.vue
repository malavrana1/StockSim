<template>
  <div class="stock-news">
    <div class="card">
      <div class="card-header">
        <h6 class="mb-0 small fw-bold">
          <i class="bi bi-newspaper me-1"></i>
          News
          <span v-if="stock" class="text-white-50">- {{ stock.displaySymbol || stock.symbol }}</span>
          <span class="live-badge-news" v-if="stock && !loading">
            <i class="bi bi-circle-fill"></i> LIVE
          </span>
        </h6>
      </div>
      <div class="card-body">
        <div v-if="!stock" class="empty-state">
          <i class="bi bi-newspaper display-6 text-muted"></i>
          <p class="text-muted mt-3">Select a stock to see news</p>
        </div>
        
        <div v-else-if="loading" class="text-center py-4">
          <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
          <p class="text-muted mt-2 small">Loading news...</p>
        </div>
        
        <div v-else-if="error" class="alert alert-warning">
          <i class="bi bi-exclamation-triangle me-2"></i>
          {{ error }}
        </div>
        
        <div v-else-if="news.length === 0" class="empty-state">
          <i class="bi bi-inbox display-6 text-muted"></i>
          <p class="text-muted mt-3">No news available</p>
        </div>
        
        <div v-else class="news-list">
          <div 
            v-for="item in news" 
            :key="item.id"
            class="news-item"
          >
            <div class="news-header">
              <span class="news-source">{{ item.source || 'Market News' }}</span>
              <span class="news-time">{{ formatTime(item.datetime) }}</span>
            </div>
            <h6 class="news-title">{{ item.headline }}</h6>
            <p class="news-summary" v-if="item.summary">
              {{ item.summary }}
            </p>
            <div class="news-footer">
              <span class="news-category" v-if="item.category">{{ item.category }}</span>
              <a 
                v-if="item.url" 
                :href="item.url" 
                target="_blank"
                class="news-link"
              >
                Read full article <i class="bi bi-box-arrow-up-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import './StockNews.css'

const props = defineProps({
  stock: {
    type: Object,
    default: null
  }
})

const news = ref([])
const loading = ref(false)
const error = ref(null)
let newsRefreshInterval = null

const fetchNews = async (symbol, showLoading = true) => {
  if (!symbol) {
    news.value = []
    return
  }

  if (showLoading) {
    loading.value = true
  }
  error.value = null

  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    const cleanSymbol = symbol.replace('-USD', '')
    const url = `${API_BASE_URL}/news/${cleanSymbol}`
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)
    
    const response = await fetch(url, { 
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    
    if (response.ok) {
      const data = await response.json()
      if (Array.isArray(data) && data.length > 0) {
        news.value = data
      } else {
        news.value = []
      }
    } else {
      throw new Error('Failed to fetch news')
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      error.value = 'Request timed out'
    } else {
      console.error('Error fetching news:', err)
      error.value = 'Failed to load news'
    }
    news.value = generateSampleNews(symbol)
  } finally {
    loading.value = false
  }
}

const generateSampleNews = (symbol) => {
  const cleanSymbol = symbol.replace('-USD', '')
  const newsTemplates = [
    {
      headline: `${cleanSymbol} Shows Strong Performance This Week`,
      summary: `Market analysts are optimistic about ${cleanSymbol}'s recent performance and future outlook.`,
      source: 'Market Watch',
      category: 'Market Analysis'
    },
    {
      headline: `${cleanSymbol} Announces Quarterly Earnings`,
      summary: `The company reported better-than-expected earnings, driving investor confidence.`,
      source: 'Financial Times',
      category: 'Earnings'
    },
    {
      headline: `Analysts Upgrade ${cleanSymbol} Price Target`,
      summary: `Several major investment firms have raised their price targets for ${cleanSymbol}.`,
      source: 'Bloomberg',
      category: 'Analyst Report'
    },
    {
      headline: `${cleanSymbol} Expands Market Presence`,
      summary: `The company continues to expand its operations and market reach.`,
      source: 'Reuters',
      category: 'Business News'
    }
  ]
  
  return newsTemplates.map((template, index) => ({
    id: Date.now() + index,
    ...template,
    datetime: Date.now() - (index * 3600000),
    url: null
  }))
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  const hours = Math.floor(diff / 3600000)
  
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

watch(() => props.stock, (newStock) => {
  if (newsRefreshInterval) {
    clearInterval(newsRefreshInterval)
    newsRefreshInterval = null
  }
  
  if (newStock) {
    const symbol = newStock.symbol || newStock.displaySymbol
    fetchNews(symbol)
    newsRefreshInterval = setInterval(() => {
      fetchNews(symbol, false)
    }, 120000)
  } else {
    news.value = []
  }
}, { immediate: true })

onMounted(() => {
  if (props.stock) {
    const symbol = props.stock.symbol || props.stock.displaySymbol
    fetchNews(symbol)
    newsRefreshInterval = setInterval(() => {
      fetchNews(symbol, false)
    }, 120000)
  }
})

onUnmounted(() => {
  if (newsRefreshInterval) {
    clearInterval(newsRefreshInterval)
    newsRefreshInterval = null
  }
})
</script>

