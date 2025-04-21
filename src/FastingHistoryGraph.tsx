import { FastingRecord } from './types';

interface FastingHistoryGraphProps {
  records: FastingRecord[];
}

function FastingHistoryGraph({ records }: FastingHistoryGraphProps) {
  // Group records by day for the last 30 days
  const getDailyData = () => {
    const dailyData: Record<string, FastingRecord[]> = {};
    const now = new Date();

    // Initialize the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dailyData[dateString] = [];
    }

    // Populate with records
    records.forEach((record) => {
      const date = new Date(record.startTime);
      const dateString = date.toISOString().split('T')[0];

      if (dailyData[dateString]) {
        dailyData[dateString].push(record);
      }
    });

    return dailyData;
  };

  const dailyData = getDailyData();
  const days = Object.keys(dailyData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  return (
    <div className='fasting-history-graph'>
      <h3>Monthly Overview</h3>
      <div className='graph-container'>
        {days.map((day) => {
          const dayRecords = dailyData[day];
          const hasSuccessfulFast = dayRecords.some((record) => record.completed);
          const hasCheatDay = dayRecords.some((record) => !record.completed && record.duration > 0);

          return (
            <div key={day} className='day-column'>
              <div className='date-label'>{formatDate(day)}</div>
              <div
                className={`day-bar ${!dayRecords.length ? 'empty-day' : ''} ${
                  hasCheatDay ? 'cheat-day' : ''
                } ${hasSuccessfulFast ? 'successful-day' : ''}`}
              >
                {dayRecords.map((record, index) => {
                  // Calculate position and width of eating window
                  const startOfDay = new Date(day);
                  const startTime = new Date(record.startTime);
                  const endTime = new Date(record.endTime);

                  // Convert to percentage of day (0-100%)
                  const dayStart = startOfDay.getTime();
                  const dayEnd = dayStart + 24 * 60 * 60 * 1000;

                  const startPercent = Math.max(
                    0,
                    ((startTime.getTime() - dayStart) / (24 * 60 * 60 * 1000)) * 100,
                  );
                  let endPercent = Math.min(
                    100,
                    ((endTime.getTime() - dayStart) / (24 * 60 * 60 * 1000)) * 100,
                  );

                  // Adjust if fast spans multiple days
                  if (endTime.getTime() > dayEnd) {
                    endPercent = 100;
                  }

                  return (
                    <div
                      key={index}
                      className={`eating-window ${record.completed ? 'completed' : 'incomplete'}`}
                      style={{
                        top: `${startPercent}%`,
                        height: `${endPercent - startPercent}%`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FastingHistoryGraph;
