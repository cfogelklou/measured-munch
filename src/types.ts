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
  duration: number; // Duration in hours
  completed: boolean; // Whether the fast was completed or stopped early
}

export interface CheatDayState {
  remainingDays: number; // Remaining cheat days for the current week
  lastResetDate: number; // Last date when cheat days were reset (epoch milliseconds)
}

export interface FastingHistory {
  records: FastingRecord[];
  longestFast: number; // Duration in hours
  shortestFast: number; // Duration in hours
  successfulFasts: number; // Count of successful fasts
}

