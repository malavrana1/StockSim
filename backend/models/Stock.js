// Stock model schema (for MongoDB/Mongoose)
// This is a template - implement with actual database

export const StockSchema = {
  symbol: String,
  name: String,
  currentPrice: Number,
  historicalPrices: [Number],
  volatility: Number,
  sector: String,
  volume: Number
}

