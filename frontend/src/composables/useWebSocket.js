import { ref } from 'vue'
import { io } from 'socket.io-client'
import { useMarketStore } from '../store/market'
import { useSettingsStore } from '../store/settings'

export function useWebSocket() {
  const socket = ref(null)
  const connected = ref(false)
  const marketStore = useMarketStore()
  const settingsStore = useSettingsStore()

  const connect = (url = null) => {
    const wsUrl = url || import.meta.env.VITE_WS_URL || 'http://localhost:3000'
    socket.value = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    })
    
    window.socket = socket.value

    socket.value.on('connect', () => {
      connected.value = true
    })

    socket.value.on('disconnect', () => {
      connected.value = false
    })

    socket.value.on('market:update', (data) => {
      if (data.stocks) {
        marketStore.setStocks(data.stocks)
      }
    })

    socket.value.on('stock:price-update', (data) => {
      if (data.stockId) {
        const stock = marketStore.stocks.find(s => s.id === data.stockId)
        if (stock) {
          stock.price = data.price
          if (data.change !== undefined) stock.change = data.change
          if (data.changePercent !== undefined) stock.changePercent = data.changePercent
          if (data.volume !== undefined) stock.volume = data.volume
          if (data.high !== undefined) stock.high = data.high
          if (data.low !== undefined) stock.low = data.low
        } else {
          marketStore.updateStockPrice(data.stockId, data.price)
        }
      }
    })

  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      connected.value = false
    }
  }

  const emit = (event, data) => {
    if (socket.value && connected.value) {
      socket.value.emit(event, data)
    }
  }

  return {
    socket,
    connected,
    connect,
    disconnect,
    emit
  }
}

