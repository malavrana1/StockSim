import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'
import App from './App.vue'
import router from './router'
import pinia from './store'
import { useUserStore } from './store/user'
import { useSettingsStore } from './store/settings'

const app = createApp(App)

app.use(pinia)
app.use(router)

const userStore = useUserStore()
const settingsStore = useSettingsStore()

userStore.initAuth()

app.mount('#app')

