import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWatchlistStore = defineStore('watchlist', () => {
  const watchlist = ref([])

  const watchlistCount = computed(() => {
    return watchlist.value.length
  })

  function isInWatchlist(stockId) {
    return watchlist.value.includes(stockId)
  }

  function addToWatchlist(stockId) {
    if (!watchlist.value.includes(stockId)) {
      watchlist.value.push(stockId)
      localStorage.setItem('watchlist', JSON.stringify(watchlist.value))
    }
  }

  function removeFromWatchlist(stockId) {
    const index = watchlist.value.indexOf(stockId)
    if (index > -1) {
      watchlist.value.splice(index, 1)
      localStorage.setItem('watchlist', JSON.stringify(watchlist.value))
    }
  }

  function toggleWatchlist(stockId) {
    if (isInWatchlist(stockId)) {
      removeFromWatchlist(stockId)
    } else {
      addToWatchlist(stockId)
    }
  }

  function loadWatchlist() {
    const saved = localStorage.getItem('watchlist')
    if (saved) {
      try {
        watchlist.value = JSON.parse(saved)
      } catch (e) {
        console.error('Error loading watchlist:', e)
        watchlist.value = []
      }
    }
  }

  function clearWatchlist() {
    watchlist.value = []
    localStorage.removeItem('watchlist')
  }

  loadWatchlist()

  return {
    watchlist,
    watchlistCount,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    clearWatchlist
  }
})

