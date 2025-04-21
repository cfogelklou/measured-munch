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
  targetMs: number; // Target duration in milliseconds
}

export interface FastingHistory {
  records: FastingRecord[];
}
