// frontend/src/components/TriggerCards.jsx
import React, { useState, useEffect } from 'react';

export default function TriggerCards() {
  const [triggers, setTriggers] = useState([]);

  const fetchTriggers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/triggers');
      const data = await response.json();
      setTriggers(data);
    } catch (err) {
      console.error('Error fetching triggers:', err);
    }
  };

  useEffect(() => {
    fetchTriggers();
    const interval = setInterval(fetchTriggers, 1000); // Polls every 1 second
    return () => clearInterval(interval);
  }, []);

  const handleCancel = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/triggers/${id}/cancel`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchTriggers();
      }
    } catch (err) {
      console.error('Error canceling trigger:', err);
    }
  };

  if (triggers.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 max-w-4xl mx-auto mt-6">
        <p className="text-gray-500">No active tracking loops running.</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-6 px-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
        Active Triggers ({triggers.length})
      </h3>
      
      <div className="flex flex-wrap gap-4 justify-center w-full">
        {triggers.map((trigger) => (
          <div 
            key={trigger.id} 
            style={{ 
              backgroundColor: '#0067b1', /* Official Schwab Blue */
              borderRadius: '10%',         
              padding: '10%'               
            }} 
            className="w-[20%] aspect-square shadow-lg flex flex-col justify-between transition-all duration-200 hover:bg-[#008ce3] text-gray-100"
          >
            {/* Header Content */}
            <div className="w-full">
              <div className="flex justify-between items-start w-full">
                <span className="text-base font-black tracking-tight">{trigger.symbol} to </span>
                <span className="text-[10px] font-bold bg-white bg-opacity-20 border border-white border-opacity-30 px-1.5 py-0.5 rounded">
                  {trigger.type}
                </span>
              </div>
              
              {/* Live Metric Data Dashboard */}
              <div className="text-xs space-y-0.5 mt-3 font-medium">
                <div className="flex justify-between items-center bg-black bg-opacity-20 px-1.5 py-1 rounded mb-1.5">
                  <span>LIVE:</span>
                  <span className="font-bold text-yellow-300 animate-pulse">
                    {trigger.currentPrice ? `$${trigger.currentPrice.toFixed(2)}` : 'Loading...'}
                  </span>
                </div>
                <p className="opacity-90">Target: ${trigger.targetPrice.toFixed(2)}</p>
                <p className="opacity-90">Qty: {trigger.quantity}</p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleCancel(trigger.id)}
              className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold py-1 px-2 rounded-md transition-colors text-xs border border-white border-opacity-20"
            >
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}