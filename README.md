# StockSim

An interactive stock market viewer built with Vue.js, featuring real-time stock data from live APIs, profit calculations, watchlists, and animated visualizations.

## 🚀 Features

- **Live Stock Data** - Real-time stock prices from Alpha Vantage API
- **Profit Calculator** - Calculate potential profits with $10k investment
- **Watchlist** - Add stocks to your personal watchlist
- **Real-Time Updates** - Live price updates via WebSocket
- **Stock Search** - Search and filter stocks by symbol, name, or sector
- **Interactive UI** - Smooth animations and modern design
- **Market Statistics** - View total stocks, watchlist count, and market status

## 📁 Project Structure

```
StockSim/
├── frontend/              # Vue.js frontend application
│   ├── src/
│   │   ├── components/   # Vue components
│   │   ├── views/        # Page views
│   │   ├── store/        # Pinia stores
│   │   ├── router/       # Vue Router
│   │   ├── composables/  # Vue composables
│   │   └── utils/        # Utility functions
│   └── package.json
│
├── backend/              # Node.js + Express API
│   ├── controllers/      # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic services
│   └── server.js         # Express server
│
├── shared/               # Shared constants
└── scripts/              # Utility scripts
```

## 🛠️ Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Bootstrap 5** - UI framework
- **Bootstrap Icons** - Icon library
- **Chart.js** - Charting library
- **GSAP** - Animation library
- **Socket.io-client** - Real-time communication
- **Pinia** - State management
- **Vue Router** - Routing

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.io** - WebSocket server
- **MongoDB** (optional) - Database

## 📦 Installation

### Frontend Setup

```bash
cd frontend
npm install
```

### Backend Setup

```bash
cd backend
npm install
```

## 🚀 Development

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### Start Backend

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:3000`

## 📝 Environment Variables

Create a `.env` file in the `backend` directory (optional - API works without keys):

```env
# Finnhub API Key (Optional - for better crypto data)
# Get your free API key at: https://finnhub.io/register
# Free tier: 60 API calls per minute
# Only needed if you want enhanced crypto data
FINNHUB_API_KEY=your_finnhub_api_key_here

# Server Configuration
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### API Setup

**No API Keys Required!** The application uses **Yahoo Finance API** which is completely free and requires no API key. It works out of the box.

**Optional: Finnhub API Key** (for enhanced crypto data):
   - Visit https://finnhub.io/register
   - Sign up for a free account
   - Get your API key from the dashboard
   - Free tier allows 60 API calls per minute
   - Add the key to your `.env` file (optional - crypto will still work via Yahoo Finance)

## 🎯 Usage

1. **Set up API keys** (see Environment Variables above)
2. Start both frontend and backend servers using `npm run dev` from the root directory
3. Navigate to `http://localhost:5173`
4. Browse available stocks
5. Add stocks to your watchlist by clicking "Add to List"
6. Click on any stock to select it for the profit calculator
7. Enter a target price to see potential profit with $10k investment
8. Use the search bar to find specific stocks
9. Filter stocks by sector using the sector buttons

## 📊 API Endpoints

### Stocks
- `GET /api/stocks` - Get all stocks (fetched from Alpha Vantage)
- `GET /api/stocks/:id` - Get single stock by ID
- `GET /api/stocks/symbol/:symbol` - Get stock by symbol (e.g., AAPL)
- `POST /api/stocks/refresh` - Manually refresh all stock prices

**Note:** Stock data is automatically refreshed every minute to respect API rate limits.

## 🔌 WebSocket Events

### Client → Server
- `join:room` - Join trading room
- `leave:room` - Leave trading room

### Server → Client
- `market:update` - Market-wide stock updates (every minute)
- `stock:price-update` - Individual stock price update with change and changePercent

## 🏗️ Build

### Frontend

```bash
cd frontend
npm run build
```

### Backend

The backend runs directly with Node.js, no build step required.

## 📄 License

MIT

## 👤 Author

Built for portfolio and learning purposes.

## 🔧 Development

### Running the Application

From the root directory:

```bash
npm run dev
```

This will start both frontend and backend servers concurrently.

### Stock Data Sources

The application uses:
- **Yahoo Finance API** (primary) - Free, no API key required, works immediately
- **Finnhub API** (optional) - Only for enhanced crypto data if API key provided

Stock prices are updated every minute. The application caches responses for 1 minute to reduce API calls. All stocks and cryptocurrencies load automatically without any configuration needed!

---

**Note:** This application displays real stock market data for informational purposes only. It does not support actual trading or financial transactions.
