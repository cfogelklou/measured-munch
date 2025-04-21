import { useState } from 'react';
import { FastSettings, FastState, FastingHistory, FastingRecord } from './types';

// Local storage keys
export const FAST_SETTINGS_KEY = 'measuredMunch:settings';
export const FAST_STATE_KEY = 'measuredMunch:state';
export const FASTING_HISTORY_KEY = 'measuredMunch:history';

export const SETTINGS_KEYS = [FAST_SETTINGS_KEY, FAST_STATE_KEY, FASTING_HISTORY_KEY];

// Default settings
const DEFAULT_FASTING_HOURS = 16;

export function formatTime(hours: number, minutes: number, seconds: number): string {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

export function msToHours(ms: number): number {
  return ms / (1000 * 60 * 60.0);
}

/*
 * Custom hook to manage local storage state
 * @param key - The key under which the value is stored in local storage
 * @param initialValue - The initial value to set if the key does not exist
 * @returns A tuple containing the stored value and a function to update it
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting localStorage value:', error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Custom hook to manage fasting hours in local storage
 * @returns A tuple containing the fasting settings and a function to update them
 */
export function useLSFastingHours(): [FastSettings, (settings: FastSettings) => void] {
  return useLocalStorage<FastSettings>(FAST_SETTINGS_KEY, {
    fastingHours: DEFAULT_FASTING_HOURS,
  });
}

/**
 * Custom hook to manage current fasting state in local storage
 * @returns A tuple containing the fasting state and a function to update it
 */
export function useLSCurrentFastingState(): [FastState, (state: FastState) => void] {
  return useLocalStorage<FastState>(FAST_STATE_KEY, {
    isActive: false,
    startTime: null,
  });
}

/**
 * Custom hook to manage fasting history in local storage
 * @returns A tuple containing the fasting history, a function to add a record, and a function to clear history
 */
export function useLSHistory(): [FastingHistory, (record: FastingRecord) => void, () => void] {
  const [history, setHistory] = useLocalStorage<FastingHistory>(FASTING_HISTORY_KEY, {
    records: [],
    longestFast: 0,
    shortestFast: Infinity,
    successfulFasts: 0,
  });

  // Add a new fasting record
  const addRecord = (record: FastingRecord) => {
    const updatedHistory = { ...history };
    updatedHistory.records = [record, ...updatedHistory.records].slice(0, 30); // Keep last 30 records

    if (record.successfull) {
      updatedHistory.successfulFasts += 1;
    }

    const durationInHours = msToHours(record.durationMs);

    if (durationInHours > updatedHistory.longestFast) {
      updatedHistory.longestFast = durationInHours;
    }

    if (updatedHistory.shortestFast <= 0 || durationInHours <= updatedHistory.shortestFast) {
      updatedHistory.shortestFast = durationInHours;
    }

    setHistory(updatedHistory);
  };

  // Clear fasting history
  const clearHistory = () => {
    setHistory({
      records: [],
      longestFast: 0,
      shortestFast: Infinity,
      successfulFasts: 0,
    });
  };

  // Return array of functions and state
  return [history, addRecord, clearHistory];
}

/**
 * Custom hook to clear all local storage data
 * @returns A function to clear all local storage data
 */
export function useLSClearAll(): () => void {
  return () => {
    SETTINGS_KEYS.forEach((key) => {
      window.localStorage.removeItem(key);
    });
  };
}
