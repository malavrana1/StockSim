import express from 'express'

const router = express.Router()
let marketService = null

export function setMarketService(service) {
  marketService = service
}

router.get('/', async (req, res) => {
  try {
    if (!marketService) {
      return res.status(503).json({ error: 'Market service not initialized' })
    }
    const stocks = marketService.getAllStocks()
    if (stocks.length === 0) {
      await marketService.initialize()
      const updatedStocks = marketService.getAllStocks()
      return res.json(updatedStocks)
    }
    res.json(stocks)
  } catch (error) {
    console.error('Error fetching stocks:', error)
    res.status(500).json({ error: 'Failed to fetch stocks' })
  }
})

router.get('/:id', (req, res) => {
  try {
    if (!marketService) {
      return res.status(503).json({ error: 'Market service not initialized' })
    }
    const stock = marketService.getStock(parseInt(req.params.id))
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' })
    }
    res.json(stock)
  } catch (error) {
    console.error('Error fetching stock:', error)
    res.status(500).json({ error: 'Failed to fetch stock' })
  }
})

router.get('/symbol/:symbol', async (req, res) => {
  try {
    if (!marketService) {
      return res.status(503).json({ error: 'Market service not initialized' })
    }
    const symbol = req.params.symbol.toUpperCase()
    let stock = marketService.getStockBySymbol(symbol)
    if (!stock) {
      await marketService.refreshStock(symbol)
      stock = marketService.getStockBySymbol(symbol)
    }
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' })
    }
    res.json(stock)
  } catch (error) {
    console.error('Error fetching stock by symbol:', error)
    res.status(500).json({ error: 'Failed to fetch stock' })
  }
})

router.post('/refresh', async (req, res) => {
  try {
    if (!marketService) {
      return res.status(503).json({ error: 'Market service not initialized' })
    }
    const stocks = await marketService.updatePrices(true)
    res.json({ message: 'Stocks refreshed', stocks, count: stocks.length })
  } catch (error) {
    console.error('Error refreshing stocks:', error)
    res.status(500).json({ error: 'Failed to refresh stocks' })
  }
})

export default router

