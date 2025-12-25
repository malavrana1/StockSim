import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
  res.json([
    { id: 1, name: 'Trader1', portfolioValue: 125000, gainLoss: 25000, gainLossPercent: 25, badges: ['First Trade', 'Profit Maker'] },
    { id: 2, name: 'Trader2', portfolioValue: 115000, gainLoss: 15000, gainLossPercent: 15, badges: ['Risk Taker'] },
    { id: 3, name: 'Trader3', portfolioValue: 110000, gainLoss: 10000, gainLossPercent: 10, badges: [] }
  ])
})

router.get('/:id', (req, res) => {
  res.json({
    id: parseInt(req.params.id),
    name: 'User',
    email: 'user@example.com',
    portfolioValue: 100000
  })
})

export default router

