import { StockApiService } from './stockApiService.js'

export class MarketService {
  constructor() {
    this.stockApiService = new StockApiService()
    this.stocks = []
    this.lastUpdate = null
    this.updateInterval = 15000
  }

  async initialize() {
    try {
      console.log('Fetching initial stock data from API...')
      this.stocks = await this.stockApiService.getAllStocks()
      this.lastUpdate = Date.now()
      console.log(`Loaded ${this.stocks.length} stocks from API`)
      return this.stocks
    } catch (error) {
      console.error('Error initializing stocks:', error)
      this.stocks = []
      return []
    }
  }

  async updatePrices(forceRefresh = false) {
    const now = Date.now()
    
    if (!forceRefresh && this.lastUpdate && (now - this.lastUpdate) < this.updateInterval) {
      return this.stocks
    }

    try {
      console.log('Updating stock prices from API...')
      if (forceRefresh) {
        this.stockApiService.clearCache()
      }
      
      const updatedStocks = await this.stockApiService.getAllStocks()
      
      if (!updatedStocks || updatedStocks.length === 0) {
        console.warn('No stocks returned from API update')
        return this.stocks
      }
      
      this.stocks = updatedStocks.map((updatedStock, index) => {
        const existingStock = this.stocks.find(s => s.symbol === updatedStock.symbol)
        return {
          ...updatedStock,
          id: existingStock ? existingStock.id : index + 1
        }
      })
      
      this.lastUpdate = now
      console.log(`Successfully updated ${this.stocks.length} stocks`)
      return this.stocks
    } catch (error) {
      console.error('Error updating stock prices:', error)
      return this.stocks
    }
  }

  getStock(id) {
    return this.stocks.find(s => s.id === id)
  }

  getStockBySymbol(symbol) {
    return this.stocks.find(s => s.symbol === symbol)
  }

  getAllStocks() {
    return this.stocks
  }

  async refreshStock(symbol) {
    try {
      const quote = await this.stockApiService.getQuote(symbol)
      if (quote) {
        const stock = this.stocks.find(s => s.symbol === symbol)
        if (stock) {
          stock.price = quote.price
          stock.change = quote.change
          stock.changePercent = parseFloat(quote.changePercent.toFixed(2))
          stock.volume = quote.volume
          stock.high = quote.high
          stock.low = quote.low
          stock.open = quote.open
          stock.previousClose = quote.previousClose
        }
        return stock
      }
    } catch (error) {
      console.error(`Error refreshing stock ${symbol}:`, error)
    }
    return null
  }
}

