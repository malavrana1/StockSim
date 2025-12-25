# StockSim 📈

A simple and beautiful stock market simulator where you can explore stocks, calculate potential profits, and keep track of your favorite companies. Think of it as your personal stock market playground!

## What is this?

StockSim lets you:
- **Browse real stocks** - See live prices for hundreds of stocks and cryptocurrencies
- **Calculate profits** - Figure out how much you'd make if you invested in a stock at a certain price
- **Save your calculations** - Keep track of your favorite investment scenarios
- **Watch stocks** - Build your own watchlist of companies you're interested in
- **Read news** - Stay updated with the latest stock market news

Everything updates in real-time, so you're always seeing the latest prices.

## Getting Started

### Quick Setup

1. **Install everything:**
   ```bash
   npm run install:all
   ```

2. **Start the app:**
   ```bash
   npm run dev
   ```

That's it! The frontend will open at `http://localhost:5173` and the backend will run on `http://localhost:3000`.

### What You Need

- **Node.js** installed on your computer
- That's literally it! No API keys needed - everything works out of the box.

The app uses Yahoo Finance API which is completely free and doesn't require any signup or API keys. Just install and run!

## How to Use

1. **Browse stocks** - Scroll through the list of available stocks and cryptocurrencies
2. **Select a stock** - Click on any stock to see more details
3. **Calculate profits** - Enter how much you'd invest and what price you're targeting
4. **Save it** - Click "Save" to keep your calculation for later
5. **Load it back** - Click on any saved calculation to load it back into the calculator
6. **Watch stocks** - Add stocks to your watchlist to keep an eye on them

## Project Structure

```
StockSim/
├── frontend/          # The user interface (Vue.js)
├── backend/           # The server that fetches stock data
├── functions/         # Firebase functions (for deployment)
└── shared/            # Shared code between frontend and backend
```

## Tech Stuff

**Frontend:**
- Vue 3 - The framework that makes everything work
- Bootstrap - Makes it look nice
- Socket.io - Keeps prices updated in real-time

**Backend:**
- Node.js + Express - Handles API requests
- Socket.io - Sends real-time updates to the frontend
- Yahoo Finance API - Gets all the stock data (free!)

## Building for Production

If you want to build the app for production:

```bash
npm run build:frontend
```

This creates an optimized version in the `frontend/dist` folder.

## Deploying to Firebase

The app is set up to deploy to Firebase Hosting. Check out `FIREBASE_SETUP.md` for detailed instructions.

## Important Notes

- This is a **simulator** - you can't actually buy or sell stocks here
- Stock prices update every minute automatically
- All data comes from free APIs - no payment required
- Your watchlist and saved calculations are stored locally in your browser

## License

MIT - Feel free to use this however you want!

---

**Enjoy exploring the stock market!** 🚀
