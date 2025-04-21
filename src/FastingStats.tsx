import { FastingHistory } from './types';

interface FastingStatsProps {
  history: FastingHistory;
}

function FastingStats({ history }: FastingStatsProps) {
  return (
    <div className='fasting-stats'>
      <div className='stats-container'>
        <div className='stat-card'>
          <h3>Fasting Stats</h3>
          <div className='stat-row'>
            <span className='stat-label'>Successful Fasts:</span>
            <span className='stat-value'>{history.successfulFasts}</span>
          </div>
          <div className='stat-row'>
            <span className='stat-label'>Longest Fast:</span>
            <span className='stat-value'>
              {history.longestFast ? `${history.longestFast.toFixed(1)} hours` : 'N/A'}
            </span>
          </div>
          <div className='stat-row'>
            <span className='stat-label'>Shortest Fast:</span>
            <span className='stat-value'>
              {history.shortestFast && history.shortestFast !== Infinity
                ? `${history.shortestFast.toFixed(1)} hours`
                : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FastingStats;
