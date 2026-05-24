// backend/server.js
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { createTrigger ,getActiveTriggers, cancelTriggerByUser } from './models/TriggerModel.js';
import { getValidAccessToken } from './services/schwabAuth.js';
import { startTradeEngine } from './workers/tradeEngine.js';

// Example usage inside backend/server.js or backend/services/schwabClient.js
const secrets = require('./secrets');

console.log(`Initializing trading engine on port ${secrets.PORT}...`);

// Pass these parameters straight into your Schwab API configuration
const clientID = secrets.SCHWAB_CLIENT_ID;
const clientSecret = secrets.SCHWAB_CLIENT_SECRET;
const redirectUri = secrets.SCHWAB_CALLBACK_URL;


const app = express();
app.use(cors());
app.use(express.json());

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



// // 1. Get all active triggers for the frontend cards
// app.get('/api/triggers', async (req, res) => {
//   try {
//     const activeTriggers = await getActiveTriggers();
//     res.json(activeTriggers);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch active triggers' });
//   }
// });

// 2. Cancel a specific trigger
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

app.listen(5000, () => {
  console.log('Express Server running on port 5000');
  startTradeEngine(); // Starts the 30s background loop
});