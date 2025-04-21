import React, { createContext, JSX, useContext, useEffect } from 'react';
import { FastSettings, FastState, FastingHistory, FastingRecord } from './types';
import {
  useLSFastingHours,
  useLSCurrentFastingState,
  useLSHistory,
  useLSClearAll,
  FAST_SETTINGS_KEY,
} from './hooks';

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

  // Optionally listen for storage changes triggered in other tabs/components
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === FAST_SETTINGS_KEY && event.newValue) {
        try {
          setFastingSettings(JSON.parse(event.newValue));
        } catch (error) {
          console.error('Error parsing storage event value:', error);
        }
      }
      // Add similar checks for other keys if needed.
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [setFastingSettings]);

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
