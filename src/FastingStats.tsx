import { FastingHistory, CheatDayState } from './types';

interface FastingStatsProps {
  history: FastingHistory;
  cheatDayState: CheatDayState;
  onUseCheatDay: () => void;
}

function FastingStats({ history, cheatDayState, onUseCheatDay }: FastingStatsProps) {
  return (
    <div className="fasting-stats">
      <div className="stats-container">
        <div className="stat-card">
          <h3>Fasting Stats</h3>
          <div className="stat-row">
            <span className="stat-label">Successful Fasts:</span>
            <span className="stat-value">{history.successfulFasts}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Longest Fast:</span>
            <span className="stat-value">
              {history.longestFast ? `${history.longestFast.toFixed(1)} hours` : "N/A"}
            </span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Shortest Fast:</span>
            <span className="stat-value">
              {history.shortestFast && history.shortestFast !== Infinity 
                ? `${history.shortestFast.toFixed(1)} hours` 
                : "N/A"}
            </span>
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Cheat Days</h3>
          <div className="stat-row">
            <span className="stat-label">Remaining this week:</span>
            <span className="stat-value">{cheatDayState.remainingDays}</span>
          </div>
          <div className="cheat-day-actions">
            <button 
              className="action-button cheat-day-button" 
              onClick={onUseCheatDay}
              disabled={cheatDayState.remainingDays <= 0}
            >
              Take a Cheat Day
            </button>
            <p className="cheat-day-info">
              Cheat days allow you to skip fasting for a day. 
              You get 2 cheat days per week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FastingStats;