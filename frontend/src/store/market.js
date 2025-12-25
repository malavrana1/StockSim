import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMarketStore = defineStore('market', () => {
  const stocks = ref([])
  const marketStatus = ref('open')
  const currentRound = ref(1)
  const roundTimeLeft = ref(300)
  const marketNews = ref([])
  const aiSuggestions = ref([])
  const marketEvents = ref([])

  const activeStocks = computed(() => {
    return stocks.value.filter(s => s.active !== false)
  })

  const topGainers = computed(() => {
    return [...stocks.value]
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 5)
  })

  const topLosers = computed(() => {
    return [...stocks.value]
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 5)
  })

  function setStocks(newStocks) {
    stocks.value = newStocks
  }

  function updateStockPrice(stockId, newPrice) {
    const stock = stocks.value.find(s => s.id === stockId)
    if (stock) {
      const oldPrice = stock.price
      stock.price = newPrice
      stock.change = newPrice - oldPrice
      stock.changePercent = ((stock.change / oldPrice) * 100).toFixed(2)
    }
  }

  function setMarketStatus(status) {
    marketStatus.value = status
  }

  function setRoundTimeLeft(seconds) {
    roundTimeLeft.value = seconds
  }

  function incrementRound() {
    currentRound.value++
  }

  function addNews(newsItem) {
    marketNews.value.unshift({
      id: Date.now(),
      ...newsItem,
      timestamp: new Date().toISOString()
    })
    if (marketNews.value.length > 50) {
      marketNews.value = marketNews.value.slice(0, 50)
    }
  }

  function setAISuggestions(suggestions) {
    aiSuggestions.value = suggestions
  }

  function addMarketEvent(event) {
    marketEvents.value.unshift({
      id: Date.now(),
      ...event,
      timestamp: new Date().toISOString()
    })
  }

  function resetMarket() {
    stocks.value = []
    marketStatus.value = 'open'
    currentRound.value = 1
    roundTimeLeft.value = 300
    marketNews.value = []
    aiSuggestions.value = []
    marketEvents.value = []
  }

  return {
    stocks,
    marketStatus,
    currentRound,
    roundTimeLeft,
    marketNews,
    aiSuggestions,
    marketEvents,
    activeStocks,
    topGainers,
    topLosers,
    setStocks,
    updateStockPrice,
    setMarketStatus,
    setRoundTimeLeft,
    incrementRound,
    addNews,
    setAISuggestions,
    addMarketEvent,
    resetMarket
  }
})

