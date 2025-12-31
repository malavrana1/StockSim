<template>
  <div class="profit-calculator-wrapper">
    <div class="calculator-container">
      <div class="calculator-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="bi bi-calculator-fill"></i>
          </div>
          <div class="header-text">
            <h5 class="mb-0 fw-bold">Profit Calculator</h5>
            <small class="d-block text-white-50" v-if="currentStock">
              {{ currentStock.displaySymbol || currentStock.symbol }} - {{ currentStock.name }}
            </small>
            <small class="d-block text-white-50" v-else>Select a stock to get started</small>
          </div>
        </div>
      </div>

      <div class="calculator-body">
        <div class="input-section">
          <label for="stockSelect" class="input-label">
            <i class="bi bi-graph-up-arrow me-2"></i>
            Select Stock
          </label>
          <div class="custom-select-wrapper" @click.stop>
            <div 
              class="custom-select-trigger"
              :class="{ 'is-open': isDropdownOpen, 'is-disabled': !availableStocks || availableStocks.length === 0 }"
              @click="toggleDropdown"
            >
              <div class="selected-stock-display" v-if="selectedStock">
                <span class="stock-symbol-badge">{{ selectedStock.displaySymbol || selectedStock.symbol }}</span>
                <span class="stock-name">{{ selectedStock.name }}</span>
                <span class="stock-price" :class="getPriceChangeClass(selectedStock)">
                  ${{ formatPrice(selectedStock.price) }}
                  <span class="price-change-indicator" v-if="selectedStock.changePercent">
                    {{ selectedStock.changePercent > 0 ? '+' : '' }}{{ selectedStock.changePercent.toFixed(2) }}%
                  </span>
                </span>
              </div>
              <div class="placeholder-text" v-else>
                {{ availableStocks && availableStocks.length > 0 ? 'Search or select a stock...' : 'Loading stocks...' }}
              </div>
              <i class="bi bi-chevron-down select-arrow" :class="{ 'rotated': isDropdownOpen }"></i>
            </div>
            
            <transition name="dropdown">
              <div class="custom-select-dropdown" v-if="isDropdownOpen">
                <div class="search-box">
                  <i class="bi bi-search search-icon"></i>
                  <input 
                    type="text" 
                    class="stock-search-input"
                    v-model="searchQuery"
                    @input="filterStocks"
                    placeholder="Search stocks by symbol or name..."
                    ref="searchInput"
                  />
                  <button 
                    class="clear-search-btn" 
                    v-if="searchQuery"
                    @click="clearSearch"
                  >
                    <i class="bi bi-x"></i>
                  </button>
                </div>
                
                <div class="stocks-list" ref="stocksList">
                  <div 
                    v-for="stock in filteredStocks" 
                    :key="stock.id"
                    class="stock-option"
                    :class="{ 'is-selected': selectedStockId === stock.id, 'is-highlighted': highlightedIndex === filteredStocks.indexOf(stock) }"
                    @click="selectStock(stock)"
                    @mouseenter="highlightedIndex = filteredStocks.indexOf(stock)"
                  >
                    <div class="stock-option-content">
                      <div class="stock-info">
                        <div class="stock-header">
                          <span class="stock-symbol">{{ stock.displaySymbol || stock.symbol }}</span>
                          <span class="stock-sector" v-if="stock.sector">{{ stock.sector }}</span>
                        </div>
                        <div class="stock-name-text">{{ stock.name }}</div>
                      </div>
                      <div class="stock-price-info">
                        <div class="stock-price-value" :class="getPriceChangeClass(stock)">
                          ${{ formatPrice(stock.price) }}
                        </div>
                        <div class="stock-change" :class="getPriceChangeClass(stock)">
                          <i class="bi" :class="stock.changePercent >= 0 ? 'bi-arrow-up' : 'bi-arrow-down'"></i>
                          <span>{{ stock.changePercent > 0 ? '+' : '' }}{{ stock.changePercent?.toFixed(2) || '0.00' }}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="no-results" v-if="filteredStocks.length === 0">
                    <i class="bi bi-search"></i>
                    <p>No stocks found matching "{{ searchQuery }}"</p>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <div v-if="currentStock" class="calculator-content">
          <div class="compact-layout-grid">
            <div class="market-info-compact" :class="{ 'chart-open': showPriceChart }">
              <div class="market-info-header">
                <span class="market-label-compact">Market Price</span>
                <span class="live-badge-compact">
                  <i class="bi bi-circle-fill"></i> LIVE
                </span>
                <button class="chart-toggle-btn" @click="togglePriceChart" title="View price chart">
                  <i class="bi" :class="showPriceChart ? 'bi-chevron-up' : 'bi-graph-up'"></i>
                </button>
              </div>
              <div class="market-price-compact" :class="priceChangeClass">
                ${{ formatPrice(currentStock.price) }}
              </div>
              <div class="market-change-compact" :class="currentStock.changePercent >= 0 ? 'positive' : 'negative'">
                <i :class="currentStock.changePercent >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                <span>{{ currentStock.changePercent >= 0 ? '+' : '' }}${{ currentStock.change.toFixed(2) }}</span>
                <span>({{ currentStock.changePercent >= 0 ? '+' : '' }}{{ currentStock.changePercent.toFixed(2) }}%)</span>
              </div>
              
              <transition name="chart-expand">
                <div v-if="showPriceChart" class="price-chart-container" @click.stop>
                  <div class="chart-header">
                    <div class="chart-title">
                      <span class="chart-symbol">{{ currentStock.displaySymbol || currentStock.symbol }}</span>
                      <span class="chart-name">{{ currentStock.name }}</span>
                    </div>
                    <button class="chart-close-btn" @click="showPriceChart = false">
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                  <div class="chart-price-display">
                    <div class="chart-current-price" :class="priceChangeClass">
                      ${{ formatPrice(currentStock.price) }}
                    </div>
                    <div class="chart-change" :class="currentStock.changePercent >= 0 ? 'positive' : 'negative'">
                      <i :class="currentStock.changePercent >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                      <span>{{ currentStock.changePercent >= 0 ? '+' : '' }}${{ currentStock.change.toFixed(2) }}</span>
                      <span>({{ currentStock.changePercent >= 0 ? '+' : '' }}{{ currentStock.changePercent.toFixed(2) }}%)</span>
                    </div>
                  </div>
                  <div class="chart-timeframe-selector">
                    <button 
                      v-for="timeframe in timeframes" 
                      :key="timeframe.value"
                      class="timeframe-btn"
                      :class="{ 'active': selectedTimeframe === timeframe.value }"
                      @click="selectedTimeframe = timeframe.value; updatePriceChart()"
                    >
                      {{ timeframe.label }}
                    </button>
                  </div>
                  <div class="chart-wrapper">
                    <canvas ref="priceChartCanvas"></canvas>
                  </div>
                </div>
              </transition>
            </div>

            <div class="inputs-compact">
              <div class="input-compact-group">
                <label class="input-label-compact">
                  <i class="bi bi-cart-check"></i>
                  Purchase Price
                </label>
                <div class="input-compact-wrapper">
                  <span class="currency-compact">$</span>
                  <input 
                    type="number" 
                    class="input-compact"
                    v-model.number="purchasePrice"
                    :min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    @input="calculateProfit"
                  />
                  <button 
                    class="btn-compact-primary"
                    @click="setPurchasePrice(currentStock.price)"
                    title="Use current"
                  >
                    <i class="bi bi-arrow-clockwise"></i>
                  </button>
                </div>
              </div>

              <div class="input-compact-group">
                <label class="input-label-compact">
                  <i class="bi bi-wallet2"></i>
                  Investment
                </label>
                <div class="input-compact-wrapper">
                  <span class="currency-compact">$</span>
                  <input 
                    type="number" 
                    class="input-compact"
                    v-model.number="investmentAmount"
                    :min="1"
                    step="100"
                    placeholder="0"
                    @input="calculateProfit"
                  />
                </div>
              </div>

              <div class="input-compact-group">
                <label class="input-label-compact" for="targetPrice">
                  <i class="bi bi-bullseye"></i>
                  Target Price
                </label>
                <div class="input-compact-wrapper">
                  <span class="currency-compact">$</span>
                  <input 
                    type="number" 
                    class="input-compact" 
                    id="targetPrice"
                    v-model.number="targetPrice"
                    :min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    @input="calculateProfit"
                  />
                </div>
              </div>
            </div>
          </div>

          <div v-if="targetPrice > 0 && purchasePrice > 0" class="results-compact-section">
            <div class="results-compact-grid">
              <div class="result-compact-card">
                <div class="result-compact-icon">
                  <i class="bi bi-stack"></i>
                </div>
                <div class="result-compact-content">
                  <div class="result-compact-label">Shares</div>
                  <div class="result-compact-value">{{ shares.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}</div>
                  <div class="result-compact-sub">@ ${{ purchasePrice.toFixed(2) }}</div>
                </div>
              </div>

              <div class="result-compact-card">
                <div class="result-compact-icon">
                  <i class="bi bi-cash-stack"></i>
                </div>
                <div class="result-compact-content">
                  <div class="result-compact-label">Total Value</div>
                  <div class="result-compact-value">${{ totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
                  <div class="result-compact-sub">@ ${{ targetPrice.toFixed(2) }}</div>
                </div>
              </div>

              <div class="profit-compact-card" :class="profitClass">
                <div class="profit-compact-icon">
                  <i :class="profit >= 0 ? 'bi bi-trending-up' : 'bi bi-trending-down'"></i>
                </div>
                <div class="profit-compact-content">
                  <div class="profit-compact-label">Gain / Loss</div>
                  <div class="profit-compact-amount" :class="profitClass">
                    {{ profit >= 0 ? '+' : '' }}${{ profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </div>
                  <div class="profit-compact-percent" :class="profitClass">
                    {{ profitPercent >= 0 ? '+' : '' }}{{ profitPercent.toFixed(2) }}%
                  </div>
                </div>
              </div>
            </div>

            <div class="profit-breakdown-compact">
              <div class="breakdown-compact-item">
                <span class="breakdown-compact-label">Cost</span>
                <span class="breakdown-compact-value">${{ investmentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
              </div>
              <i class="bi bi-arrow-right breakdown-compact-arrow"></i>
              <div class="breakdown-compact-item">
                <span class="breakdown-compact-label">Value</span>
                <span class="breakdown-compact-value">${{ totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
              </div>
            </div>

            <div class="action-buttons-compact">
              <button 
                class="btn-save-compact"
                @click="saveCalculation"
                :disabled="!canSave"
              >
                <i class="bi bi-bookmark-plus"></i>
                Save
              </button>
              <button 
                class="btn-reset-compact"
                @click="resetCalculator"
                title="Reset all values"
              >
                <i class="bi bi-arrow-counterclockwise"></i>
                Reset
              </button>
            </div>
          </div>

          <div v-else class="empty-state-enhanced">
            <div class="empty-icon-enhanced">
              <i class="bi bi-calculator-fill"></i>
            </div>
            <p v-if="!purchasePrice || purchasePrice <= 0">Enter your purchase price to begin</p>
            <p v-else>Set a target price to see your potential profit</p>
          </div>

          <div v-if="currentStock" class="additional-features">
            <div class="features-grid">
              <div class="feature-card must-buy-card">
                <div class="feature-header">
                  <i class="bi bi-star-fill"></i>
                  <span>Must Buy Stocks</span>
                </div>
                <div class="must-buy-list">
                  <div 
                    v-for="stock in mustBuyStocks" 
                    :key="stock.id"
                    class="must-buy-item"
                    @click="selectStockFromRecommendation(stock)"
                  >
                    <div class="must-buy-symbol">{{ stock.displaySymbol || stock.symbol }}</div>
                    <div class="must-buy-info">
                      <div class="must-buy-name">{{ stock.name }}</div>
                      <div class="must-buy-price">${{ formatPrice(stock.price) }}</div>
                    </div>
                    <div class="must-buy-change" :class="stock.changePercent >= 0 ? 'positive' : 'negative'">
                      <i :class="stock.changePercent >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                      <span>{{ stock.changePercent >= 0 ? '+' : '' }}{{ stock.changePercent?.toFixed(2) || '0.00' }}%</span>
                    </div>
                  </div>
                  <div v-if="mustBuyStocks.length === 0" class="no-recommendations">
                    <i class="bi bi-info-circle"></i>
                    <p>No recommendations available</p>
                  </div>
                </div>
              </div>

              <div class="feature-card quick-stats-card">
                <div class="feature-header">
                  <i class="bi bi-speedometer2"></i>
                  <span>Quick Stats</span>
                </div>
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-label">52W High</div>
                    <div class="stat-value">${{ (currentStock.high || currentStock.price * 1.2).toFixed(2) }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">52W Low</div>
                    <div class="stat-value">${{ (currentStock.low || currentStock.price * 0.8).toFixed(2) }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">Volume</div>
                    <div class="stat-value">{{ formatVolume(currentStock.volume) }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">Sector</div>
                    <div class="stat-value">{{ currentStock.sector || 'N/A' }}</div>
                  </div>
                </div>
              </div>

              <div class="feature-card insights-card">
                <div class="feature-header">
                  <i class="bi bi-lightbulb"></i>
                  <span>Insights</span>
                </div>
                <div class="insights-content">
                  <div class="insight-item" v-if="targetPrice > purchasePrice">
                    <i class="bi bi-check-circle-fill text-success"></i>
                    <span>Target price is <strong>{{ ((targetPrice / purchasePrice - 1) * 100).toFixed(1) }}%</strong> above purchase</span>
                  </div>
                  <div class="insight-item" v-else-if="targetPrice < purchasePrice">
                    <i class="bi bi-exclamation-triangle-fill text-warning"></i>
                    <span>Target price is <strong>{{ ((1 - targetPrice / purchasePrice) * 100).toFixed(1) }}%</strong> below purchase</span>
                  </div>
                  <div class="insight-item" v-if="shares > 0">
                    <i class="bi bi-info-circle-fill text-info"></i>
                    <span>You'll own <strong>{{ shares.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}</strong> shares</span>
                  </div>
                  <div class="insight-item" v-if="profitPercent !== 0">
                    <i :class="profit >= 0 ? 'bi bi-trophy-fill text-success' : 'bi bi-exclamation-circle-fill text-danger'"></i>
                    <span>{{ profit >= 0 ? 'Potential gain' : 'Potential loss' }} of <strong>{{ Math.abs(profitPercent).toFixed(2) }}%</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">
            <i class="bi bi-graph-up-arrow"></i>
          </div>
          <p>Select a stock from the dropdown above to calculate profit</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useMarketStore } from '../store/market'
import { useSavedCalculationsStore } from '../store/savedCalculations'
import { useSettingsStore } from '../store/settings'
import { useToast } from '../composables/useToast'
import { Chart, registerables } from 'chart.js'
import './ProfitCalculator.css'

Chart.register(...registerables)

const props = defineProps({
  stock: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['stock-change'])

const marketStore = useMarketStore()
const savedCalculationsStore = useSavedCalculationsStore()
const settingsStore = useSettingsStore()
const toast = useToast()
const availableStocks = computed(() => marketStore.activeStocks)
const selectedStockId = ref(null)
const currentStock = ref(props.stock)

const isDropdownOpen = ref(false)
const searchQuery = ref('')
const highlightedIndex = ref(-1)
const searchInput = ref(null)
const stocksList = ref(null)
const priceChartCanvas = ref(null)
const showPriceChart = ref(false)
const selectedTimeframe = ref('1D')
let priceChartInstance = null

const timeframes = [
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
  { label: '1M', value: '1M' },
  { label: '3M', value: '3M' },
  { label: '1Y', value: '1Y' }
]

const selectedStock = computed(() => {
  if (!selectedStockId.value) return null
  return availableStocks.value.find(s => s.id === selectedStockId.value) || null
})

const filteredStocks = computed(() => {
  if (!searchQuery.value.trim()) {
    return availableStocks.value
  }
  const query = searchQuery.value.toLowerCase()
  return availableStocks.value.filter(stock => {
    const symbol = (stock.displaySymbol || stock.symbol || '').toLowerCase()
    const name = (stock.name || '').toLowerCase()
    return symbol.includes(query) || name.includes(query)
  })
})

const toggleDropdown = () => {
  if (!availableStocks.value || availableStocks.value.length === 0) return
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value) {
    setTimeout(() => {
      searchInput.value?.focus()
    }, 100)
  }
}

const selectStock = (stock) => {
  selectedStockId.value = stock.id
  isDropdownOpen.value = false
  searchQuery.value = ''
  highlightedIndex.value = -1
  onStockChange()
}

const clearSearch = () => {
  searchQuery.value = ''
  highlightedIndex.value = -1
}

const filterStocks = () => {
  highlightedIndex.value = -1
}

const formatPrice = (price) => {
  if (!price) return '0.00'
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatVolume = (volume) => {
  if (!volume) return 'N/A'
  if (volume >= 1000000000) return (volume / 1000000000).toFixed(2) + 'B'
  if (volume >= 1000000) return (volume / 1000000).toFixed(2) + 'M'
  if (volume >= 1000) return (volume / 1000).toFixed(2) + 'K'
  return volume.toLocaleString()
}

const mustBuyStocks = computed(() => {
  if (!availableStocks.value || availableStocks.value.length === 0) return []
  
  return availableStocks.value
    .filter(stock => {
      if (!stock.active) return false
      if (stock.isCrypto) return false
      const changePercent = stock.changePercent || 0
      const volume = stock.volume || 0
      return changePercent > 0 && volume > 1000000
    })
    .sort((a, b) => {
      const scoreA = (a.changePercent || 0) * 0.6 + Math.min((a.volume || 0) / 10000000, 1) * 0.4
      const scoreB = (b.changePercent || 0) * 0.6 + Math.min((b.volume || 0) / 10000000, 1) * 0.4
      return scoreB - scoreA
    })
    .slice(0, 5)
})

const selectStockFromRecommendation = (stock) => {
  selectedStockId.value = stock.id
  currentStock.value = stock
  isDropdownOpen.value = false
  searchQuery.value = ''
  onStockChange()
}

const getPriceChangeClass = (stock) => {
  if (!stock || stock.changePercent === undefined) return ''
  return stock.changePercent >= 0 ? 'price-positive' : 'price-negative'
}

const handleClickOutside = (event) => {
  if (isDropdownOpen.value && !event.target.closest('.custom-select-wrapper')) {
    isDropdownOpen.value = false
    searchQuery.value = ''
  }
}

const handleKeydown = (event) => {
  if (!isDropdownOpen.value) return
  
  if (event.key === 'Escape') {
    isDropdownOpen.value = false
    searchQuery.value = ''
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredStocks.value.length - 1)
    scrollToHighlighted()
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
    scrollToHighlighted()
  } else if (event.key === 'Enter' && highlightedIndex.value >= 0) {
    event.preventDefault()
    const stock = filteredStocks.value[highlightedIndex.value]
    if (stock) selectStock(stock)
  }
}

const scrollToHighlighted = () => {
  if (highlightedIndex.value >= 0 && stocksList.value) {
    const highlightedElement = stocksList.value.querySelectorAll('.stock-option')[highlightedIndex.value]
    if (highlightedElement) {
      highlightedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }
}


const togglePriceChart = () => {
  showPriceChart.value = !showPriceChart.value
  if (showPriceChart.value && currentStock.value) {
    nextTick(() => {
      updatePriceChart()
    })
  }
}

const generatePriceData = (basePrice, timeframe) => {
  const dataPoints = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 365
  const data = []
  const labels = []
  
  for (let i = dataPoints; i >= 0; i--) {
    const variation = (Math.random() - 0.5) * 0.1
    const trend = Math.sin((dataPoints - i) / dataPoints * Math.PI * 2) * 0.05
    const price = basePrice * (1 + variation + trend)
    data.push(price)
    
    if (timeframe === '1D') {
      const hour = 24 - i
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
      const period = hour < 12 ? 'AM' : 'PM'
      labels.push(`${displayHour}:00 ${period}`)
    } else if (timeframe === '1W') {
      labels.push(`Day ${7 - i}`)
    } else if (timeframe === '1M') {
      labels.push(`Day ${30 - i}`)
    } else if (timeframe === '3M') {
      labels.push(`Week ${Math.floor((90 - i) / 7) + 1}`)
    } else {
      labels.push(`Month ${Math.floor((365 - i) / 30) + 1}`)
    }
  }
  
  return { labels, data }
}

const updatePriceChart = () => {
  if (!priceChartCanvas.value || !currentStock.value) return

  nextTick(() => {
    try {
      const ctx = priceChartCanvas.value.getContext('2d')
      if (!ctx) return

      if (priceChartInstance) {
        priceChartInstance.destroy()
      }

      const { labels, data } = generatePriceData(currentStock.value.price, selectedTimeframe.value)
      const isPositive = currentStock.value.changePercent >= 0
      const chartColor = isPositive ? '#10b981' : '#ef4444'
      const bgColor = isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'

      priceChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Price',
            data,
            borderColor: chartColor,
            backgroundColor: bgColor,
            tension: 0.4,
            fill: true,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 2,
            pointHoverBackgroundColor: chartColor,
            pointHoverBorderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              titleFont: {
                size: 14,
                weight: 'bold'
              },
              bodyFont: {
                size: 13
              },
              displayColors: false,
              callbacks: {
                label: function(context) {
                  return '$' + context.parsed.y.toFixed(2)
                }
              }
            }
          },
          scales: {
            x: {
              display: true,
              grid: {
                display: false
              },
              ticks: {
                maxTicksLimit: 8,
                font: {
                  size: 11
                },
                color: '#64748b'
              }
            },
            y: {
              display: true,
              position: 'right',
              grid: {
                color: 'rgba(100, 116, 139, 0.1)',
                drawBorder: false
              },
              ticks: {
                font: {
                  size: 11
                },
                color: '#64748b',
                callback: function(value) {
                  return '$' + value.toFixed(2)
                }
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }
      })
    } catch (error) {
      console.error('Error creating price chart:', error)
    }
  })
}

watch(() => currentStock.value, (newStock) => {
  if (newStock && showPriceChart.value) {
    updatePriceChart()
  }
})

watch(() => showPriceChart.value, (isOpen) => {
  if (isOpen && currentStock.value) {
    nextTick(() => {
      updatePriceChart()
    })
  }
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
  if (priceChartInstance) {
    priceChartInstance.destroy()
    priceChartInstance = null
  }
})

const investmentAmount = ref(settingsStore.defaultInvestmentAmount)
const purchasePrice = ref(0)
const targetPrice = ref(0)
const shares = ref(0)
const totalValue = ref(0)
const profit = ref(0)
const profitPercent = ref(0)
const previousPrice = ref(0)
const priceChangeClass = ref('')

const calculateProfit = () => {
  if (!currentStock.value || !purchasePrice.value || purchasePrice.value <= 0 || !targetPrice.value || targetPrice.value <= 0 || !investmentAmount.value || investmentAmount.value <= 0) {
    shares.value = 0
    totalValue.value = 0
    profit.value = 0
    profitPercent.value = 0
    return
  }

  shares.value = investmentAmount.value / purchasePrice.value
  totalValue.value = shares.value * targetPrice.value
  profit.value = totalValue.value - investmentAmount.value
  profitPercent.value = purchasePrice.value > 0 ? (((targetPrice.value - purchasePrice.value) / purchasePrice.value) * 100) : 0
}

const canSave = computed(() => {
  return currentStock.value && 
         purchasePrice.value > 0 && 
         targetPrice.value > 0 && 
         investmentAmount.value > 0 &&
         profit.value !== 0
})

const saveCalculation = () => {
  if (!canSave.value) return

  savedCalculationsStore.saveCalculation({
    stockId: currentStock.value.id,
    symbol: currentStock.value.symbol,
    displaySymbol: currentStock.value.displaySymbol || currentStock.value.symbol,
    stockName: currentStock.value.name,
    investmentAmount: investmentAmount.value,
    purchasePrice: purchasePrice.value,
    targetPrice: targetPrice.value,
    shares: shares.value,
    totalValue: totalValue.value,
    profit: profit.value,
    profitPercent: profitPercent.value,
    currentPrice: currentStock.value.price
  })
}

watch(() => props.stock, (newStock) => {
  currentStock.value = newStock
  if (newStock) {
    selectedStockId.value = newStock.id
    purchasePrice.value = newStock.price
    targetPrice.value = newStock.price
    calculateProfit()
  }
}, { immediate: true })

watch(() => {
  if (currentStock.value && selectedStockId.value) {
    const updatedStock = marketStore.activeStocks.find(s => s.id === selectedStockId.value)
    return updatedStock ? updatedStock.price : null
  }
  return null
}, (newPrice) => {
  if (newPrice && currentStock.value && newPrice !== currentStock.value.price) {
    const oldPrice = currentStock.value.price
    
    if (previousPrice.value > 0) {
      if (newPrice > previousPrice.value) {
        priceChangeClass.value = 'price-up'
        setTimeout(() => priceChangeClass.value = '', 1000)
      } else if (newPrice < previousPrice.value) {
        priceChangeClass.value = 'price-down'
        setTimeout(() => priceChangeClass.value = '', 1000)
      }
    }
    
    previousPrice.value = newPrice
    
    const updatedStock = marketStore.activeStocks.find(s => s.id === selectedStockId.value)
    if (updatedStock) {
      currentStock.value = updatedStock
      if (purchasePrice.value === oldPrice || purchasePrice.value === 0) {
        const priceDiff = Math.abs(purchasePrice.value - updatedStock.price) / updatedStock.price
        if (priceDiff < 0.01 || purchasePrice.value === 0) {
          purchasePrice.value = updatedStock.price
        }
      }
    }
  } else if (currentStock.value && !previousPrice.value) {
    previousPrice.value = currentStock.value.price
  }
}, { immediate: true })

const onStockChange = () => {
  if (selectedStockId.value) {
    const selectedStock = availableStocks.value.find(s => s.id === selectedStockId.value)
    if (selectedStock) {
      currentStock.value = selectedStock
      emit('stock-change', selectedStock)
      purchasePrice.value = selectedStock.price
      targetPrice.value = selectedStock.price
      calculateProfit()
    }
  }
}

const setPurchasePrice = (price) => {
  purchasePrice.value = price
  calculateProfit()
}

const profitClass = computed(() => {
  if (profit.value > 0) return 'profit-positive'
  if (profit.value < 0) return 'profit-negative'
  return 'profit-neutral'
})

const setTargetPrice = (price) => {
  targetPrice.value = price
  calculateProfit()
}

const setInvestmentAmount = (amount) => {
  investmentAmount.value = amount
  calculateProfit()
}

const loadCalculation = (calc) => {
  if (!calc) return
  
  const stock = availableStocks.value.find(s => 
    s.symbol === calc.symbol || 
    s.id === calc.stockId ||
    (s.displaySymbol && s.displaySymbol === calc.displaySymbol)
  )
  
  if (stock) {
    selectedStockId.value = stock.id
    currentStock.value = stock
    emit('stock-change', stock)
  } else {
    toast.error('Stock not found', 'The stock from this calculation is no longer available.')
    return
  }
  
  investmentAmount.value = calc.investmentAmount || settingsStore.defaultInvestmentAmount
  purchasePrice.value = calc.purchasePrice || 0
  targetPrice.value = calc.targetPrice || 0
  
  calculateProfit()
  
  toast.success('Calculation loaded', `Loaded calculation for ${calc.displaySymbol || calc.symbol}`)
}

defineExpose({
  loadCalculation
})

const resetCalculator = () => {
  selectedStockId.value = null
  currentStock.value = null
  purchasePrice.value = 0
  targetPrice.value = 0
  investmentAmount.value = settingsStore.defaultInvestmentAmount
  shares.value = 0
  totalValue.value = 0
  profit.value = 0
  profitPercent.value = 0
  previousPrice.value = 0
  priceChangeClass.value = ''
  emit('stock-change', null)
}

watch(() => settingsStore.defaultInvestmentAmount, (newAmount) => {
  if (investmentAmount.value === settingsStore.defaultInvestmentAmount) {
    investmentAmount.value = newAmount
  }
})
</script>

