export class EventSimulator {
  constructor(io, marketService) {
    this.io = io
    this.marketService = marketService
    this.events = [
      {
        type: 'EARNINGS_ANNOUNCEMENT',
        description: 'Tech company reports strong quarterly earnings',
        affectedSectors: ['Technology'],
        impact: 'high',
        priceChange: 0.05 // 5% increase
      },
      {
        type: 'MARKET_CRASH',
        description: 'Market-wide selloff triggered by economic concerns',
        affectedSectors: ['all'],
        impact: 'high',
        priceChange: -0.10 // 10% decrease
      },
      {
        type: 'MERGER_NEWS',
        description: 'Major merger announcement in finance sector',
        affectedSectors: ['Finance'],
        impact: 'medium',
        priceChange: 0.03 // 3% increase
      },
      {
        type: 'VOLATILITY_SPIKE',
        description: 'Increased market volatility',
        affectedSectors: ['all'],
        impact: 'medium',
        priceChange: 0 // Random fluctuations
      }
    ]
  }

  triggerRandomEvent() {
    const event = this.events[Math.floor(Math.random() * this.events.length)]
    const stocks = this.marketService.getAllStocks()

    const affectedStocks = stocks.filter(stock => 
      event.affectedSectors.includes('all') || 
      event.affectedSectors.includes(stock.sector)
    )

    affectedStocks.forEach(stock => {
      const newPrice = stock.price * (1 + event.priceChange)
      this.marketService.updateStockPrice(stock.id, newPrice)
    })

    this.io.emit('market:event', {
      id: Date.now(),
      type: event.type,
      description: event.description,
      impact: event.impact,
      affectedStocks: affectedStocks.map(s => s.symbol),
      timestamp: new Date().toISOString()
    })

    this.io.emit('market:news', {
      id: Date.now(),
      title: event.type.replace(/_/g, ' '),
      content: event.description,
      impact: event.impact,
      timestamp: new Date().toISOString()
    })
  }
}

