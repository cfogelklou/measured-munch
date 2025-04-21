export interface FastSettings {
  fastingHours: number;
}

export interface FastState {
  isActive: boolean;
  startTime: number | null; // Epoch milliseconds
}

export type TimeRemaining = {
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
};

export interface FastingRecord {
  startTime: number; // Epoch milliseconds
  endTime: number; // Epoch milliseconds
  durationMs: number; // Duration in milliseconds
  successfull: boolean; // Whether the fast was completed or stopped early
}

export interface FastingHistory {
  records: FastingRecord[];
  longestFast: number; // Duration in hours
  shortestFast: number; // Duration in hours
  successfulFasts: number; // Count of successful fasts
}
