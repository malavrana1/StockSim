import { ref } from 'vue'
import { useMarketStore } from '../store/market'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export function useApi() {
  const marketStore = useMarketStore()
  const loading = ref(false)
  const error = ref(null)

  const fetchStocks = async () => {
    loading.value = true
    error.value = null
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)
      
      const response = await fetch(`${API_BASE_URL}/stocks`, {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }
      
      const stocks = await response.json()
      
      if (Array.isArray(stocks) && stocks.length > 0) {
        marketStore.setStocks(stocks)
        return stocks
      } else {
        throw new Error('No stocks returned from API')
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        error.value = 'Request timed out. Please try again.'
      } else {
        error.value = err.message || 'Failed to fetch stocks. Please check your connection.'
      }
      console.error('Error fetching stocks:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchStock = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const stock = await response.json()
      return stock
    } catch (err) {
      error.value = err.message
      console.error('Error fetching stock:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchStockBySymbol = async (symbol) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/symbol/${symbol}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const stock = await response.json()
      return stock
    } catch (err) {
      error.value = err.message
      console.error('Error fetching stock by symbol:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const refreshStocks = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/refresh`, {
        method: 'POST'
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.stocks) {
        marketStore.setStocks(data.stocks)
      }
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error refreshing stocks:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchStocks,
    fetchStock,
    fetchStockBySymbol,
    refreshStocks
  }
}

