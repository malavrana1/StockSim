import express from 'express'
const router = express.Router()

router.get('/:userId', (req, res) => {
  res.json({
    userId: parseInt(req.params.userId),
    balance: 100000,
    holdings: [],
    totalValue: 100000
  })
})

export default router

