// Portfolio model schema (for MongoDB/Mongoose)
// This is a template - implement with actual database

export const PortfolioSchema = {
  userId: String,
  balance: Number,
  holdings: [{
    stockId: String,
    quantity: Number,
    avgPrice: Number
  }],
  totalValue: Number
}

