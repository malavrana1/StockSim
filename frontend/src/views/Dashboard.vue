<template>
  <div class="dashboard">
    <div class="container-fluid">
      <div class="row equal-height-row">
        <div class="col-lg-9 d-flex flex-column">
          <div class="calculator-wrapper">
            <ProfitCalculator 
              ref="profitCalculatorRef"
              :stock="selectedStockForCalculator"
              @stock-change="selectStockForCalculator"
            />
        </div>
      </div>

        <div class="col-lg-3 d-flex flex-column">
          <div class="saved-calc-wrapper">
            <SavedCalculations @load-calculation="handleLoadCalculation" />
          </div>
          <div class="news-wrapper">
            <StockNews 
              :stock="selectedStockForCalculator"
              class="news-compact"
            />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useMarketStore } from '../store/market'
import { useApi } from '../composables/useApi'
import { useWebSocket } from '../composables/useWebSocket'
import ProfitCalculator from '../components/ProfitCalculator.vue'
import StockNews from '../components/StockNews.vue'
import SavedCalculations from '../components/SavedCalculations.vue'
import './Dashboard.css'

const marketStore = useMarketStore()
const { fetchStocks } = useApi()
const { connect } = useWebSocket()

const selectedStockForCalculator = ref(null)
const profitCalculatorRef = ref(null)

const selectStockForCalculator = (stock) => {
  selectedStockForCalculator.value = stock
}

const handleLoadCalculation = (calc) => {
  if (profitCalculatorRef.value && profitCalculatorRef.value.loadCalculation) {
    profitCalculatorRef.value.loadCalculation(calc)
  }
}

watch(() => marketStore.activeStocks, (stocks) => {
  if (stocks.length > 0 && !selectedStockForCalculator.value) {
    selectedStockForCalculator.value = stocks[0]
  }
}, { immediate: true })

onMounted(async () => {
  try {
    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3000'
    connect(wsUrl)
    await fetchStocks()
  } catch (err) {
    console.error('Error initializing dashboard:', err)
  }
})
</script>

