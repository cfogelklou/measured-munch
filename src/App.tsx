import { useState, useEffect } from 'react';
import './styles.css';
import { useLSFastingHours, useLSCurrentFastingState, useLSHistory, useLSCheatDays } from './hooks';
import { useCountdown } from './useCountdown';
import { FastingRecord } from './types';
import FastingStats from './FastingStats';
import FastingHistoryGraph from './FastingHistoryGraph';

function formatTime(hours: number, minutes: number, seconds: number): string {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [fastSettings, setFastSettings] = useLSFastingHours();
  const [fastState, setFastState] = useLSCurrentFastingState();
  const [fastingHistory, addFastingRecord] = useLSHistory();
  const [cheatDayState, _, useCheatDay] = useLSCheatDays();
  const [tempFastingHours, setTempFastingHours] = useState(fastSettings.fastingHours.toString());
  const [activeTab, setActiveTab] = useState<'stats' | 'graph'>('stats');
  
  const timeRemaining = useCountdown(fastState, fastSettings);
  
  // Check if a fast has completed since last render
  useEffect(() => {
    if (fastState.isActive && timeRemaining.isComplete && fastState.startTime) {
      // Record the completed fast
      const endTime = fastState.startTime + (fastSettings.fastingHours * 60 * 60 * 1000);
      const fastRecord: FastingRecord = {
        startTime: fastState.startTime,
        endTime: endTime,
        duration: fastSettings.fastingHours,
        completed: true
      };
      
      addFastingRecord(fastRecord);
    }
  }, [timeRemaining.isComplete, fastState.startTime, fastSettings.fastingHours, addFastingRecord]);

  const startFast = () => {
    setFastState({
      isActive: true,
      startTime: Date.now(),
    });
  };

  const stopFast = () => {
    // If fasting is active and not complete, record it as incomplete
    if (fastState.isActive && !timeRemaining.isComplete && fastState.startTime) {
      const now = Date.now();
      const elapsedHours = (now - fastState.startTime) / (60 * 60 * 1000);
      console.log(`Fasting stopped at ${now}, elapsed hours: ${elapsedHours}`);
      
      // Add incomplete fast record
      const fastRecord: FastingRecord = {
        startTime: fastState.startTime,
        endTime: now,
        duration: elapsedHours,
        completed: false
      };
      
      addFastingRecord(fastRecord);
      
    }
    
    setFastState({
      isActive: false,
      startTime: null,
    });
  };

  const takeCheatDay = () => {
    // Use a cheat day without starting a fast
    const success = useCheatDay();
    if (success) {
      // Add a record for using a cheat day
      const now = Date.now();
      const fastRecord: FastingRecord = {
        startTime: now,
        endTime: now,
        duration: 0,
        completed: false
      };
      
      addFastingRecord(fastRecord);
    }
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
      
      {/* History and Stats Section */}
      <section className="history-section">
        <h2>Your Fasting Journey</h2>
        
        <div className="history-tabs">
          <button 
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Stats
          </button>
          <button 
            className={`tab-button ${activeTab === 'graph' ? 'active' : ''}`}
            onClick={() => setActiveTab('graph')}
          >
            Monthly Overview
          </button>
        </div>
        
        {activeTab === 'stats' && (
          <FastingStats 
            history={fastingHistory} 
            cheatDayState={cheatDayState}
            onUseCheatDay={takeCheatDay}
          />
        )}
        
        {activeTab === 'graph' && (
          <FastingHistoryGraph records={fastingHistory.records} />
        )}
      </section>
      
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
              {/* Add button to clear browser memory */}
              <button className="blue-button" onClick={() => {
                setFastState({ isActive: false, startTime: null });
                setFastSettings({ fastingHours: 16 });
                setShowSettings(false);
              }}>
                Clear Browser Memory
              </button>
              
              <button className="blue-button" onClick={saveSettings}>
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