export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

export const calculateGainLoss = (currentPrice, avgPrice, quantity) => {
  return (currentPrice - avgPrice) * quantity
}

export const calculateGainLossPercent = (currentPrice, avgPrice) => {
  return ((currentPrice - avgPrice) / avgPrice) * 100
}

