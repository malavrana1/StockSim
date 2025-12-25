import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePortfolioStore = defineStore('portfolio', () => {
  const balance = ref(100000)
  const holdings = ref([])
  const tradeHistory = ref([])
  const totalValue = ref(0)

  const portfolioValue = computed(() => {
    const stocksValue = holdings.value.reduce((sum, holding) => {
      return sum + (holding.quantity * holding.currentPrice)
    }, 0)
    return balance.value + stocksValue
  })

  const totalGainLoss = computed(() => {
    return portfolioValue.value - 100000
  })

  const totalGainLossPercent = computed(() => {
    return ((portfolioValue.value - 100000) / 100000) * 100
  })

  function addTrade(trade) {
    tradeHistory.value.unshift({
      id: Date.now(),
      ...trade,
      timestamp: new Date().toISOString()
    })
  }

  function updateHoldings(stockId, symbol, quantity, price, type) {
    const existingIndex = holdings.value.findIndex(h => h.stockId === stockId)
    
    if (type === 'buy') {
      if (existingIndex >= 0) {
        const existing = holdings.value[existingIndex]
        const totalCost = (existing.avgPrice * existing.quantity) + (price * quantity)
        const totalQuantity = existing.quantity + quantity
        holdings.value[existingIndex] = {
          ...existing,
          quantity: totalQuantity,
          avgPrice: totalCost / totalQuantity,
          currentPrice: price
        }
      } else {
        holdings.value.push({
          stockId,
          symbol,
          quantity,
          avgPrice: price,
          currentPrice: price
        })
      }
      balance.value -= price * quantity
    } else if (type === 'sell') {
      if (existingIndex >= 0) {
        const existing = holdings.value[existingIndex]
        if (existing.quantity <= quantity) {
          holdings.value.splice(existingIndex, 1)
        } else {
          holdings.value[existingIndex] = {
            ...existing,
            quantity: existing.quantity - quantity,
            currentPrice: price
          }
        }
        balance.value += price * quantity
      }
    }
  }

  function updateStockPrice(stockId, newPrice) {
    const holding = holdings.value.find(h => h.stockId === stockId)
    if (holding) {
      holding.currentPrice = newPrice
    }
  }

  function resetPortfolio() {
    balance.value = 100000
    holdings.value = []
    tradeHistory.value = []
    totalValue.value = 0
  }

  return {
    balance,
    holdings,
    tradeHistory,
    totalValue,
    portfolioValue,
    totalGainLoss,
    totalGainLossPercent,
    addTrade,
    updateHoldings,
    updateStockPrice,
    resetPortfolio
  }
})

