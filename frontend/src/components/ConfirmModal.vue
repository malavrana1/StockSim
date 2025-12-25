<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="handleCancel">
    <div class="modal-container">
      <div class="modal-header">
        <div class="modal-icon" :class="iconClass">
          <i :class="icon"></i>
        </div>
        <h5 class="modal-title">{{ title }}</h5>
        <button class="modal-close" @click="handleCancel">
          <i class="bi bi-x"></i>
        </button>
      </div>
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>
      <div class="modal-footer">
        <button class="btn-cancel" @click="handleCancel">
          {{ cancelText }}
        </button>
        <button class="btn-confirm" :class="confirmClass" @click="handleConfirm">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import './ConfirmModal.css'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  type: {
    type: String,
    default: 'warning',
    validator: (value) => ['warning', 'danger', 'info', 'success'].includes(value)
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

const iconClass = computed(() => `icon-${props.type}`)

const icon = computed(() => {
  const icons = {
    warning: 'bi bi-exclamation-triangle',
    danger: 'bi bi-exclamation-circle',
    info: 'bi bi-info-circle',
    success: 'bi bi-check-circle'
  }
  return icons[props.type] || icons.warning
})

const confirmClass = computed(() => {
  const classes = {
    warning: 'btn-warning',
    danger: 'btn-danger',
    info: 'btn-info',
    success: 'btn-success'
  }
  return classes[props.type] || classes.warning
})

const handleConfirm = () => {
  emit('confirm')
  emit('close')
}

const handleCancel = () => {
  emit('cancel')
  emit('close')
}
</script>

