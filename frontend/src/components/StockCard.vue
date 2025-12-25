<template>
  <div 
    class="card stock-card h-100" 
    :class="{ 'border-success': stock.changePercent > 0, 'border-danger': stock.changePercent < 0, 'expanded': showCalculator }"
    draggable="true"
    @dragstart="handleDragStart"
  >
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h5 class="card-title mb-0">{{ stock.displaySymbol || stock.symbol }}</h5>
          <small class="text-muted">{{ stock.name }}</small>
        </div>
        <span class="badge" :class="getSectorBadgeClass(stock.sector)">
          {{ stock.sector }}
        </span>
      </div>
      
      <div class="mt-3">
        <div class="d-flex justify-content-between align-items-center">
          <span class="h4 mb-0" ref="priceRef">${{ stock.price.toFixed(2) }}</span>
          <span 
            class="badge" 
            :class="stock.changePercent >= 0 ? 'bg-success' : 'bg-danger'"
            ref="changeRef"
          >
            {{ stock.changePercent >= 0 ? '+' : '' }}{{ stock.changePercent }}%
          </span>
        </div>
        <small class="text-muted">
          Vol: {{ formatNumber(stock.volume) }}
        </small>
      </div>

      <div class="mt-3 d-flex gap-2">
        <button 
          class="btn btn-sm btn-primary flex-fill"
          @click.stop="toggleCalculator"
        >
          <i class="bi bi-calculator me-1"></i>
          Calculate Profit
        </button>
        <button 
          class="btn btn-sm"
          :class="isInWatchlist ? 'btn-warning' : 'btn-outline-primary'"
          @click.stop="toggleWatchlist"
          :title="isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'"
        >
          <i :class="isInWatchlist ? 'bi bi-star-fill' : 'bi bi-star'" class="me-1"></i>
          {{ isInWatchlist ? 'In List' : 'Add to List' }}
        </button>
      </div>

      <div v-if="showCalculator" class="mt-3 pt-3 border-top">
        <div class="profit-preview">
          <label class="form-label small">Target Price ($)</label>
          <div class="input-group input-group-sm mb-2">
            <input 
              type="number" 
              class="form-control" 
              v-model.number="targetPrice"
              :min="0.01"
              step="0.01"
              placeholder="Target price"
              @input="calculateQuickProfit"
            />
            <button 
              class="btn btn-outline-secondary"
              @click="setTargetPrice(stock.price * 1.1)"
              title="+10%"
            >
              +10%
            </button>
          </div>
          <div v-if="targetPrice > 0 && quickProfit !== null" class="quick-profit-result">
            <div class="small text-muted">With $10,000 investment:</div>
            <div class="h6 mb-0" :class="quickProfit >= 0 ? 'text-success' : 'text-danger'">
              {{ quickProfit >= 0 ? '+' : '' }}${{ quickProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              <span class="small">({{ quickProfitPercent >= 0 ? '+' : '' }}{{ quickProfitPercent.toFixed(2) }}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useAnimations } from '../composables/useAnimations'
import { useWatchlistStore } from '../store/watchlist'
import './StockCard.css'

const props = defineProps({
  stock: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['drag-start'])

const watchlistStore = useWatchlistStore()

const isInWatchlist = computed(() => {
  return watchlistStore.isInWatchlist(props.stock.id)
})

const toggleWatchlist = () => {
  watchlistStore.toggleWatchlist(props.stock.id)
}

const { animatePriceChange } = useAnimations()
const priceRef = ref(null)
const changeRef = ref(null)
let previousPrice = props.stock.price

const showCalculator = ref(false)
const targetPrice = ref(0)
const quickProfit = ref(null)
const quickProfitPercent = ref(0)
const investmentAmount = 10000

watch(() => props.stock.price, (newPrice) => {
  if (priceRef.value && previousPrice !== newPrice) {
    const isPositive = newPrice > previousPrice
    animatePriceChange(priceRef.value, isPositive)
    if (changeRef.value) {
      animatePriceChange(changeRef.value, isPositive)
    }
    previousPrice = newPrice
  }
})

watch(() => props.stock, (newStock) => {
  if (newStock) {
    targetPrice.value = newStock.price
    calculateQuickProfit()
  }
}, { immediate: true })

const toggleCalculator = () => {
  showCalculator.value = !showCalculator.value
  if (showCalculator.value && targetPrice.value === 0) {
    targetPrice.value = props.stock.price
    calculateQuickProfit()
  }
}

const setTargetPrice = (price) => {
  targetPrice.value = price
  calculateQuickProfit()
}

const calculateQuickProfit = () => {
  if (!props.stock || !targetPrice.value || targetPrice.value <= 0) {
    quickProfit.value = null
    quickProfitPercent.value = 0
    return
  }

  const shares = Math.floor(investmentAmount / props.stock.price)
  const totalValue = shares * targetPrice.value
  quickProfit.value = totalValue - investmentAmount
  quickProfitPercent.value = ((quickProfit.value / investmentAmount) * 100)
}

const handleDragStart = (e) => {
  e.dataTransfer.setData('stock', JSON.stringify(props.stock))
  emit('drag-start', props.stock)
}

const getSectorBadgeClass = (sector) => {
  const classes = {
    'Technology': 'bg-primary',
    'Finance': 'bg-info',
    'Healthcare': 'bg-success',
    'Energy': 'bg-warning',
    'Consumer': 'bg-secondary',
    'Industrial': 'bg-dark',
    'Crypto': 'bg-purple'
  }
  return classes[sector] || 'bg-secondary'
}

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}
</script>

