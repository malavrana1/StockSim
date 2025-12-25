// Trade model schema (for MongoDB/Mongoose)
// This is a template - implement with actual database

export const TradeSchema = {
  userId: String,
  stockId: String,
  quantity: Number,
  type: String, // 'buy' or 'sell'
  price: Number,
  timestamp: Date
}

