export class AIService {
  async generateSuggestions() {
    const suggestions = [
      {
        id: 1,
        stockId: 1,
        symbol: 'AAPL',
        action: 'buy',
        confidence: 0.85,
        reason: 'Strong upward trend with high volume'
      },
      {
        id: 2,
        stockId: 3,
        symbol: 'MSFT',
        action: 'buy',
        confidence: 0.78,
        reason: 'Positive earnings forecast'
      },
      {
        id: 3,
        stockId: 7,
        symbol: 'XOM',
        action: 'sell',
        confidence: 0.65,
        reason: 'Declining trend in energy sector'
      }
    ]

    return suggestions
  }

  analyzePortfolio(portfolio) {
    return {
      riskLevel: 'medium',
      diversification: 'good',
      recommendations: ['Consider diversifying into healthcare sector']
    }
  }
}

