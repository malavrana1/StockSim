import axios from 'axios'

export class StockApiService {
  constructor() {
    this.yahooFinanceUrl = 'https://query1.finance.yahoo.com/v8/finance/chart'
    this.yahooSearchUrl = 'https://query1.finance.yahoo.com/v1/finance/search'
    this.finnhubKey = process.env.FINNHUB_API_KEY || ''
    this.finnhubBaseUrl = 'https://finnhub.io/api/v1'
    this.cryptoSymbols = [
      'BTC-USD', 'ETH-USD', 'BNB-USD', 'ADA-USD', 'SOL-USD',
      'XRP-USD', 'DOT-USD', 'DOGE-USD', 'MATIC-USD', 'AVAX-USD',
      'LINK-USD', 'UNI-USD', 'LTC-USD', 'ATOM-USD', 'ALGO-USD',
      'SHIB-USD', 'ETC-USD', 'HBAR-USD'
    ]
    this.priorityStocks = [
      'DOGE-USD', 'XRP-USD', 'SHIB-USD', 'HBAR-USD', 'ETC-USD', 
      'ADA-USD', 'BTC-USD', 'BB'
    ]
    this.cache = new Map()
    this.cacheTimeout = 10000
    this.stockSymbolsCache = null
    this.stockSymbolsCacheTime = null
    this.cacheTimeoutStocks = 3600000
  }

  async getYahooFinanceQuote(symbol) {
    try {
      const url = `${this.yahooFinanceUrl}/${symbol}`
      const params = {
        interval: '1d',
        range: '1d'
      }

      const response = await axios.get(url, { 
        params, 
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      
      if (response.data?.chart?.result?.[0]) {
        const result = response.data.chart.result[0]
        const meta = result.meta
        
        if (meta && meta.regularMarketPrice !== undefined && meta.regularMarketPrice !== null) {
          const currentPrice = meta.regularMarketPrice
          const previousClose = meta.previousClose || meta.chartPreviousClose || currentPrice
          const change = currentPrice - previousClose
          const changePercent = previousClose > 0 ? ((change / previousClose) * 100) : 0
          
          return {
            symbol: meta.symbol || symbol,
            price: currentPrice,
            change: change,
            changePercent: changePercent,
            volume: meta.regularMarketVolume || 0,
            high: meta.regularMarketDayHigh || meta.regularMarketPrice || currentPrice,
            low: meta.regularMarketDayLow || meta.regularMarketPrice || currentPrice,
            open: meta.regularMarketOpen || meta.regularMarketPrice || currentPrice,
            previousClose: previousClose
          }
        } else {
          console.warn(`Yahoo Finance: No price data for ${symbol}`)
        }
      } else {
        console.warn(`Yahoo Finance: Invalid response structure for ${symbol}`)
      }
      return null
    } catch (error) {
      if (error.response) {
        console.error(`Yahoo Finance error for ${symbol}: ${error.response.status} - ${error.response.statusText}`)
      } else if (error.request) {
        console.error(`Yahoo Finance error for ${symbol}: No response received`)
      } else {
        console.error(`Yahoo Finance error for ${symbol}:`, error.message)
      }
      return null
    }
  }

  async getCryptoQuote(symbol) {
    if (!this.finnhubKey) return null
    
    try {
      const finnhubSymbol = symbol.replace('-USD', 'USDT')
      const url = `${this.finnhubBaseUrl}/quote`
      const params = {
        symbol: `BINANCE:${finnhubSymbol}`,
        token: this.finnhubKey
      }

      const response = await axios.get(url, { params, timeout: 5000 })
      
      if (response.data && response.data.c) {
        const data = response.data
        const change = data.c - data.pc
        const changePercent = ((change / data.pc) * 100)
        
        return {
          symbol: symbol,
          price: data.c,
          change: change,
          changePercent: changePercent,
          volume: data.v || 0,
          high: data.h,
          low: data.l,
          open: data.o,
          previousClose: data.pc
        }
      }
      return null
    } catch (error) {
      console.error(`Finnhub crypto error for ${symbol}:`, error.message)
      return null
    }
  }

  isCrypto(symbol) {
    return symbol.includes('-USD') && this.cryptoSymbols.includes(symbol)
  }

  async getQuote(symbol, forceRefresh = false) {
    if (!forceRefresh) {
      const cacheKey = `quote_${symbol}`
      const cached = this.cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data
      }
    }

    let quote = null

    if (this.isCrypto(symbol)) {
      quote = await this.getCryptoQuote(symbol)
      if (!quote) {
        quote = await this.getYahooFinanceQuote(symbol)
      }
    } else {
      quote = await this.getYahooFinanceQuote(symbol)
    }

    if (quote) {
      const cacheKey = `quote_${symbol}`
      this.cache.set(cacheKey, {
        data: quote,
        timestamp: Date.now()
      })
    }

    return quote
  }

  async getMultipleQuotes(symbols) {
    const quotes = []
    const errors = []
    const batchSize = 10
    const delayBetweenBatches = 200
    
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize)
      const batchPromises = batch.map(async (symbol) => {
        try {
          const quote = await this.getQuote(symbol)
          if (quote) {
            return { success: true, quote, symbol }
          } else {
            return { success: false, symbol }
          }
        } catch (error) {
          return { success: false, symbol, error: error.message }
        }
      })
      
      const batchResults = await Promise.all(batchPromises)
      
      batchResults.forEach(result => {
        if (result.success) {
          quotes.push(result.quote)
        } else {
          errors.push(result.symbol)
        }
      })
      
      if (i + batchSize < symbols.length) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches))
      }
    }
    
    return quotes
  }

  async fetchPopularStocksFromYahoo() {
    try {
      const searchTerms = [
        'most active stocks',
        'trending stocks',
        'popular stocks',
        'top stocks',
        'S&P 500',
        'NASDAQ 100',
        'Dow Jones'
      ]
      
      const allSymbols = new Set()
      const symbolToName = new Map()
      
      for (const term of searchTerms) {
        try {
          const response = await axios.get(this.yahooSearchUrl, {
            params: {
              q: term,
              quotesCount: 50,
              newsCount: 0
            },
            timeout: 10000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          })
          
          if (response.data?.quotes) {
            response.data.quotes.forEach(quote => {
              if (quote.symbol && !quote.symbol.includes('.') && !quote.symbol.includes('^')) {
                allSymbols.add(quote.symbol)
                if (quote.longname || quote.shortname) {
                  symbolToName.set(quote.symbol, quote.longname || quote.shortname)
                }
              }
            })
          }
          
          await new Promise(resolve => setTimeout(resolve, 300))
        } catch (error) {
          console.error(`Error fetching stocks for term "${term}":`, error.message)
        }
      }
      
      const majorStocks = [
        'BB',
        'AAPL', 'GOOGL', 'GOOG', 'MSFT', 'AMZN', 'META', 'TSLA', 'NVDA', 'NFLX', 'AMD',
        'INTC', 'CRM', 'ORCL', 'ADBE', 'CSCO', 'AVGO', 'TXN', 'QCOM', 'MU', 'AMAT',
        'JPM', 'BAC', 'WFC', 'C', 'GS', 'MS', 'BLK', 'SCHW', 'COF', 'AXP',
        'JNJ', 'PFE', 'UNH', 'ABBV', 'TMO', 'ABT', 'DHR', 'BMY', 'AMGN', 'GILD',
        'XOM', 'CVX', 'COP', 'SLB', 'EOG', 'MPC', 'VLO', 'PSX', 'HAL', 'FANG',
        'WMT', 'HD', 'MCD', 'NKE', 'SBUX', 'TGT', 'LOW', 'TJX', 'COST', 'DG',
        'BA', 'CAT', 'GE', 'HON', 'RTX', 'LMT', 'NOC', 'GD', 'TDG', 'TXT',
        'V', 'MA', 'PYPL', 'SQ', 'FIS', 'FISV', 'GPN', 'FLT', 'WU', 'AFRM',
        'DIS', 'CMCSA', 'FOXA', 'VIAC', 'PARA', 'WBD', 'ROKU', 'SPOT', 'LYV',
        'PG', 'KO', 'PEP', 'CL', 'EL', 'CHD', 'CLX', 'KMB', 'HRL', 'CPB',
        'VZ', 'T', 'TMUS', 'LUMN', 'SPY', 'QQQ', 'DIA', 'IWM', 'VTI', 'VOO',
        'UBER', 'LYFT', 'DASH', 'ABNB', 'BKNG', 'EXPE', 'RBLX', 'EA', 'TTWO', 'ATVI',
        'PLTR', 'SNOW', 'DDOG', 'NET', 'ZS', 'CRWD', 'S', 'OKTA', 'FTNT', 'PANW',
        'SHOP', 'W', 'ETSY', 'EBAY', 'MELI', 'ZM', 'TEAM', 'RIVN', 'LCID', 'F',
        'GM', 'NIO', 'XPEV', 'LI'
      ]
      
      this.priorityStocks.forEach(symbol => allSymbols.add(symbol))
      majorStocks.forEach(symbol => allSymbols.add(symbol))
      
      this.symbolToNameCache = symbolToName
      
      return Array.from(allSymbols)
    } catch (error) {
      console.error('Error fetching popular stocks from Yahoo:', error)
      return []
    }
  }

  async getStockSymbols() {
    const now = Date.now()
    
    if (this.stockSymbolsCache && this.stockSymbolsCacheTime && 
        (now - this.stockSymbolsCacheTime) < this.cacheTimeoutStocks) {
      return this.stockSymbolsCache
    }
    
    const symbols = await this.fetchPopularStocksFromYahoo()
    this.stockSymbolsCache = symbols
    this.stockSymbolsCacheTime = now
    
    return symbols
  }

  async getAllStocks() {
    const stockSymbols = await this.getStockSymbols()
    const allSymbols = [...stockSymbols, ...this.cryptoSymbols]
    const quotes = await this.getMultipleQuotes(allSymbols)
    
    const getSector = (symbol) => {
      if (this.cryptoSymbols.includes(symbol)) return 'Crypto'
      const techKeywords = ['AAPL', 'GOOGL', 'GOOG', 'MSFT', 'META', 'NVDA', 'AMD', 'INTC', 'CRM', 'ORCL', 'ADBE', 'CSCO', 'AVGO', 'TXN', 'QCOM', 'MU', 'AMAT', 'UBER', 'LYFT', 'DASH', 'RBLX', 'EA', 'TTWO', 'ATVI', 'PLTR', 'SNOW', 'DDOG', 'NET', 'ZS', 'CRWD', 'SHOP', 'ZM', 'TEAM']
      const financeKeywords = ['JPM', 'BAC', 'WFC', 'C', 'GS', 'MS', 'BLK', 'SCHW', 'COF', 'AXP', 'V', 'MA', 'PYPL', 'SQ', 'FIS', 'FISV']
      const healthcareKeywords = ['JNJ', 'PFE', 'UNH', 'ABBV', 'TMO', 'ABT', 'DHR', 'BMY', 'AMGN', 'GILD']
      const energyKeywords = ['XOM', 'CVX', 'COP', 'SLB', 'EOG', 'MPC', 'VLO', 'PSX', 'HAL', 'FANG']
      const consumerKeywords = ['WMT', 'HD', 'MCD', 'NKE', 'SBUX', 'TGT', 'LOW', 'TJX', 'COST', 'DG', 'PG', 'KO', 'PEP', 'CL', 'EL']
      const industrialKeywords = ['BA', 'CAT', 'GE', 'HON', 'RTX', 'LMT', 'NOC', 'GD', 'TDG', 'TXT']
      const mediaKeywords = ['DIS', 'NFLX', 'CMCSA', 'FOXA', 'VIAC', 'PARA', 'WBD', 'ROKU', 'SPOT', 'LYV']
      const telecomKeywords = ['VZ', 'T', 'TMUS', 'LUMN']
      const automotiveKeywords = ['TSLA', 'F', 'GM', 'FORD', 'HMC', 'TM', 'RIVN', 'LCID', 'NIO', 'XPEV', 'LI']
      
      if (techKeywords.includes(symbol)) return 'Technology'
      if (financeKeywords.includes(symbol)) return 'Finance'
      if (healthcareKeywords.includes(symbol)) return 'Healthcare'
      if (energyKeywords.includes(symbol)) return 'Energy'
      if (consumerKeywords.includes(symbol)) return 'Consumer'
      if (industrialKeywords.includes(symbol)) return 'Industrial'
      if (mediaKeywords.includes(symbol)) return 'Media'
      if (telecomKeywords.includes(symbol)) return 'Telecom'
      if (automotiveKeywords.includes(symbol)) return 'Automotive'
      return 'Other'
    }

    const getCompanyName = (symbol) => {
      if (this.symbolToNameCache && this.symbolToNameCache.has(symbol)) {
        return this.symbolToNameCache.get(symbol)
      }
      
      const cryptoNames = {
        'BTC-USD': 'Bitcoin (BTC)', 'ETH-USD': 'Ethereum (ETH)', 'BNB-USD': 'Binance Coin (BNB)', 'ADA-USD': 'Cardano (ADA)',
        'SOL-USD': 'Solana (SOL)', 'XRP-USD': 'Ripple (XRP)', 'DOT-USD': 'Polkadot (DOT)', 'DOGE-USD': 'Dogecoin (DOGE)',
        'MATIC-USD': 'Polygon (MATIC)', 'AVAX-USD': 'Avalanche (AVAX)', 'LINK-USD': 'Chainlink (LINK)', 'UNI-USD': 'Uniswap (UNI)',
        'LTC-USD': 'Litecoin (LTC)', 'ATOM-USD': 'Cosmos (ATOM)', 'ALGO-USD': 'Algorand (ALGO)',
        'SHIB-USD': 'Shiba Inu (SHIB)', 'ETC-USD': 'Ethereum Classic (ETC)', 'HBAR-USD': 'Hedera (HBAR)'
      }
      
      return cryptoNames[symbol] || symbol.replace('-USD', '')
    }

    const uniqueSymbols = new Set()
    const stockData = quotes
      .filter(quote => {
        if (uniqueSymbols.has(quote.symbol)) {
          return false
        }
        uniqueSymbols.add(quote.symbol)
        return true
      })
      .map((quote, index) => {
        const sector = getSector(quote.symbol)
        const displaySymbol = quote.symbol.replace('-USD', '')
        const name = getCompanyName(quote.symbol)
        const priorityIndex = this.priorityStocks.indexOf(quote.symbol)

        return {
          id: index + 1,
          symbol: quote.symbol,
          displaySymbol: displaySymbol,
          name: name,
          price: quote.price,
          change: quote.change,
          changePercent: parseFloat(quote.changePercent.toFixed(2)),
          volume: quote.volume,
          sector: sector,
          high: quote.high,
          low: quote.low,
          open: quote.open,
          previousClose: quote.previousClose,
          active: true,
          isCrypto: sector === 'Crypto',
          priorityIndex: priorityIndex >= 0 ? priorityIndex : 9999
        }
      })
      .sort((a, b) => {
        if (a.priorityIndex !== b.priorityIndex) {
          return a.priorityIndex - b.priorityIndex
        }
        return a.id - b.id
      })
      .map((stock, index) => {
        delete stock.priorityIndex
        stock.id = index + 1
        return stock
      })

    return stockData
  }

  clearCache() {
    this.cache.clear()
  }
}

