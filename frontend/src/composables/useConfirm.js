import { ref } from 'vue'

const isOpen = ref(false)
const config = ref({
  title: 'Confirm Action',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'warning',
  onConfirm: null,
  onCancel: null
})

export function useConfirm() {
  const showConfirm = (options) => {
    return new Promise((resolve) => {
      config.value = {
        title: options.title || 'Confirm Action',
        message: options.message || '',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        type: options.type || 'warning',
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false)
      }
      isOpen.value = true
    })
  }

  const handleConfirm = () => {
    if (config.value.onConfirm) {
      config.value.onConfirm()
    }
    isOpen.value = false
  }

  const handleCancel = () => {
    if (config.value.onCancel) {
      config.value.onCancel()
    }
    isOpen.value = false
  }

  return {
    isOpen,
    config,
    showConfirm,
    handleConfirm,
    handleCancel
  }
}

