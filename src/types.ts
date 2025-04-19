export interface FastSettings {
  fastingHours: number;
}

export interface FastState {
  isActive: boolean;
  startTime: number | null;
}

export type TimeRemaining = {
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
};