import express from 'express'
const router = express.Router()

// GET /api/portfolios/:userId - Get user portfolio
router.get('/:userId', (req, res) => {
  // Mock data - replace with database query
  res.json({
    userId: parseInt(req.params.userId),
    balance: 100000,
    holdings: [],
    totalValue: 100000
  })
})

export default router

