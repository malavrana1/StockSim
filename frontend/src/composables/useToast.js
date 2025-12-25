import { ref } from 'vue'

const toasts = ref([])

export function useToast() {
  const showToast = (options) => {
    const id = Date.now() + Math.random()
    const toast = {
      id,
      type: options.type || 'info',
      title: options.title || '',
      message: options.message || '',
      duration: options.duration !== undefined ? options.duration : 3000
    }

    toasts.value.push(toast)

    if (toast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration)
    }

    return id
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (title, message = '', duration = 3000) => {
    return showToast({ type: 'success', title, message, duration })
  }

  const error = (title, message = '', duration = 4000) => {
    return showToast({ type: 'error', title, message, duration })
  }

  const warning = (title, message = '', duration = 3000) => {
    return showToast({ type: 'warning', title, message, duration })
  }

  const info = (title, message = '', duration = 3000) => {
    return showToast({ type: 'info', title, message, duration })
  }

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}

