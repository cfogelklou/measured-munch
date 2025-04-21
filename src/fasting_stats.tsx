import { formatTimeFromMs } from './hooks';
import { FastingHistory } from './types';

interface FastingStatsProps {
  history: FastingHistory;
}

function FastingStats({ history }: FastingStatsProps) {
  const successfulFasts = history.records.filter(
    (record) => record.durationMs >= record.targetMs,
  ).length;
  const longestFast =
    history.records.length <= 0
      ? 0
      : Math.max(...history.records.map((record) => record.durationMs));
  const shortestFast =
    history.records.length <= 0
      ? 0
      : Math.min(...history.records.map((record) => record.durationMs));
  const totalFasts = history.records.length;

  return (
    <div className='fasting-stats'>
      <div className='stats-container'>
        <div className='stat-card'>
          <h3>Fasting Stats</h3>
          <div className='stat-row'>
            <span className='stat-label'>Successful Fasts:</span>
            <span className='stat-value'>{successfulFasts}</span>
          </div>
          <div className='stat-row'>
            <span className='stat-label'>Total Fasts:</span>
            <span className='stat-value'>{totalFasts}</span>
          </div>
          <div className='stat-row'>
            <span className='stat-label'>Longest Fast:</span>
            <span className='stat-value'>
              {longestFast ? formatTimeFromMs(longestFast) : 'N/A'}
            </span>
          </div>
          <div className='stat-row'>
            <span className='stat-label'>Shortest Fast:</span>
            <span className='stat-value'>
              {shortestFast ? formatTimeFromMs(shortestFast) : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FastingStats;
