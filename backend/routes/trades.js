import express from 'express'
const router = express.Router()

router.post('/', (req, res) => {
  const { userId, stockId, quantity, type, price } = req.body
  
  if (!userId || !stockId || !quantity || !type || !price) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const trade = {
    id: Date.now(),
    userId,
    stockId,
    quantity,
    type,
    price,
    timestamp: new Date().toISOString()
  }

  res.status(201).json(trade)
})

router.get('/user/:userId', (req, res) => {
  res.json([])
})

export default router

