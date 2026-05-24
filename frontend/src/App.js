import logo from './logo.svg';
import './App.css';
import TriggerForm from './components/TriggerForm.jsx'
import TriggerCards from './components/TriggerCards.jsx';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      {/* Input controls */}
      <TriggerForm />

      {/* Live Monitoring Dashboard Cards */}
      <TriggerCards />
      </header>
    </div>
  );
}

export default App;
