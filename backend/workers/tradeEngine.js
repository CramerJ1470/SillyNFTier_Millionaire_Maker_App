// backend/workers/tradeEngine.js
import axios from 'axios';
import { getValidAccessToken } from '../services/schwabAuth.js';
import { getActiveTriggers, deactivateTrigger } from '../models/TriggerModel.js';

async function monitorAndExecute() {
  try {
    const triggers = await getActiveTriggers();
    if (triggers.length === 0) return;

    // 1. Batch all active unique symbols into a comma-separated string (e.g., "AAPL,TSLA,MSFT")
    const uniqueSymbols = [...new Set(triggers.map(t => t.symbol))].join(',');
    
    const accessToken = await getValidAccessToken();

    // 2. Fire EXACTLY ONE API call for all monitored stocks combined
    const quoteResponse = await axios.get(`https://api.schwabapi.com/marketdata/v1/quotes`, {
      params: { symbols: uniqueSymbols },
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    const quotes = quoteResponse.data;

    // 3. Loop through your local triggers and evaluate them against the batched data
    for (const trigger of triggers) {
      const stockData = quotes[trigger.symbol];
      const currentPrice = stockData?.quote?.lastPrice;

      if (!currentPrice) {
        console.warn(`[Engine] No price data found returned for ${trigger.symbol}`);
        continue;
      }

      // Evaluate trade rules
      let shouldExecute = false;
      if (trigger.type === 'SELL' && currentPrice >= trigger.targetPrice) shouldExecute = true;
      if (trigger.type === 'BUY' && currentPrice <= trigger.targetPrice) shouldExecute = true;

      // Fire Order Request if target hit
      if (shouldExecute) {
        console.log(`[TARGET HIT] Executing 1-second high-freq ${trigger.type} order for ${trigger.symbol} at $${currentPrice}`);
        
        const orderPayload = {
          orderType: "MARKET",
          session: "NORMAL",
          duration: "DAY",
          orderStrategyType: "SINGLE",
          orderLegCollection: [{
            instruction: trigger.type,
            quantity: trigger.quantity,
            instrument: { symbol: trigger.symbol, assetType: "EQUITY" }
          }]
        };

        // Instantly deactivate locally FIRST to prevent a double-fire in the next 1-second tick
        await deactivateTrigger(trigger.id);

        // Send execution order to Schwab
        await axios.post(
          `https://api.schwabapi.com/trader/v1/accounts/${trigger.accountId}/orders`,
          orderPayload,
          { headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
        );
      }
    }
  } catch (error) {
    console.error('Error during 1-second execution cycle:', error.response?.data || error.message);
  }
}

// Spin up the engine loop to run every 1 second (1000 milliseconds)
export function startTradeEngine() {
  console.log('High-Frequency 1-Second Trade monitoring engine initialized.');
  setInterval(monitorAndExecute, 1000); 
}