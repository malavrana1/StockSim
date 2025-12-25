<template>
  <div class="card">
    <div class="card-header">
      <h5 class="mb-0">Portfolio Performance</h5>
    </div>
    <div class="card-body">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { usePortfolioStore } from '../store/portfolio'

Chart.register(...registerables)

const props = defineProps({
  type: {
    type: String,
    default: 'line' // 'line' | 'bar' | 'pie'
  }
})

const portfolioStore = usePortfolioStore()
const chartCanvas = ref(null)
let chartInstance = null

const createChart = () => {
  if (!chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')
  
  const data = {
    labels: portfolioStore.tradeHistory.slice(0, 20).map(t => 
      new Date(t.timestamp).toLocaleTimeString()
    ).reverse(),
    datasets: [{
      label: 'Portfolio Value',
      data: portfolioStore.tradeHistory.slice(0, 20).map((t, i) => {
        return 100000 + (portfolioStore.totalGainLoss * (i / 20))
      }).reverse(),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1
    }]
  }

  const config = {
    type: props.type,
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: props.type === 'line' ? {
        y: {
          beginAtZero: false
        }
      } : undefined
    }
  }

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(ctx, config)
}

onMounted(() => {
  createChart()
})

watch(() => portfolioStore.tradeHistory, () => {
  createChart()
}, { deep: true })
</script>

<style scoped>
canvas {
  max-height: 400px;
}
</style>

