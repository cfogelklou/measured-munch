import { useState, useEffect } from 'react';
import { FastSettings, FastState, FastingHistory, FastingRecord, CheatDayState } from './types';

// Local storage keys
export const FAST_SETTINGS_KEY = 'measuredMunch:settings';
export const FAST_STATE_KEY = 'measuredMunch:state';
export const FASTING_HISTORY_KEY = 'measuredMunch:history';
export const CHEAT_DAY_KEY = 'measuredMunch:cheatDays';

export const SETTINGS_KEYS = [
  FAST_SETTINGS_KEY,
  FAST_STATE_KEY,
  FASTING_HISTORY_KEY,
  CHEAT_DAY_KEY,
];


// Default settings
const DEFAULT_FASTING_HOURS = 16;
const DEFAULT_WEEKLY_CHEAT_DAYS = 2;

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
export function useLSHistory(): [
  FastingHistory, 
  (record: FastingRecord) => void,
  () => void
] {
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
    
    if (record.completed) {
      updatedHistory.successfulFasts += 1;
      
      if (record.duration > updatedHistory.longestFast) {
        updatedHistory.longestFast = record.duration;
      }
      
      if (record.duration < updatedHistory.shortestFast) {
        updatedHistory.shortestFast = record.duration;
      }
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
 * Custom hook to manage cheat days in local storage
 * @returns A tuple containing the cheat day state, a function to manually reset cheat days, and a function to use a cheat day
 */
export function useLSCheatDays(): [
  CheatDayState, 
  () => void, 
  () => boolean
] {
  const [cheatDayState, setCheatDayState] = useLocalStorage<CheatDayState>(CHEAT_DAY_KEY, {
    remainingDays: DEFAULT_WEEKLY_CHEAT_DAYS,
    lastResetDate: Date.now(),
  });

  // Check if we need to reset cheat days (it's a new week)
  useEffect(() => {
    const checkAndResetWeeklyCheatDays = () => {
      const now = new Date();
      const lastReset = new Date(cheatDayState.lastResetDate);
      
      // Reset on Sunday or if it's been more than 7 days
      const isNewWeek = now.getDay() === 0 && lastReset.getDay() !== 0;
      const isMoreThanWeek = (now.getTime() - lastReset.getTime()) > 7 * 24 * 60 * 60 * 1000;
      
      if (isNewWeek || isMoreThanWeek) {
        setCheatDayState({
          remainingDays: DEFAULT_WEEKLY_CHEAT_DAYS,
          lastResetDate: now.getTime(),
        });
      }
    };
    
    checkAndResetWeeklyCheatDays();
    
    // Check daily
    const interval = setInterval(checkAndResetWeeklyCheatDays, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [cheatDayState.lastResetDate, setCheatDayState]);

  const useCheatDay = () => {
    if (cheatDayState.remainingDays > 0) {
      setCheatDayState({
        ...cheatDayState,
        remainingDays: cheatDayState.remainingDays - 1,
      });
      return true;
    }
    return false;
  };
  
  const manuallyResetCheatDays = () => {
    setCheatDayState({
      remainingDays: DEFAULT_WEEKLY_CHEAT_DAYS,
      lastResetDate: Date.now(),
    });
  };

  return [cheatDayState, manuallyResetCheatDays, useCheatDay];
}

/**
 * Custom hook to clear all local storage data
 * @returns A function to clear all local storage data
 */
export function useLSClearAll(): () => void {
  return () => {
    SETTINGS_KEYS.forEach(key => {
      window.localStorage.removeItem(key);
    });
  };
}
