import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { localStorageUtils } from '../utils/localStorage'

const STORAGE_KEY = 'savedCalculations'

export const useSavedCalculationsStore = defineStore('savedCalculations', () => {
  const savedCalculations = ref([])

  const savedCount = computed(() => {
    return savedCalculations.value.length
  })

  function saveCalculation(calculation) {
    const savedCalc = {
      id: Date.now(),
      ...calculation,
      createdAt: new Date().toISOString()
    }
    savedCalculations.value.unshift(savedCalc)
    localStorageUtils.set(STORAGE_KEY, savedCalculations.value)
  }

  function removeCalculation(id) {
    const index = savedCalculations.value.findIndex(c => c.id === id)
    if (index > -1) {
      savedCalculations.value.splice(index, 1)
      localStorageUtils.set(STORAGE_KEY, savedCalculations.value)
    }
  }

  function clearAll() {
    savedCalculations.value = []
    localStorageUtils.remove(STORAGE_KEY)
  }

  function loadSavedCalculations() {
    savedCalculations.value = localStorageUtils.get(STORAGE_KEY, [])
  }

  loadSavedCalculations()

  return {
    savedCalculations,
    savedCount,
    saveCalculation,
    removeCalculation,
    clearAll
  }
})

