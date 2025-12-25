<template>
  <div class="card">
    <div class="card-header d-flex align-items-center">
      <i class="bi bi-newspaper me-2"></i>
      <h6 class="mb-0">Market News</h6>
    </div>
    <div class="card-body p-0">
      <div class="news-ticker" ref="tickerRef">
        <div 
          v-for="news in marketStore.marketNews" 
          :key="news.id"
          class="news-item"
          :class="getImpactClass(news.impact)"
        >
          <div class="d-flex align-items-center p-2">
            <span class="badge me-2" :class="getImpactBadgeClass(news.impact)">
              {{ news.impact }}
            </span>
            <strong>{{ news.title }}</strong>
            <span class="ms-2 text-muted small">
              {{ formatTime(news.timestamp) }}
            </span>
          </div>
        </div>
        <div v-if="marketStore.marketNews.length === 0" class="p-3 text-center text-muted">
          No market news at this time
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useMarketStore } from '../store/market'
import { useAnimations } from '../composables/useAnimations'

const marketStore = useMarketStore()
const tickerRef = ref(null)
const { fadeIn } = useAnimations()

const getImpactClass = (impact) => {
  const classes = {
    'high': 'border-start border-4 border-danger',
    'medium': 'border-start border-4 border-warning',
    'low': 'border-start border-4 border-info'
  }
  return classes[impact] || ''
}

const getImpactBadgeClass = (impact) => {
  const classes = {
    'high': 'bg-danger',
    'medium': 'bg-warning',
    'low': 'bg-info'
  }
  return classes[impact] || 'bg-secondary'
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString()
}

watch(() => marketStore.marketNews, (newNews) => {
  if (newNews.length > 0 && tickerRef.value) {
    const lastItem = tickerRef.value.querySelector('.news-item:last-child')
    if (lastItem) {
      fadeIn(lastItem)
    }
  }
}, { deep: true })
</script>

<style scoped>
.news-ticker {
  max-height: 300px;
  overflow-y: auto;
}

.news-item {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.3s;
}

.news-item:hover {
  background-color: #f8f9fa;
}

.news-item:last-child {
  border-bottom: none;
}
</style>

