import { useState } from 'react';
import './styles.css';
import { useCountdown } from './useCountdown';
import { FastingRecord } from './types';
import FastingStats from './FastingStats';
import FastingHistoryGraph from './FastingHistoryGraph';
import { useLSContext } from './context';
import { dbg } from './debug';
import { formatTime } from './hooks';

function App() {
  const {
    fastingSettings,
    setFastingSettings,
    fastingState,
    setFastingState,
    history,
    addHistoryRecord,
    setHistoryToEmpty,
  } = useLSContext();

  const [showSettings, setShowSettings] = useState(false);
  const [tempFastingHours, setTempFastingHours] = useState(fastingSettings.fastingHours.toString());
  const [activeTab, setActiveTab] = useState<'stats' | 'graph'>('stats');

  const timeRemaining = useCountdown(fastingState, fastingSettings);

  const startFast = () => {
    setFastingState({
      isActive: true,
      startTime: Date.now(),
    });
  };

  const stopFast = () => {
    // If fasting is active and not complete, record it as incomplete
    if (fastingState.isActive && fastingState.startTime) {
      const now = Date.now();
      const elapsedMs = now - fastingState.startTime;

      // Add incomplete fast record
      const fastRecord: FastingRecord = {
        startTime: fastingState.startTime,
        endTime: now,
        durationMs: elapsedMs,
        successfull: fastingState.isActive && timeRemaining.isComplete,
      };

      dbg.log('Adding fast record:', fastRecord);
      addHistoryRecord(fastRecord);
    }

    setFastingState({
      isActive: false,
      startTime: null,
    });
  };

  const saveSettings = () => {
    const hours = parseInt(tempFastingHours);
    if (!isNaN(hours) && hours > 0 && hours <= 72) {
      setFastingSettings({
        ...fastingSettings,
        fastingHours: hours,
      });
      setShowSettings(false);
    }
  };

  const getFastingStatus = () => {
    if (!fastingState.isActive) {
      return 'Ready to start fasting';
    }

    if (timeRemaining.isComplete) {
      return 'Fasting complete! You can eat now';
    }

    return 'Fasting in progress';
  };

  dbg.log('Fasting state:', fastingState);
  dbg.log('Fasting settings:', fastingSettings);
  dbg.log('Time remaining:', timeRemaining);
  dbg.log('Fasting history:', history);
  dbg.log('Active tab:', activeTab);

  return (
    <div className='app-container'>
      <button
        className='settings-button'
        onClick={() => setShowSettings(true)}
        aria-label='Settings'
      >
        ⚙️
      </button>

      <header className='app-header'>
        <h1>Measured Munch</h1>
        <p className='app-description'>
          Track your intermittent fasting periods easily. Start a fast and we'll tell you when it's
          time to eat again.
        </p>
      </header>

      <div className='timer-container'>
        <div className='fasting-status'>{getFastingStatus()}</div>

        {fastingState.isActive && (
          <div className={`timer-display ${timeRemaining.isComplete ? 'timer-complete' : ''}`}>
            {formatTime(timeRemaining.hours, timeRemaining.minutes, timeRemaining.seconds)}
          </div>
        )}

        {!fastingState.isActive ? (
          <button className='action-button' onClick={startFast}>
            Start Fast
          </button>
        ) : (
          <button className='action-button stop' onClick={stopFast}>
            Stop Fast
          </button>
        )}
      </div>

      {/* History and Stats Section */}
      <section className='history-section'>
        <h2>Your Fasting Journey</h2>

        <div className='history-tabs'>
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

        {activeTab === 'stats' && <FastingStats history={history} />}

        {activeTab === 'graph' && <FastingHistoryGraph records={history.records} />}
      </section>

      {/* Settings Modal */}
      {showSettings && (
        <div className='settings-modal'>
          <div className='settings-content'>
            <div className='settings-header'>
              <h2>Settings</h2>
              <button
                className='close-button'
                onClick={() => setShowSettings(false)}
                aria-label='Close'
              >
                ✕
              </button>
            </div>

            <div className='settings-form'>
              <div className='form-group'>
                <label htmlFor='fasting-hours'>Fasting Duration (hours)</label>
                <input
                  id='fasting-hours'
                  type='number'
                  min='1'
                  max='72'
                  value={tempFastingHours}
                  onChange={(e) => setTempFastingHours(e.target.value)}
                />
              </div>
              {/* Add button to clear browser memory */}
              <button
                className='blue-button'
                onClick={() => {
                  setFastingState({ isActive: false, startTime: null });
                  setFastingSettings({ fastingHours: 16 });
                  setHistoryToEmpty();
                  setShowSettings(false);
                }}
              >
                Reset All Data
              </button>

              <button className='blue-button' onClick={saveSettings}>
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
