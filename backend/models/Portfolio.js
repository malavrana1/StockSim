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

