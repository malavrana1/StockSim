<template>
  <div 
    class="modal fade" 
    :class="{ show: isOpen, 'd-block': isOpen }" 
    tabindex="-1"
    @click.self="close"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ tradeType === 'buy' ? 'Buy' : 'Sell' }} {{ stock?.symbol }}
          </h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div v-if="stock" class="mb-3">
            <p class="mb-1"><strong>Current Price:</strong> ${{ stock.price.toFixed(2) }}</p>
            <p class="mb-1"><strong>Available Balance:</strong> ${{ portfolioStore.balance.toFixed(2) }}</p>
            <p v-if="tradeType === 'sell' && holding" class="mb-1">
              <strong>Shares Owned:</strong> {{ holding.quantity }}
            </p>
          </div>

          <div class="mb-3">
            <label for="quantity" class="form-label">Quantity</label>
            <input 
              type="number" 
              class="form-control" 
              id="quantity"
              v-model.number="quantity"
              :min="1"
              :max="tradeType === 'buy' ? maxBuyable : (holding?.quantity || 0)"
              @input="calculateTotal"
            />
          </div>

          <div class="mb-3">
            <label for="price" class="form-label">Price per Share</label>
            <input 
              type="number" 
              class="form-control" 
              id="price"
              v-model.number="price"
              :min="0.01"
              step="0.01"
              @input="calculateTotal"
            />
          </div>

          <div class="alert alert-info">
            <strong>Total:</strong> ${{ total.toFixed(2) }}
            <span v-if="tradeType === 'buy' && total > portfolioStore.balance" class="text-danger">
              (Insufficient funds)
            </span>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">Cancel</button>
          <button 
            type="button" 
            class="btn"
            :class="tradeType === 'buy' ? 'btn-success' : 'btn-danger'"
            @click="executeTrade"
            :disabled="!canExecute"
          >
            {{ tradeType === 'buy' ? 'Buy' : 'Sell' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="isOpen" class="modal-backdrop fade show" @click="close"></div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { usePortfolioStore } from '../store/portfolio'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Object,
    default: null
  },
  tradeType: {
    type: String,
    default: 'buy'
  }
})

const emit = defineEmits(['close', 'trade'])

const portfolioStore = usePortfolioStore()
const quantity = ref(1)
const price = ref(0)
const total = ref(0)

const holding = computed(() => {
  if (!props.stock) return null
  return portfolioStore.holdings.find(h => h.stockId === props.stock.id)
})

const maxBuyable = computed(() => {
  if (!props.stock || price.value <= 0) return 0
  return Math.floor(portfolioStore.balance / price.value)
})

const canExecute = computed(() => {
  if (!props.stock || quantity.value <= 0 || price.value <= 0) return false
  if (props.tradeType === 'buy') {
    return total.value <= portfolioStore.balance
  } else {
    return holding.value && quantity.value <= holding.value.quantity
  }
})

watch(() => props.stock, (newStock) => {
  if (newStock) {
    price.value = newStock.price
    quantity.value = 1
    calculateTotal()
  }
}, { immediate: true })

const calculateTotal = () => {
  total.value = quantity.value * price.value
}

const executeTrade = () => {
  if (!canExecute.value) return

  const trade = {
    stockId: props.stock.id,
    symbol: props.stock.symbol,
    type: props.tradeType,
    quantity: quantity.value,
    price: price.value
  }

  emit('trade', trade)
  close()
}

const close = () => {
  emit('close')
  quantity.value = 1
  price.value = 0
  total.value = 0
}
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>

