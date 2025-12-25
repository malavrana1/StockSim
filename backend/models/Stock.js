export const StockSchema = {
  symbol: String,
  name: String,
  currentPrice: Number,
  historicalPrices: [Number],
  volatility: Number,
  sector: String,
  volume: Number
}

