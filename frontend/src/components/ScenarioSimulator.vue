<template>
  <div class="card">
    <div class="card-header">
      <h5 class="mb-0">Scenario Simulator</h5>
      <small class="text-muted">Test "what-if" trading scenarios</small>
    </div>
    <div class="card-body">
      <div class="mb-3">
        <label for="stock-select" class="form-label">Select Stock</label>
        <select 
          id="stock-select" 
          class="form-select"
          v-model="selectedStockId"
        >
          <option value="">Choose a stock...</option>
          <option 
            v-for="stock in marketStore.activeStocks" 
            :key="stock.id"
            :value="stock.id"
          >
            {{ stock.symbol }} - {{ stock.name }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label for="quantity-slider" class="form-label">
          Quantity: {{ scenario.quantity }}
        </label>
        <input 
          type="range" 
          class="form-range" 
          id="quantity-slider"
          v-model.number="scenario.quantity"
          min="1"
          max="1000"
          @input="calculateProjection"
        />
      </div>

      <div class="mb-3">
        <label for="price-slider" class="form-label">
          Price per Share: ${{ scenario.price.toFixed(2) }}
        </label>
        <input 
          type="range" 
          class="form-range" 
          id="price-slider"
          v-model.number="scenario.price"
          :min="selectedStock?.price * 0.5 || 0"
          :max="selectedStock?.price * 1.5 || 100"
          :step="0.01"
          @input="calculateProjection"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Trade Type</label>
        <div class="btn-group w-100" role="group">
          <input 
            type="radio" 
            class="btn-check" 
            id="buy-scenario" 
            value="buy"
            v-model="scenario.type"
            @change="calculateProjection"
          />
          <label class="btn btn-outline-success" for="buy-scenario">Buy</label>

          <input 
            type="radio" 
            class="btn-check" 
            id="sell-scenario" 
            value="sell"
            v-model="scenario.type"
            @change="calculateProjection"
          />
          <label class="btn btn-outline-danger" for="sell-scenario">Sell</label>
        </div>
      </div>

      <div class="alert" :class="projection.profit >= 0 ? 'alert-success' : 'alert-danger'">
        <h6>Projection</h6>
        <p class="mb-1"><strong>Total Cost:</strong> ${{ projection.totalCost.toFixed(2) }}</p>
        <p class="mb-1"><strong>Estimated Profit/Loss:</strong> 
          <span :class="projection.profit >= 0 ? 'text-success' : 'text-danger'">
            ${{ projection.profit >= 0 ? '+' : '' }}{{ projection.profit.toFixed(2) }}
          </span>
        </p>
        <p class="mb-0"><strong>New Portfolio Value:</strong> ${{ projection.newPortfolioValue.toFixed(2) }}</p>
      </div>

      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useMarketStore } from '../store/market'
import { usePortfolioStore } from '../store/portfolio'

Chart.register(...registerables)

const marketStore = useMarketStore()
const portfolioStore = usePortfolioStore()
const chartCanvas = ref(null)

const selectedStockId = ref('')
const scenario = ref({
  quantity: 10,
  price: 0,
  type: 'buy'
})

const selectedStock = computed(() => {
  return marketStore.stocks.find(s => s.id === selectedStockId.value)
})

const projection = ref({
  totalCost: 0,
  profit: 0,
  newPortfolioValue: 0
})

watch(selectedStockId, (newId) => {
  if (newId && selectedStock.value) {
    scenario.value.price = selectedStock.value.price
    calculateProjection()
  }
})

const calculateProjection = () => {
  if (!selectedStock.value) return

  const totalCost = scenario.value.quantity * scenario.value.price
  const currentHolding = portfolioStore.holdings.find(h => h.stockId === selectedStock.value.id)
  
  let profit = 0
  let newPortfolioValue = portfolioStore.portfolioValue

  if (scenario.value.type === 'buy') {
    if (currentHolding) {
      const avgPrice = currentHolding.avgPrice
      profit = (selectedStock.value.price - avgPrice) * scenario.value.quantity
    }
    newPortfolioValue = portfolioStore.portfolioValue - totalCost + (scenario.value.quantity * selectedStock.value.price)
  } else {
    if (currentHolding) {
      profit = (scenario.value.price - currentHolding.avgPrice) * scenario.value.quantity
      newPortfolioValue = portfolioStore.portfolioValue + totalCost - (scenario.value.quantity * currentHolding.avgPrice)
    }
  }

  projection.value = {
    totalCost,
    profit,
    newPortfolioValue
  }

  updateChart()
}

const updateChart = () => {
  if (!chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')
  
  const data = {
    labels: ['Current', 'After Trade'],
    datasets: [{
      label: 'Portfolio Value',
      data: [portfolioStore.portfolioValue, projection.value.newPortfolioValue],
      backgroundColor: [
        'rgba(75, 192, 192, 0.2)',
        projection.value.profit >= 0 ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        projection.value.profit >= 0 ? 'rgba(40, 167, 69, 1)' : 'rgba(220, 53, 69, 1)'
      ],
      borderWidth: 2
    }]
  }

  if (window.scenarioChart) {
    window.scenarioChart.destroy()
  }

  window.scenarioChart = new Chart(ctx, {
    type: 'bar',
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  })
}
</script>

<style scoped>
canvas {
  max-height: 200px;
  margin-top: 1rem;
}
</style>

