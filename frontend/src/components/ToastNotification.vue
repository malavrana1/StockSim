<template>
  <Transition name="toast">
    <div v-if="isVisible" class="toast-container" :class="toastClass">
      <div class="toast-icon">
        <i :class="icon"></i>
      </div>
      <div class="toast-content">
        <div class="toast-title">{{ title }}</div>
        <div class="toast-message" v-if="message">{{ message }}</div>
      </div>
      <button class="toast-close" @click="close">
        <i class="bi bi-x"></i>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import './ToastNotification.css'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const emit = defineEmits(['close'])

const isVisible = ref(false)

const toastClass = computed(() => `toast-${props.type}`)

const icon = computed(() => {
  const icons = {
    success: 'bi bi-check-circle-fill',
    error: 'bi bi-x-circle-fill',
    warning: 'bi bi-exclamation-triangle-fill',
    info: 'bi bi-info-circle-fill'
  }
  return icons[props.type] || icons.info
})

const close = () => {
  isVisible.value = false
  setTimeout(() => emit('close'), 300)
}

onMounted(() => {
  isVisible.value = true
  if (props.duration > 0) {
    setTimeout(() => close(), props.duration)
  }
})
</script>

