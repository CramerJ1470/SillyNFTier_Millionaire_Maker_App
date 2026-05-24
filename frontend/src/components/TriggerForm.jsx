// frontend/src/components/TriggerForm.jsx
import React, { useState } from 'react';

export default function TriggerForm() {
  const [formData, setFormData] = useState({
    symbol: '',
    targetPrice: '',
    quantity: '',
    type: 'SELL',
    accountId: 'YOUR_SCHWAB_ACC_ID'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/triggers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      alert(data.message || 'Trigger Added!');
    } catch (err) {
      console.error('Error creating user trigger:', err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-900">SillyNFTier Millionaire Making Price Execution Trigger</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input 
          type="text" placeholder="Stock Symbol (e.g. TSLA)" required
          className="border p-2 rounded"
          value={formData.symbol}
          onChange={e => setFormData({...formData, symbol: e.target.value})}
        />
        <input 
          type="number" step="0.01" placeholder="Target Execution Price ($)" required
          className="border p-2 rounded"
          value={formData.targetPrice}
          onChange={e => setFormData({...formData, targetPrice: e.target.value})}
        />
        <input 
          type="number" placeholder="Shares Quantity" required
          className="border p-2 rounded"
          value={formData.quantity}
          onChange={e => setFormData({...formData, quantity: e.target.value})}
        />
        <select 
          className="border p-2 rounded"
          value={formData.type}
          onChange={e => setFormData({...formData, type: e.target.value})}
        >
          <option value="SELL">Sell Order (Execute if Current Price ≥ Target)</option>
          <option value="BUY">Buy Order (Execute if Current Price ≤ Target)</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Activate Autonomous Watcher
        </button>
      </form>
    </div>
  );
}