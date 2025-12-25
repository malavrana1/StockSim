<template>
  <div class="saved-calculations">
    <div class="card">
      <div class="card-header">
        <h6 class="mb-0 small fw-bold">
          <i class="bi bi-bookmark-check me-1"></i>
          Saved
          <span class="badge bg-light text-dark ms-1">{{ savedCalculationsStore.savedCount }}</span>
        </h6>
        <button 
          v-if="savedCalculationsStore.savedCount > 0"
          class="btn btn-sm btn-outline-light btn-sm"
          @click="clearAll"
          title="Clear all"
        >
          <i class="bi bi-trash"></i>
        </button>
      </div>
      <div class="card-body">
        <div v-if="savedCalculationsStore.savedCount === 0" class="empty-state">
          <i class="bi bi-bookmark display-6 text-muted"></i>
          <p class="text-muted mt-3">No saved calculations yet</p>
          <p class="text-muted small">Save your profit calculations from the calculator</p>
        </div>
        
        <div v-else class="calculations-list">
          <div 
            v-for="calc in savedCalculationsStore.savedCalculations" 
            :key="calc.id"
            class="calculation-item"
            @click="emit('load-calculation', calc)"
            style="cursor: pointer;"
          >
            <div class="calc-header">
              <div class="calc-stock-info">
                <h6 class="calc-symbol mb-0">
                  {{ calc.displaySymbol || calc.symbol }}
                </h6>
                <small class="text-muted">{{ calc.stockName }}</small>
              </div>
              <button 
                class="btn btn-sm btn-link text-danger p-0"
                @click="removeCalculation(calc.id, $event)"
                title="Remove"
              >
                <i class="bi bi-x-circle"></i>
              </button>
            </div>
            
            <div class="calc-details">
              <div class="calc-row">
                <span class="calc-label">Investment:</span>
                <span class="calc-value">${{ calc.investmentAmount.toLocaleString() }}</span>
              </div>
              <div class="calc-row">
                <span class="calc-label">Purchase Price:</span>
                <span class="calc-value">${{ calc.purchasePrice.toFixed(2) }}</span>
              </div>
              <div class="calc-row">
                <span class="calc-label">Target Price:</span>
                <span class="calc-value">${{ calc.targetPrice.toFixed(2) }}</span>
              </div>
              <div class="calc-row">
                <span class="calc-label">Shares:</span>
                <span class="calc-value">{{ calc.shares.toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 0 }) }}</span>
              </div>
            </div>
            
            <div class="calc-profit" :class="calc.profit >= 0 ? 'profit-positive' : 'profit-negative'">
              <div class="calc-profit-label">Profit / Loss</div>
              <div class="calc-profit-value">
                {{ calc.profit >= 0 ? '+' : '' }}${{ calc.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </div>
              <div class="calc-profit-percent">
                {{ calc.profitPercent >= 0 ? '+' : '' }}{{ calc.profitPercent.toFixed(2) }}%
              </div>
            </div>
            
            <div class="calc-footer">
              <small class="text-muted">
                <i class="bi bi-clock"></i>
                {{ formatTime(calc.createdAt) }}
              </small>
              <small class="text-muted" v-if="calc.currentPrice">
                Current: ${{ calc.currentPrice.toFixed(2) }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSavedCalculationsStore } from '../store/savedCalculations'
import { useConfirm } from '../composables/useConfirm'
import { useToast } from '../composables/useToast'
import { formatTime } from '../utils/helpers'
import './SavedCalculations.css'

const emit = defineEmits(['load-calculation'])

const savedCalculationsStore = useSavedCalculationsStore()
const confirmModal = useConfirm()
const toast = useToast()

const removeCalculation = async (id, event) => {
  event.stopPropagation()
  const confirmed = await confirmModal.showConfirm({
    title: 'Remove Calculation',
    message: 'Are you sure you want to remove this calculation? This action cannot be undone.',
    type: 'warning',
    confirmText: 'Remove',
    cancelText: 'Cancel'
  })
  
  if (confirmed) {
    savedCalculationsStore.removeCalculation(id)
    toast.success('Calculation removed', 'The calculation has been successfully removed.')
  }
}

const clearAll = async () => {
  const confirmed = await confirmModal.showConfirm({
    title: 'Clear All Calculations',
    message: 'Are you sure you want to clear all saved calculations? This action cannot be undone.',
    type: 'danger',
    confirmText: 'Clear All',
    cancelText: 'Cancel'
  })
  
  if (confirmed) {
    savedCalculationsStore.clearAll()
    toast.success('All calculations cleared', 'All saved calculations have been removed.')
  }
}

</script>

