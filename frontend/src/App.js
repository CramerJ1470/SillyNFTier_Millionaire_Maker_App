import logo from './logo.svg';
import './App.css';
import TriggerForm from './components/TriggerForm.jsx'
import TriggerCards from './components/TriggerCards.jsx';

function getMarketStatus() {
  const now = new Date();
  // Sync perfectly with your backend by converting local time to Eastern Time (NY)
  const nyTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  
  const day = nyTime.getDay();
  const hours = nyTime.getHours();
  const minutes = nyTime.getMinutes();

  // Weekend check
  if (day === 0 || day === 6) return "CLOSED";

  const currentMinutes = hours * 60 + minutes;
  const openMinutes = 9 * 60 + 30; // 9:30 AM
  const closeMinutes = 16 * 60;    // 4:00 PM

  return (currentMinutes >= openMinutes && currentMinutes < closeMinutes) ? "LIVE" : "IDLE";

  console.log("Frontend is currently rendering on page:", window.location.href);
}



function App() {
  const status = getMarketStatus();
  return (
    <div className="App">
      <header className="App-header">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header with Market Status Badge */}
      <div className="flex justify-between items-center bg-gray-900 p-4 rounded-xl shadow">
        <h1 className="text-xl font-bold text-white">SillyNFTier Trading Dashboard</h1>
        
        {status === "LIVE" ? (
          <span className="flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
            ● Engine Active (Market Open)
          </span>
        ) : (
          <span className="flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold">
            🌙 Engine Idle (Market Closed)
          </span>
        )}
      </div>




      {/* Input controls */}
      <TriggerForm />

      {/* Live Monitoring Dashboard Cards */}
      <TriggerCards />
      </div>
      </header>
    </div>
  );
}

export default App;
