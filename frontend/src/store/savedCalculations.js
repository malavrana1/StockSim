import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
    localStorage.setItem('savedCalculations', JSON.stringify(savedCalculations.value))
  }

  function removeCalculation(id) {
    const index = savedCalculations.value.findIndex(c => c.id === id)
    if (index > -1) {
      savedCalculations.value.splice(index, 1)
      localStorage.setItem('savedCalculations', JSON.stringify(savedCalculations.value))
    }
  }

  function clearAll() {
    savedCalculations.value = []
    localStorage.removeItem('savedCalculations')
  }

  function loadSavedCalculations() {
    const saved = localStorage.getItem('savedCalculations')
    if (saved) {
      try {
        savedCalculations.value = JSON.parse(saved)
      } catch (e) {
        console.error('Error loading saved calculations:', e)
        savedCalculations.value = []
      }
    }
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

