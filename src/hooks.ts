import { useState } from 'react';
import { FastSettings, FastState } from './types';

// Local storage keys
const FAST_SETTINGS_KEY = 'measuredMunch:settings';
const FAST_STATE_KEY = 'measuredMunch:state';

// Default settings
const DEFAULT_FASTING_HOURS = 16;

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

export function useFastSettings(): [FastSettings, (settings: FastSettings) => void] {
  return useLocalStorage<FastSettings>(FAST_SETTINGS_KEY, {
    fastingHours: DEFAULT_FASTING_HOURS,
  });
}

export function useFastState(): [FastState, (state: FastState) => void] {
  return useLocalStorage<FastState>(FAST_STATE_KEY, {
    isActive: false,
    startTime: null,
  });
}
