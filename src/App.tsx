import { useState } from 'react';
import './styles.css';
import { useFastSettings, useFastState } from './hooks';
import { useCountdown } from './useCountdown';

function formatTime(hours: number, minutes: number, seconds: number): string {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [fastSettings, setFastSettings] = useFastSettings();
  const [fastState, setFastState] = useFastState();
  const [tempFastingHours, setTempFastingHours] = useState(fastSettings.fastingHours.toString());
  
  const timeRemaining = useCountdown(fastState, fastSettings);

  const startFast = () => {
    setFastState({
      isActive: true,
      startTime: Date.now(),
    });
  };

  const stopFast = () => {
    setFastState({
      isActive: false,
      startTime: null,
    });
  };

  const saveSettings = () => {
    const hours = parseInt(tempFastingHours);
    if (!isNaN(hours) && hours > 0 && hours <= 72) {
      setFastSettings({
        ...fastSettings,
        fastingHours: hours,
      });
      setShowSettings(false);
    }
  };

  const getFastingStatus = () => {
    if (!fastState.isActive) {
      return "Ready to start fasting";
    }
    
    if (timeRemaining.isComplete) {
      return "Fasting complete! You can eat now";
    }
    
    return "Fasting in progress";
  };

  return (
    <div className="app-container">
      <button 
        className="settings-button" 
        onClick={() => setShowSettings(true)}
        aria-label="Settings"
      >
        ⚙️
      </button>
      
      <header className="app-header">
        <h1>Measured Munch</h1>
        <p className="app-description">
          Track your intermittent fasting periods easily. Start a fast and we'll tell you when it's time to eat again.
        </p>
      </header>
      
      <div className="timer-container">
        <div className="fasting-status">
          {getFastingStatus()}
        </div>
        
        {fastState.isActive && (
          <div className={`timer-display ${timeRemaining.isComplete ? 'timer-complete' : ''}`}>
            {formatTime(timeRemaining.hours, timeRemaining.minutes, timeRemaining.seconds)}
          </div>
        )}
        
        {!fastState.isActive ? (
          <button className="action-button" onClick={startFast}>
            Start Fast
          </button>
        ) : (
          <button className="action-button stop" onClick={stopFast}>
            Stop Fast
          </button>
        )}
      </div>
      
      {/* Settings Modal */}
      {showSettings && (
        <div className="settings-modal">
          <div className="settings-content">
            <div className="settings-header">
              <h2>Settings</h2>
              <button 
                className="close-button" 
                onClick={() => setShowSettings(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            
            <div className="settings-form">
              <div className="form-group">
                <label htmlFor="fasting-hours">Fasting Duration (hours)</label>
                <input
                  id="fasting-hours"
                  type="number"
                  min="1"
                  max="72"
                  value={tempFastingHours}
                  onChange={(e) => setTempFastingHours(e.target.value)}
                />
              </div>
              
              <button className="save-button" onClick={saveSettings}>
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;