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
          <div class="header-actions" v-if="currentStock">
            <button 
              class="reset-btn-header"
              @click="resetCalculator"
              title="Reset all values"
            >
              <i class="bi bi-arrow-counterclockwise"></i>
              Reset
            </button>
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
          <div class="price-cards">
            <div class="price-card market-price">
              <div class="price-card-icon">
                <i class="bi bi-graph-up"></i>
              </div>
              <div class="price-card-content">
                <div class="price-label">
                  Current Market Price
                  <span class="live-badge">
                    <i class="bi bi-circle-fill"></i> LIVE
                  </span>
                </div>
                <div 
                  class="price-value" 
                  :class="priceChangeClass"
                  :key="`price-${currentStock.price}-${Date.now()}`"
                >
                  ${{ currentStock.price.toFixed(2) }}
                </div>
                <div class="price-change" :class="currentStock.changePercent >= 0 ? 'positive' : 'negative'">
                  <i :class="currentStock.changePercent >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                  {{ currentStock.changePercent >= 0 ? '+' : '' }}${{ currentStock.change.toFixed(2) }}
                  <span class="change-percent">
                    ({{ currentStock.changePercent >= 0 ? '+' : '' }}{{ currentStock.changePercent.toFixed(2) }}%)
                  </span>
                </div>
              </div>
            </div>

            <div class="price-card purchase-price">
              <div class="price-card-icon">
                <i class="bi bi-cart-check"></i>
              </div>
              <div class="price-card-content">
                <div class="price-label">Your Purchase Price</div>
                <div class="input-wrapper">
                  <span class="currency-symbol">$</span>
                  <input 
                    type="number" 
                    class="modern-input"
                    v-model.number="purchasePrice"
                    :min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    @input="calculateProfit"
                  />
                </div>
                <button 
                  class="quick-btn"
                  @click="setPurchasePrice(currentStock.price)"
                  title="Use current price"
                >
                  <i class="bi bi-arrow-clockwise"></i> Use Current
                </button>
              </div>
            </div>

            <div class="price-card investment-amount">
              <div class="price-card-icon">
                <i class="bi bi-wallet2"></i>
              </div>
              <div class="price-card-content">
                <div class="price-label">Investment Amount</div>
                <div class="input-wrapper">
                  <span class="currency-symbol">$</span>
                  <input 
                    type="number" 
                    class="modern-input"
                    v-model.number="investmentAmount"
                    :min="1"
                    step="100"
                    placeholder="0"
                    @input="calculateProfit"
                  />
                </div>
                <div class="quick-amounts">
                  <button 
                    v-for="amount in quickAmounts"
                    :key="amount"
                    class="quick-amount-btn"
                    @click="setInvestmentAmount(amount)"
                  >
                    ${{ formatQuickAmount(amount) }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="target-section">
            <label for="targetPrice" class="input-label">
              <i class="bi bi-bullseye me-2"></i>
              Target Price
            </label>
            <div class="target-input-wrapper">
              <span class="currency-symbol-large">$</span>
              <input 
                type="number" 
                class="modern-input-large" 
                id="targetPrice"
                v-model.number="targetPrice"
                :min="0.01"
                step="0.01"
                placeholder="Enter target price"
                @input="calculateProfit"
              />
            </div>
          </div>

          <div v-if="targetPrice > 0 && purchasePrice > 0" class="results-section">
            <div class="results-grid">
              <div class="result-card shares-card">
                <div class="result-icon">
                  <i class="bi bi-stack"></i>
                </div>
                <div class="result-content">
                  <div class="result-label">Shares</div>
                  <div class="result-value">{{ shares.toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 0 }) }}</div>
                  <div class="result-subtext">@ ${{ purchasePrice.toFixed(2) }}</div>
                </div>
              </div>

              <div class="result-card value-card">
                <div class="result-icon">
                  <i class="bi bi-cash-stack"></i>
                </div>
                <div class="result-content">
                  <div class="result-label">Total Value</div>
                  <div class="result-value">${{ totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
                  <div class="result-subtext">{{ shares.toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 0 }) }} shares @ ${{ targetPrice.toFixed(2) }}</div>
                </div>
              </div>

              <div class="result-card profit-card" :class="profitClass">
                <div class="result-icon-large">
                  <i :class="profit >= 0 ? 'bi bi-trending-up' : 'bi bi-trending-down'"></i>
                </div>
                <div class="result-content-large">
                  <div class="result-label">Total Gain / Loss</div>
                  <div class="result-value-large" :class="profitClass">
                    {{ profit >= 0 ? '+' : '' }}${{ profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </div>
                  <div class="result-percentage" :class="profitClass">
                    {{ profitPercent >= 0 ? '+' : '' }}{{ profitPercent.toFixed(2) }}% return
                  </div>
                  <div class="result-comparison">
                    <span class="comparison-item">Cost Basis: ${{ investmentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                    <i class="bi bi-arrow-right"></i>
                    <span class="comparison-item">Value: ${{ totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="save-section" v-if="profit !== 0">
              <button 
                class="save-btn"
                @click="saveCalculation"
                :disabled="!canSave"
              >
                <i class="bi bi-bookmark-plus"></i>
                Save Calculation
              </button>
              <button 
                class="reset-btn"
                @click="resetCalculator"
                title="Reset all values"
              >
                <i class="bi bi-arrow-counterclockwise"></i>
                Reset
              </button>
            </div>
          </div>

          <div v-else class="empty-state">
            <div class="empty-icon">
              <i class="bi bi-calculator-fill"></i>
            </div>
            <p v-if="!purchasePrice || purchasePrice <= 0">Enter your purchase price to begin</p>
            <p v-else>Set a target price to see your potential profit</p>
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useMarketStore } from '../store/market'
import { useSavedCalculationsStore } from '../store/savedCalculations'
import { useSettingsStore } from '../store/settings'
import { useToast } from '../composables/useToast'
import './ProfitCalculator.css'

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

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
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

const quickAmounts = [1000, 5000, 10000, 25000, 50000]

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

const formatQuickAmount = (amount) => {
  if (amount >= 1000) return (amount / 1000).toFixed(0) + 'K'
  return amount.toString()
}
</script>

