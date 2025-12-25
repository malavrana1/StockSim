<template>
  <div class="settings-view">
    <div class="settings-container">
      <div class="settings-sidebar">
        <div class="sidebar-header">
          <div class="header-icon">
            <i class="bi bi-gear-fill"></i>
          </div>
          <h2>Settings</h2>
          <p>Customize your experience</p>
        </div>
        <div class="sidebar-nav">
          <button 
            v-for="section in sections" 
            :key="section.id"
            class="nav-item"
            :class="{ active: activeSection === section.id }"
            @click="activeSection = section.id"
          >
            <i :class="section.icon"></i>
            <span>{{ section.name }}</span>
          </button>
        </div>
      </div>

      <div class="settings-main">
        <div class="settings-content">
          <div v-show="activeSection === 'calculator'" class="settings-panel">
            <div class="panel-header">
              <div class="panel-icon">
                <i class="bi bi-calculator"></i>
              </div>
              <div>
                <h3>Calculator Preferences</h3>
                <p>Configure default values for profit calculations</p>
              </div>
            </div>
            <div class="panel-body">
              <div class="setting-card">
                <div class="setting-card-header">
                  <div class="setting-icon">
                    <i class="bi bi-wallet2"></i>
                  </div>
                  <div class="setting-info">
                    <h4>Default Investment Amount</h4>
                    <p>Default amount used in profit calculator</p>
                  </div>
                </div>
                <div class="setting-card-body">
                  <div class="modern-input-wrapper">
                    <span class="currency-prefix">$</span>
                    <input 
                      type="number" 
                      class="modern-input"
                      v-model.number="localSettings.defaultInvestmentAmount"
                      :min="100"
                      :step="100"
                      @change="updateDefaultInvestment"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-show="activeSection === 'refresh'" class="settings-panel">
            <div class="panel-header">
              <div class="panel-icon">
                <i class="bi bi-arrow-repeat"></i>
              </div>
              <div>
                <h3>Data Refresh</h3>
                <p>Control how often stock data is updated</p>
              </div>
            </div>
            <div class="panel-body">
              <div class="setting-card">
                <div class="setting-card-header">
                  <div class="setting-icon">
                    <i class="bi bi-clock"></i>
                  </div>
                  <div class="setting-info">
                    <h4>Refresh Interval</h4>
                    <p>How often stock prices are updated</p>
                  </div>
                </div>
                <div class="setting-card-body">
                  <div class="modern-select-wrapper">
                    <select 
                      class="modern-select"
                      v-model.number="localSettings.refreshInterval"
                      @change="updateRefreshInterval"
                    >
                      <option :value="5">5 seconds</option>
                      <option :value="10">10 seconds</option>
                      <option :value="15">15 seconds</option>
                      <option :value="30">30 seconds</option>
                      <option :value="60">1 minute</option>
                    </select>
                    <i class="bi bi-chevron-down select-arrow"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-show="activeSection === 'appearance'" class="settings-panel">
            <div class="panel-header">
              <div class="panel-icon">
                <i class="bi bi-palette"></i>
              </div>
              <div>
                <h3>Appearance</h3>
                <p>Customize the look and feel of the application</p>
              </div>
            </div>
            <div class="panel-body">
              <div class="setting-card">
                <div class="setting-card-header">
                  <div class="setting-icon">
                    <i class="bi bi-brightness-high"></i>
                  </div>
                  <div class="setting-info">
                    <h4>Theme</h4>
                    <p>Choose your preferred color theme</p>
                  </div>
                </div>
                <div class="setting-card-body">
                  <div class="theme-selector">
                    <button 
                      class="theme-option"
                      :class="{ active: localSettings.theme === 'light' }"
                      @click="localSettings.theme = 'light'; updateTheme()"
                    >
                      <i class="bi bi-sun"></i>
                      <span>Light</span>
                    </button>
                    <button 
                      class="theme-option"
                      :class="{ active: localSettings.theme === 'dark' }"
                      @click="localSettings.theme = 'dark'; updateTheme()"
                    >
                      <i class="bi bi-moon"></i>
                      <span>Dark</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-show="activeSection === 'notifications'" class="settings-panel">
            <div class="panel-header">
              <div class="panel-icon">
                <i class="bi bi-bell"></i>
              </div>
              <div>
                <h3>Notifications</h3>
                <p>Manage your notification preferences</p>
              </div>
            </div>
            <div class="panel-body">
              <div class="toggle-card">
                <div class="toggle-header">
                  <div class="toggle-icon">
                    <i class="bi bi-bullseye"></i>
                  </div>
                  <div class="toggle-info">
                    <h4>Price Alerts</h4>
                    <p>Get notified when stocks reach target prices</p>
                  </div>
                </div>
                <label class="modern-switch">
                  <input 
                    type="checkbox"
                    v-model="localSettings.notifications.priceAlerts"
                    @change="updateNotification('priceAlerts', $event.target.checked)"
                  />
                  <span class="switch-slider"></span>
                </label>
              </div>

              <div class="toggle-card">
                <div class="toggle-header">
                  <div class="toggle-icon">
                    <i class="bi bi-newspaper"></i>
                  </div>
                  <div class="toggle-info">
                    <h4>News Updates</h4>
                    <p>Receive notifications for important market news</p>
                  </div>
                </div>
                <label class="modern-switch">
                  <input 
                    type="checkbox"
                    v-model="localSettings.notifications.newsUpdates"
                    @change="updateNotification('newsUpdates', $event.target.checked)"
                  />
                  <span class="switch-slider"></span>
                </label>
              </div>

              <div class="toggle-card">
                <div class="toggle-header">
                  <div class="toggle-icon">
                    <i class="bi bi-graph-up"></i>
                  </div>
                  <div class="toggle-info">
                    <h4>Market Status</h4>
                    <p>Notifications when market opens or closes</p>
                  </div>
                </div>
                <label class="modern-switch">
                  <input 
                    type="checkbox"
                    v-model="localSettings.notifications.marketOpen"
                    @change="updateNotification('marketOpen', $event.target.checked)"
                  />
                  <span class="switch-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div v-show="activeSection === 'display'" class="settings-panel">
            <div class="panel-header">
              <div class="panel-icon">
                <i class="bi bi-eye"></i>
              </div>
              <div>
                <h3>Display Preferences</h3>
                <p>Customize how information is displayed</p>
              </div>
            </div>
            <div class="panel-body">
              <div class="toggle-card">
                <div class="toggle-header">
                  <div class="toggle-icon">
                    <i class="bi bi-percent"></i>
                  </div>
                  <div class="toggle-info">
                    <h4>Show Percentages</h4>
                    <p>Display percentage changes alongside dollar amounts</p>
                  </div>
                </div>
                <label class="modern-switch">
                  <input 
                    type="checkbox"
                    v-model="localSettings.displayPreferences.showPercentages"
                    @change="updateDisplayPreference('showPercentages', $event.target.checked)"
                  />
                  <span class="switch-slider"></span>
                </label>
              </div>

              <div class="toggle-card">
                <div class="toggle-header">
                  <div class="toggle-icon">
                    <i class="bi bi-layout-compact"></i>
                  </div>
                  <div class="toggle-info">
                    <h4>Compact Mode</h4>
                    <p>Use a more compact layout for better space utilization</p>
                  </div>
                </div>
                <label class="modern-switch">
                  <input 
                    type="checkbox"
                    v-model="localSettings.displayPreferences.compactMode"
                    @change="updateDisplayPreference('compactMode', $event.target.checked)"
                  />
                  <span class="switch-slider"></span>
                </label>
              </div>

              <div class="toggle-card">
                <div class="toggle-header">
                  <div class="toggle-icon">
                    <i class="bi bi-circle-fill"></i>
                  </div>
                  <div class="toggle-info">
                    <h4>Live Indicators</h4>
                    <p>Show live price update indicators</p>
                  </div>
                </div>
                <label class="modern-switch">
                  <input 
                    type="checkbox"
                    v-model="localSettings.displayPreferences.liveIndicators"
                    @change="updateDisplayPreference('liveIndicators', $event.target.checked)"
                  />
                  <span class="switch-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div class="settings-footer">
            <button 
              class="btn-reset"
              @click="resetSettings"
            >
              <i class="bi bi-arrow-counterclockwise"></i>
              Reset to Defaults
            </button>
            <button 
              class="btn-save"
              @click="saveAllSettings"
            >
              <i class="bi bi-check-circle"></i>
              Save All Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '../store/settings'
import { useConfirm } from '../composables/useConfirm'
import { useToast } from '../composables/useToast'
import './SettingsView.css'

const settingsStore = useSettingsStore()
const confirmModal = useConfirm()
const toast = useToast()
const activeSection = ref('calculator')

const sections = [
  { id: 'calculator', name: 'Calculator', icon: 'bi bi-calculator' },
  { id: 'refresh', name: 'Data Refresh', icon: 'bi bi-arrow-repeat' },
  { id: 'appearance', name: 'Appearance', icon: 'bi bi-palette' },
  { id: 'notifications', name: 'Notifications', icon: 'bi bi-bell' },
  { id: 'display', name: 'Display', icon: 'bi bi-eye' }
]

const localSettings = ref({
  defaultInvestmentAmount: settingsStore.defaultInvestmentAmount,
  currency: settingsStore.currency,
  refreshInterval: settingsStore.refreshInterval,
  theme: settingsStore.theme,
  notifications: { ...settingsStore.notifications },
  displayPreferences: { ...settingsStore.displayPreferences }
})

const updateDefaultInvestment = () => {
  settingsStore.updateDefaultInvestment(localSettings.value.defaultInvestmentAmount)
}

const updateRefreshInterval = () => {
  settingsStore.updateRefreshInterval(localSettings.value.refreshInterval)
}

const updateTheme = () => {
  settingsStore.updateTheme(localSettings.value.theme)
}

const updateNotification = (key, value) => {
  settingsStore.updateNotification(key, value)
}

const updateDisplayPreference = (key, value) => {
  settingsStore.updateDisplayPreference(key, value)
}

const resetSettings = async () => {
  const confirmed = await confirmModal.showConfirm({
    title: 'Reset Settings',
    message: 'Are you sure you want to reset all settings to their default values? This action cannot be undone.',
    type: 'warning',
    confirmText: 'Reset',
    cancelText: 'Cancel'
  })
  
  if (confirmed) {
    settingsStore.resetToDefaults()
    localSettings.value = {
      defaultInvestmentAmount: settingsStore.defaultInvestmentAmount,
      currency: settingsStore.currency,
      refreshInterval: settingsStore.refreshInterval,
      theme: settingsStore.theme,
      notifications: { ...settingsStore.notifications },
      displayPreferences: { ...settingsStore.displayPreferences }
    }
    toast.success('Settings reset', 'All settings have been reset to their default values.')
  }
}

const saveAllSettings = () => {
  settingsStore.saveSettings()
  toast.success('Settings saved', 'All your settings have been saved successfully.')
}

onMounted(() => {
  localSettings.value = {
    defaultInvestmentAmount: settingsStore.defaultInvestmentAmount,
    currency: settingsStore.currency,
    refreshInterval: settingsStore.refreshInterval,
    theme: settingsStore.theme,
    notifications: { ...settingsStore.notifications },
    displayPreferences: { ...settingsStore.displayPreferences }
  }
})
</script>

