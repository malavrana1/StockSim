import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const defaultInvestmentAmount = ref(10000)
  const currency = ref('USD')
  const refreshInterval = ref(15)
  const theme = ref('light')
  const notifications = ref({
    priceAlerts: true,
    newsUpdates: true,
    marketOpen: true
  })
  const displayPreferences = ref({
    showPercentages: true,
    compactMode: false,
    liveIndicators: true
  })

  const STORAGE_KEY = 'stocksim-settings'

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.defaultInvestmentAmount) defaultInvestmentAmount.value = parsed.defaultInvestmentAmount
        if (parsed.currency) currency.value = parsed.currency
        if (parsed.refreshInterval) refreshInterval.value = parsed.refreshInterval
        if (parsed.theme) theme.value = parsed.theme
        if (parsed.notifications) notifications.value = { ...notifications.value, ...parsed.notifications }
        if (parsed.displayPreferences) displayPreferences.value = { ...displayPreferences.value, ...parsed.displayPreferences }
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  const saveSettings = () => {
    try {
      const settings = {
        defaultInvestmentAmount: defaultInvestmentAmount.value,
        currency: currency.value,
        refreshInterval: refreshInterval.value,
        theme: theme.value,
        notifications: notifications.value,
        displayPreferences: displayPreferences.value
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  const updateDefaultInvestment = (amount) => {
    defaultInvestmentAmount.value = amount
    saveSettings()
  }

  const updateCurrency = (newCurrency) => {
    currency.value = newCurrency
    saveSettings()
  }

  const updateRefreshInterval = (interval) => {
    refreshInterval.value = interval
    saveSettings()
  }

  const updateTheme = (newTheme) => {
    theme.value = newTheme
    saveSettings()
    applyTheme(newTheme)
  }

  const updateNotification = (key, value) => {
    notifications.value[key] = value
    saveSettings()
  }

  const updateDisplayPreference = (key, value) => {
    displayPreferences.value[key] = value
    saveSettings()
  }

  const resetToDefaults = () => {
    defaultInvestmentAmount.value = 10000
    currency.value = 'USD'
    refreshInterval.value = 15
    theme.value = 'light'
    notifications.value = {
      priceAlerts: true,
      newsUpdates: true,
      marketOpen: true
    }
    displayPreferences.value = {
      showPercentages: true,
      compactMode: false,
      liveIndicators: true
    }
    saveSettings()
    applyTheme('light')
  }

  const applyTheme = (themeName) => {
    if (themeName === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }

  loadSettings()
  applyTheme(theme.value)

  return {
    defaultInvestmentAmount,
    currency,
    refreshInterval,
    theme,
    notifications,
    displayPreferences,
    updateDefaultInvestment,
    updateCurrency,
    updateRefreshInterval,
    updateTheme,
    updateNotification,
    updateDisplayPreference,
    resetToDefaults,
    saveSettings
  }
})

