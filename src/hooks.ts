import { useState } from 'react';
import { FastSettings, FastState, FastingHistory, FastingRecord } from './types';

// Local storage keys
export const FAST_SETTINGS_KEY = 'measuredMunch:settings';
export const FAST_STATE_KEY = 'measuredMunch:state';
export const FASTING_HISTORY_KEY = 'measuredMunch:history';

export const SETTINGS_KEYS = [FAST_SETTINGS_KEY, FAST_STATE_KEY, FASTING_HISTORY_KEY];

// Default settings
export const DEFAULT_FASTING_HOURS = 16;
export const MIN_FASTING_MS = 5000; // Minimum fasting duration in milliseconds

export function formatTime(hours: number, minutes: number, seconds: number): string {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

export function formatTimeFromMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return formatTime(hours, minutes, seconds);
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
      console.error(`Error reading from localStorage for key ${key}:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      // Only update if value actually changed
      if (JSON.stringify(storedValue) !== JSON.stringify(value)) {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting localStorage value for key ${key}:`, error);
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
  });

  // Add a new fasting record
  const addHistoryRecord = (record: FastingRecord) => {
    try {
      const updatedHistory = { ...history };

      // Check if record already exists to prevent duplicate entries
      const recordExists = updatedHistory.records.some(
        (r) => r.startTime === record.startTime && r.endTime === record.endTime,
      );

      if (!recordExists) {
        updatedHistory.records = [record, ...updatedHistory.records];

        // Save updated history
        setHistory(updatedHistory);
      }
    } catch (error) {
      console.error('Error adding fasting record:', error);
    }
  };

  // Clear fasting history
  const clearHistory = () => {
    try {
      setHistory({
        records: [],
      });
    } catch (error) {
      console.error('Error clearing fasting history:', error);
    }
  };

  // Return array of functions and state
  return [history, addHistoryRecord, clearHistory];
}

/**
 * Custom hook to clear all local storage data
 * @returns A function to clear all local storage data
 */
export function useLSClearAll(): () => void {
  const clearAll = () => {
    try {
      // Remove all app-related localStorage items
      SETTINGS_KEYS.forEach((key) => {
        window.localStorage.removeItem(key);
      });

      // Since the storage event only fires in other tabs, we need to
      // manually dispatch an event to notify the current tab of changes
      SETTINGS_KEYS.forEach((key) => {
        const event = new StorageEvent('storage', {
          key: key,
          newValue: null,
          oldValue: window.localStorage.getItem(key),
          storageArea: localStorage,
        });
        window.dispatchEvent(event);
      });
    } catch (error) {
      console.error('Error clearing localStorage data:', error);
    }
  };

  return clearAll;
}
