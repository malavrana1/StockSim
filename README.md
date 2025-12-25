# StockSim 📈

A simple stock market simulator where you can explore stocks, calculate profits, and track your favorite companies. Think of it as your personal stock market playground!

## What can you do?

- Browse real stocks and cryptocurrencies with live prices
- Calculate how much profit you'd make on investments
- Save your calculations and load them back later
- Build a watchlist of stocks you're interested in
- Read the latest stock market news
- Switch between light and dark themes
- Customize your settings (default amounts, currency, etc.)

Everything updates in real-time, so you always see the latest prices.

## Getting Started

1. Install everything:
   ```bash
   npm run install:all
   ```

2. Start the app:
   ```bash
   npm run dev
   ```

That's it! Open `http://localhost:5173` in your browser.

**What you need:** Just Node.js installed. No API keys needed - everything works out of the box using free APIs.

## How to Use

1. Sign up or login
2. Browse stocks from the dropdown
3. Enter your investment amount, purchase price, and target price
4. See your potential profit/loss instantly
5. Save calculations to load them back later
6. Add stocks to your watchlist
7. Check out the latest stock news

## Project Structure

```
StockSim/
├── frontend/     # Vue.js user interface
├── backend/      # Node.js server for stock data
├── functions/    # Firebase functions
└── shared/       # Shared code
```

## Tech Stack

**Frontend:** Vue 3, Pinia, Bootstrap, Socket.io  
**Backend:** Node.js, Express, Socket.io  
**Data:** Yahoo Finance API, Finnhub API (both free, no keys needed)  
**Deployment:** Firebase Hosting & Functions

## Building & Deploying

Build for production:
```bash
npm run build:frontend
```

Deploy to Firebase:
```bash
npm run deploy
```

## Notes

- This is a **simulator** - no real trading happens here
- Prices update in real-time
- All data is free (no API keys needed)
- Your watchlist and calculations are saved in your browser
- Popular stocks appear at the top of the list

## License

MIT - Feel free to use this however you want!

---

**Enjoy exploring the stock market!** 🚀
