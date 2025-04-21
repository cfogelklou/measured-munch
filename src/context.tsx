import React, { createContext, JSX, useContext, useEffect, useCallback } from 'react';
import { FastSettings, FastState, FastingHistory, FastingRecord } from './types';
import {
  useLSFastingHours,
  useLSCurrentFastingState,
  useLSHistory,
  useLSClearAll,
  FAST_SETTINGS_KEY,
  FAST_STATE_KEY,
  FASTING_HISTORY_KEY,
} from './hooks';
import { dbg } from './debug';

export type LSContextType = {
  fastingSettings: FastSettings;
  setFastingSettings: (settings: FastSettings) => void;
  fastingState: FastState;
  setFastingState: (state: FastState) => void;
  history: FastingHistory;
  addHistoryRecord: (record: FastingRecord) => void;
  setHistoryToEmpty: () => void;
  clearAll: () => void;
};

const LSContext = createContext<LSContextType | undefined>(undefined);

export const LSProvider: React.FC<{ children: React.ReactNode }> = ({ children }): JSX.Element => {
  const [fastingSettings, setFastingSettings] = useLSFastingHours();
  const [fastingState, setFastingState] = useLSCurrentFastingState();
  const [history, addHistoryRecord, setHistoryToEmpty] = useLSHistory();
  const clearAll = useLSClearAll();

  // Function to sync context with localStorage
  const syncWithLocalStorage = useCallback(() => {
    dbg.log('Syncing with localStorage...');
    try {
      const settingsStr = window.localStorage.getItem(FAST_SETTINGS_KEY);
      if (settingsStr) {
        const parsedSettings = JSON.parse(settingsStr);
        setFastingSettings(parsedSettings);
      }

      const stateStr = window.localStorage.getItem(FAST_STATE_KEY);
      if (stateStr) {
        const parsedState = JSON.parse(stateStr);
        setFastingState(parsedState);
      }

      const historyStr = window.localStorage.getItem(FASTING_HISTORY_KEY);
      if (historyStr) {
        // We don't directly set history here because that would bypass the proper
        // calculation of stats in the useLSHistory hook
        const parsedHistory = JSON.parse(historyStr);
        if (parsedHistory && JSON.stringify(parsedHistory) !== JSON.stringify(history)) {
          setHistoryToEmpty(); // Reset first to avoid merging issues

          // Then add each record if there are any
          if (parsedHistory.records && parsedHistory.records.length > 0) {
            // Add each record individually to ensure stats are properly calculated
            parsedHistory.records.forEach((record: FastingRecord) => {
              addHistoryRecord(record);
            });
          }
        }
      }
    } catch (error) {
      console.error('Error syncing with localStorage:', error);
    }
  }, [setFastingSettings, setFastingState, setHistoryToEmpty, addHistoryRecord, history]);

  // Listen for storage changes triggered in other tabs/components
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      dbg.log('Storage event detected:', event);
      if (!event.key || !event.newValue) return;

      try {
        if (event.key === FAST_SETTINGS_KEY) {
          setFastingSettings(JSON.parse(event.newValue));
        } else if (event.key === FAST_STATE_KEY) {
          setFastingState(JSON.parse(event.newValue));
        } else if (event.key === FASTING_HISTORY_KEY) {
          // For history, we need to parse and then rebuild the records
          // to ensure stats are correctly calculated
          const newHistory = JSON.parse(event.newValue);
          if (newHistory && JSON.stringify(newHistory) !== JSON.stringify(history)) {
            setHistoryToEmpty(); // Clear first

            // Then add each record if there are any
            if (newHistory.records && newHistory.records.length > 0) {
              newHistory.records.forEach((record: FastingRecord) => {
                addHistoryRecord(record);
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error parsing storage event value for ${event.key}:`, error);
      }
    };

    // Initial sync
    syncWithLocalStorage();

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [
    setFastingSettings,
    setFastingState,
    history,
    setHistoryToEmpty,
    addHistoryRecord,
    syncWithLocalStorage,
  ]);

  const contextValue: LSContextType = {
    fastingSettings,
    setFastingSettings,
    fastingState,
    setFastingState,
    history,
    addHistoryRecord,
    setHistoryToEmpty,
    clearAll,
  };

  return <LSContext.Provider value={contextValue}>{children}</LSContext.Provider>;
};

export const useLSContext = (): LSContextType => {
  const context: LSContextType | undefined = useContext(LSContext);
  if (!context) {
    throw new Error('useLSContext must be used within a LSProvider');
  }
  return context;
};
