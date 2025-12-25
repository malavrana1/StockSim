import { onRequest } from 'firebase-functions/v2/https'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let marketService = null
let stockRoutes = null
let userRoutes = null
let newsRoutes = null

async function initializeServices() {
  if (marketService) return

  try {
    const { MarketService } = await import(join(__dirname, '../backend/services/marketService.js'))
    marketService = new MarketService()
    await marketService.initialize()

    const stockModule = await import(join(__dirname, '../backend/routes/stocks.js'))
    stockRoutes = stockModule.default
    const { setMarketService } = stockModule
    if (setMarketService) {
      setMarketService(marketService)
    }

    const userModule = await import(join(__dirname, '../backend/routes/users.js'))
    userRoutes = userModule.default

    const newsModule = await import(join(__dirname, '../backend/routes/news.js'))
    newsRoutes = newsModule.default
  } catch (error) {
    console.error('Error initializing services:', error)
    throw error
  }
}

const app = express()

app.use(cors({
  origin: true,
  credentials: true
}))

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/stocks', async (req, res, next) => {
  try {
    await initializeServices()
    return stockRoutes(req, res, next)
  } catch (error) {
    console.error('Error in stocks route:', error)
    return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
})

app.use('/api/users', async (req, res, next) => {
  try {
    await initializeServices()
    return userRoutes(req, res, next)
  } catch (error) {
    console.error('Error in users route:', error)
    return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
})

app.use('/api/news', async (req, res, next) => {
  try {
    await initializeServices()
    return newsRoutes(req, res, next)
  } catch (error) {
    console.error('Error in news route:', error)
    return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
})

export const api = onRequest({
  region: 'us-central1',
  cors: true,
  timeoutSeconds: 60,
  memory: '512MiB'
}, app)

