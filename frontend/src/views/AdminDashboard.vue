<template>
  <div class="admin-dashboard">
    <div class="container-fluid">
      <div class="admin-header">
        <h2 class="admin-title">
          <i class="bi bi-shield-check"></i>
          Admin Dashboard
        </h2>
        <div class="admin-badge">
          <i class="bi bi-star-fill"></i>
          Administrator
        </div>
      </div>

      <div class="row">
        <div class="col-md-3 mb-4">
          <div class="admin-card stats-card">
            <div class="card-icon">
              <i class="bi bi-people"></i>
            </div>
            <div class="card-content">
              <div class="card-value">{{ totalUsers }}</div>
              <div class="card-label">Total Users</div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-4">
          <div class="admin-card stats-card">
            <div class="card-icon">
              <i class="bi bi-shield-check"></i>
            </div>
            <div class="card-content">
              <div class="card-value">{{ adminCount }}</div>
              <div class="card-label">Admins</div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-4">
          <div class="admin-card stats-card">
            <div class="card-icon">
              <i class="bi bi-person"></i>
            </div>
            <div class="card-content">
              <div class="card-value">{{ regularUsers }}</div>
              <div class="card-label">Regular Users</div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-4">
          <div class="admin-card stats-card">
            <div class="card-icon">
              <i class="bi bi-graph-up"></i>
            </div>
            <div class="card-content">
              <div class="card-value">{{ totalStocks }}</div>
              <div class="card-label">Total Stocks</div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="admin-card">
            <div class="card-header-admin">
              <h5 class="mb-0">
                <i class="bi bi-people-fill me-2"></i>
                User Management
              </h5>
            </div>
            <div class="card-body-admin">
              <div v-if="loading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted">Loading users...</p>
              </div>

              <div v-else-if="error" class="alert alert-danger">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ error }}
              </div>

              <div v-else class="users-table">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users" :key="user.id">
                      <td>
                        <div class="user-info">
                          <div class="user-avatar">
                            <i class="bi bi-person-circle"></i>
                          </div>
                          <span>{{ user.name || 'User' }}</span>
                        </div>
                      </td>
                      <td>{{ user.email }}</td>
                      <td>
                        <span class="role-badge" :class="user.role === 'admin' ? 'role-admin' : 'role-user'">
                          <i :class="user.role === 'admin' ? 'bi bi-shield-check' : 'bi bi-person'"></i>
                          {{ user.role || 'user' }}
                        </span>
                      </td>
                      <td>
                        <small class="text-muted">
                          {{ formatDate(user.createdAt) }}
                        </small>
                      </td>
                      <td>
                        <div class="action-buttons">
                          <button
                            v-if="user.role !== 'admin'"
                            @click="promoteToAdmin(user.id)"
                            class="btn btn-sm btn-success"
                            :disabled="updating"
                            title="Promote to Admin"
                          >
                            <i class="bi bi-arrow-up-circle"></i>
                          </button>
                          <button
                            v-if="user.role === 'admin' && user.id !== currentUserId"
                            @click="demoteToUser(user.id)"
                            class="btn btn-sm btn-warning"
                            :disabled="updating"
                            title="Remove Admin"
                          >
                            <i class="bi bi-arrow-down-circle"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../store/user'
import { useMarketStore } from '../store/market'
import { getAllUsers, updateUserRole } from '../services/userService'

const userStore = useUserStore()
const marketStore = useMarketStore()

const users = ref([])
const loading = ref(false)
const error = ref('')
const updating = ref(false)

const currentUserId = computed(() => userStore.user?.uid)

const totalUsers = computed(() => users.value.length)
const adminCount = computed(() => users.value.filter(u => u.role === 'admin').length)
const regularUsers = computed(() => users.value.filter(u => u.role !== 'admin').length)
const totalStocks = computed(() => marketStore.activeStocks.length)

const loadUsers = async () => {
  loading.value = true
  error.value = ''
  try {
    users.value = await getAllUsers()
  } catch (err) {
    console.error('Error loading users:', err)
    error.value = 'Failed to load users'
  } finally {
    loading.value = false
  }
}

const promoteToAdmin = async (uid) => {
  const confirmed = await window.showConfirm({
    title: 'Promote to Admin',
    message: 'Are you sure you want to promote this user to admin? They will have full access to the admin dashboard.',
    type: 'warning',
    confirmText: 'Promote',
    cancelText: 'Cancel'
  })
  
  if (!confirmed) return
  
  updating.value = true
  try {
    const success = await updateUserRole(uid, 'admin')
    if (success) {
      await loadUsers()
      if (uid === currentUserId.value) {
        await userStore.refreshRole()
      }
      window.showToast.success('User promoted', 'The user has been successfully promoted to admin.')
    } else {
      window.showToast.error('Failed to update', 'Failed to update user role. Please try again.')
    }
  } catch (err) {
    console.error('Error promoting user:', err)
    window.showToast.error('Error', 'Failed to promote user. Please try again.')
  } finally {
    updating.value = false
  }
}

const demoteToUser = async (uid) => {
  const confirmed = await window.showConfirm({
    title: 'Remove Admin Privileges',
    message: 'Are you sure you want to remove admin privileges from this user? They will lose access to the admin dashboard.',
    type: 'danger',
    confirmText: 'Remove Admin',
    cancelText: 'Cancel'
  })
  
  if (!confirmed) return
  
  updating.value = true
  try {
    const success = await updateUserRole(uid, 'user')
    if (success) {
      await loadUsers()
      if (uid === currentUserId.value) {
        await userStore.refreshRole()
        window.showToast.warning('Admin privileges removed', 'Your admin privileges have been removed. Redirecting...')
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      } else {
        window.showToast.success('User demoted', 'The user has been successfully demoted to regular user.')
      }
    } else {
      window.showToast.error('Failed to update', 'Failed to update user role. Please try again.')
    }
  } catch (err) {
    console.error('Error demoting user:', err)
    window.showToast.error('Error', 'Failed to demote user. Please try again.')
  } finally {
    updating.value = false
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString()
}

onMounted(() => {
  loadUsers()
})
</script>

<style>
@import './AdminDashboard.css';
</style>

