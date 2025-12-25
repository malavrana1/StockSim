import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'

import stockRoutes, { setMarketService } from './routes/stocks.js'
import userRoutes from './routes/users.js'
import newsRoutes from './routes/news.js'
import { MarketService } from './services/marketService.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

app.use(cors())
app.use(express.json())

app.use('/api/stocks', stockRoutes)
app.use('/api/users', userRoutes)
app.use('/api/news', newsRoutes)

const marketService = new MarketService()
setMarketService(marketService)

marketService.initialize().then(() => {
  console.log('Market service initialized')
}).catch(err => {
  console.error('Failed to initialize market service:', err)
})

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

setInterval(async () => {
  try {
    const updatedStocks = await marketService.updatePrices()
    if (updatedStocks && updatedStocks.length > 0) {
      io.emit('market:update', { stocks: updatedStocks })
      updatedStocks.forEach(stock => {
        io.emit('stock:price-update', {
          stockId: stock.id,
          symbol: stock.symbol,
          price: stock.price,
          change: stock.change,
          changePercent: stock.changePercent,
          volume: stock.volume,
          high: stock.high,
          low: stock.low
        })
      })
      console.log(`Updated ${updatedStocks.length} stock prices`)
    }
  } catch (error) {
    console.error('Error updating stock prices:', error)
  }
}, 15000)

const PORT = process.env.PORT || 3000

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`WebSocket server ready`)
})

