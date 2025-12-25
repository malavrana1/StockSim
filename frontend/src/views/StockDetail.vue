<template>
  <div class="stock-detail">
    <div class="container">
      <div v-if="stock" class="row">
        <div class="col-12 mb-4">
          <button class="btn btn-secondary" @click="$router.back()">
            <i class="bi bi-arrow-left"></i> Back
          </button>
        </div>

        <div class="col-md-8">
          <div class="card mb-4">
            <div class="card-header">
              <h3 class="mb-0">{{ stock.symbol }} - {{ stock.name }}</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <h4 class="mb-0">${{ stock.price.toFixed(2) }}</h4>
                  <span 
                    class="badge"
                    :class="stock.changePercent >= 0 ? 'bg-success' : 'bg-danger'"
                  >
                    {{ stock.changePercent >= 0 ? '+' : '' }}{{ stock.changePercent }}%
                  </span>
                </div>
                <div class="col-md-6 text-end">
                  <p class="mb-1"><strong>Sector:</strong> {{ stock.sector }}</p>
                  <p class="mb-0"><strong>Volume:</strong> {{ formatNumber(stock.volume) }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Price History</h5>
            </div>
            <div class="card-body">
              <canvas ref="chartCanvas"></canvas>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">Trade</h5>
            </div>
            <div class="card-body">
              <button 
                class="btn btn-success w-100 mb-2"
                @click="openTradeModal('buy')"
              >
                Buy {{ stock.symbol }}
              </button>
              <button 
                class="btn btn-danger w-100"
                @click="openTradeModal('sell')"
                :disabled="!hasHoldings"
              >
                Sell {{ stock.symbol }}
              </button>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">My Position</h5>
            </div>
            <div class="card-body">
              <div v-if="holding">
                <p><strong>Shares:</strong> {{ holding.quantity }}</p>
                <p><strong>Avg Price:</strong> ${{ holding.avgPrice.toFixed(2) }}</p>
                <p><strong>Current Price:</strong> ${{ holding.currentPrice.toFixed(2) }}</p>
                <p>
                  <strong>Gain/Loss:</strong>
                  <span :class="gainLoss >= 0 ? 'text-success' : 'text-danger'">
                    ${{ gainLoss >= 0 ? '+' : '' }}{{ gainLoss.toFixed(2) }}
                  </span>
                </p>
              </div>
              <div v-else class="text-center text-muted">
                No position
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center">
        <p>Stock not found</p>
        <router-link to="/" class="btn btn-primary">Go to Dashboard</router-link>
      </div>

      <TradeModal 
        :isOpen="tradeModalOpen"
        :stock="stock"
        :tradeType="tradeType"
        @close="closeTradeModal"
        @trade="handleTrade"
      />
    </div>
  </div>
</template>

<script setup>
import './StockDetail.css'
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Chart, registerables } from 'chart.js'
import { useMarketStore } from '../store/market'
import { usePortfolioStore } from '../store/portfolio'
import { formatNumber } from '../utils/helpers'
import TradeModal from '../components/TradeModal.vue'

Chart.register(...registerables)

const route = useRoute()
const marketStore = useMarketStore()
const portfolioStore = usePortfolioStore()

const stock = computed(() => {
  const stockId = route.params.id
  return marketStore.stocks.find(s => s.id === parseInt(stockId))
})

const holding = computed(() => {
  if (!stock.value) return null
  return portfolioStore.holdings.find(h => h.stockId === stock.value.id)
})

const hasHoldings = computed(() => {
  return holding.value && holding.value.quantity > 0
})

const gainLoss = computed(() => {
  if (!holding.value) return 0
  return (holding.value.currentPrice - holding.value.avgPrice) * holding.value.quantity
})

const tradeModalOpen = ref(false)
const tradeType = ref('buy')
const chartCanvas = ref(null)
let chartInstance = null

const openTradeModal = (type) => {
  tradeType.value = type
  tradeModalOpen.value = true
}

const closeTradeModal = () => {
  tradeModalOpen.value = false
}

const handleTrade = (trade) => {
  portfolioStore.addTrade(trade)
  portfolioStore.updateHoldings(
    trade.stockId,
    trade.symbol,
    trade.quantity,
    trade.price,
    trade.type
  )
}

const initChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  nextTick(() => {
    if (chartCanvas.value && stock.value && chartCanvas.value.parentNode) {
      try {
    const ctx = chartCanvas.value.getContext('2d')
        if (!ctx) return

    const labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
    const data = labels.map(() => stock.value.price + (Math.random() - 0.5) * 10)

        chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Price',
          data,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    })
      } catch (error) {
        console.error('Error creating chart:', error)
      }
    }
  })
}

watch(() => stock.value, () => {
  if (stock.value) {
    initChart()
  }
}, { immediate: false })

onMounted(() => {
  setTimeout(() => {
    initChart()
  }, 100)
})

onUnmounted(() => {
  if (chartInstance) {
    try {
      chartInstance.destroy()
    } catch (error) {
      console.error('Error destroying chart:', error)
    }
    chartInstance = null
  }
})
</script>

