import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { localStorageUtils } from '../utils/localStorage'

const STORAGE_KEY = 'watchlist'

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
      localStorageUtils.set(STORAGE_KEY, watchlist.value)
    }
  }

  function removeFromWatchlist(stockId) {
    const index = watchlist.value.indexOf(stockId)
    if (index > -1) {
      watchlist.value.splice(index, 1)
      localStorageUtils.set(STORAGE_KEY, watchlist.value)
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
    watchlist.value = localStorageUtils.get(STORAGE_KEY, [])
  }

  function clearWatchlist() {
    watchlist.value = []
    localStorageUtils.remove(STORAGE_KEY)
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

