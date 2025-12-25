<script setup>
import './App.css'
import { RouterView, useRouter, useRoute } from 'vue-router'
import { watch } from 'vue'
import { useUserStore } from './store/user'
import { useConfirm } from './composables/useConfirm'
import { useToast } from './composables/useToast'
import ConfirmModal from './components/ConfirmModal.vue'
import ToastNotification from './components/ToastNotification.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const confirmModal = useConfirm()
const toastStore = useToast()

window.showConfirm = confirmModal.showConfirm
window.showToast = toastStore

const isActive = (path) => {
  return route.path === path
}

const handleLogout = async () => {
  try {
    await userStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

watch(() => userStore.isAuthenticated, (isAuth) => {
  if (!isAuth && route.meta.requiresAuth) {
    router.push('/login')
  }
})
</script>

<template>
  <div id="app">
    <div v-if="!userStore.authReady" class="auth-loading">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
    <template v-else>
    <nav v-if="userStore.isAuthenticated" class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link to="/dashboard" class="navbar-brand">
          <i class="bi bi-graph-up-arrow me-2"></i>StockSim
        </router-link>
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li v-if="userStore.isAdmin" class="nav-item">
              <router-link 
                to="/admin" 
                class="nav-link"
                :class="{ active: isActive('/admin') }"
              >
                <i class="bi bi-shield-check me-1"></i>
                Admin
              </router-link>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a 
                class="nav-link dropdown-toggle" 
                href="#" 
                id="navbarDropdown" 
                role="button" 
                data-bs-toggle="dropdown"
              >
                <i class="bi bi-person-circle me-1"></i>
                {{ userStore.displayName }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <router-link to="/settings" class="dropdown-item">
                    <i class="bi bi-gear me-2"></i>
                    Settings
                  </router-link>
                </li>
                <li><a class="dropdown-item" href="#" @click.prevent="handleLogout">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <RouterView />
    <ConfirmModal 
      :is-open="confirmModal.isOpen.value"
      :title="confirmModal.config.value.title"
      :message="confirmModal.config.value.message"
      :confirm-text="confirmModal.config.value.confirmText"
      :cancel-text="confirmModal.config.value.cancelText"
      :type="confirmModal.config.value.type"
      @confirm="confirmModal.handleConfirm"
      @cancel="confirmModal.handleCancel"
      @close="confirmModal.handleCancel"
    />
    <div class="toast-wrapper">
      <ToastNotification
        v-for="toast in toastStore.toasts.value"
        :key="toast.id"
        :type="toast.type"
        :title="toast.title"
        :message="toast.message"
        :duration="toast.duration"
        @close="toastStore.removeToast(toast.id)"
      />
    </div>
    <footer v-if="userStore.isAuthenticated" class="app-footer">
      <div class="container-fluid">
        <div class="footer-content">
          <p class="mb-0">
            &copy; {{ new Date().getFullYear() }} StockSim. All rights reserved.
          </p>
          <p class="mb-0 footer-api-info">
            <small>Stock data powered by Yahoo Finance API. News data from Finnhub & Yahoo Finance.</small>
          </p>
        </div>
      </div>
    </footer>
    </template>
  </div>
</template>
