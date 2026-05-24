// backend/server.js
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { createTrigger, getActiveTriggers, cancelTriggerByUser } from './models/TriggerModel.js';
import { getValidAccessToken } from './services/schwabAuth.js';
import { startTradeEngine } from './workers/tradeEngine.js';
import secrets from './secrets.js';

console.log(`Initializing trading engine on port ${secrets.PORT}...`);

// Pass these parameters straight into your Schwab API configuration
const clientID = secrets.SCHWAB_CLIENT_ID;
const clientSecret = secrets.SCHWAB_CLIENT_SECRET;
const redirectUri = secrets.SCHWAB_CALLBACK_URL;

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Helper function to determine if the US Equity Market is currently open
 * Converts system time to America/New_York (Eastern Time)
 */
function isMarketOpen() {
  const now = new Date();
  const nyTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  
  const day = nyTime.getDay(); // 0 = Sunday, 6 = Saturday
  const hours = nyTime.getHours();
  const minutes = nyTime.getMinutes();
  
  // 1. Return false if it is the weekend
  if (day === 0 || day === 6) return false;
  
  // 2. Convert current time to total minutes past midnight
  const currentMinutes = hours * 60 + minutes;
  const marketOpenMinutes = 9 * 60 + 30; // 9:30 AM = 570 minutes
  const marketCloseMinutes = 16 * 60;    // 4:00 PM = 960 minutes
  
  return currentMinutes >= marketOpenMinutes && currentMinutes < marketCloseMinutes;
}

// Enhanced GET route to attach live market data to your cards
app.get('/api/triggers', async (req, res) => {
  try {
    const activeTriggers = await getActiveTriggers();
    if (activeTriggers.length === 0) {
      return res.json([]);
    }

    // Fetch the live prices in one single batch to respect rate limits
    const uniqueSymbols = [...new Set(activeTriggers.map(t => t.symbol))].join(',');
    const accessToken = await getValidAccessToken();
    
    const quoteResponse = await axios.get(`https://api.schwabapi.com/marketdata/v1/quotes`, {
      params: { symbols: uniqueSymbols },
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    // Map the live prices directly onto the trigger objects
    const triggersWithPrices = activeTriggers.map(trigger => {
      const livePrice = quoteResponse.data[trigger.symbol]?.quote?.lastPrice || null;
      return {
        ...trigger,
        currentPrice: livePrice
      };
    });

    res.json(triggersWithPrices);
  } catch (error) {
    console.error('Error serving triggers with live prices:', error.message);
    // Fallback to sending raw triggers if Schwab API fails temporarily
    const fallbackTriggers = await getActiveTriggers();
    res.json(fallbackTriggers);
  }
});

// Cancel a specific trigger
app.post('/api/triggers/:id/cancel', async (req, res) => {
  const { id } = req.params;
  try {
    const success = await cancelTriggerByUser(id);
    if (success) {
      res.json({ message: `Trigger #${id} successfully canceled.` });
    } else {
      res.status(404).json({ error: 'Trigger not found or already inactive.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error while canceling trigger.' });
  }
});

// API route to create a monitoring constraint
app.post('/api/triggers', async (req, res) => {
  const { symbol, targetPrice, type, quantity, accountId } = req.body;
  
  if (!symbol || !targetPrice || !type || !quantity) {
    return res.status(400).json({ error: 'Missing required configuration fields' });
  }

  const newTrigger = await createTrigger({ symbol: symbol.toUpperCase(), targetPrice, type, quantity, accountId });
  res.status(201).json({ message: 'Trigger registered successfully', trigger: newTrigger });
});

// Express App Entry Listener
app.listen(5000, () => {
  console.log('Express Server running on port 5000');
  
  // Rule-bounded worker interval executing every 30 seconds
  setInterval(() => {
    if (!isMarketOpen()) {
      console.log("💤 Market is closed. Algorithmic background execution suspended.");
      return;
    }
    
    console.log("🚀 Market is open. Running background execution engine cycles...");
    startTradeEngine(); 
  }, 30000);
});