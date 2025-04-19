import { useEffect, useState } from 'react';
import { FastSettings, FastState, TimeRemaining } from './types';

export function useCountdown(fastState: FastState, settings: FastSettings): TimeRemaining {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: true,
  });

  useEffect(() => {
    if (!fastState.isActive || fastState.startTime === null) {
      setTimeRemaining({
        hours: 0,
        minutes: 0,
        seconds: 0,
        isComplete: true,
      });
      return;
    }

    const calculateTimeRemaining = () => {
      const now = Math.floor(Date.now() / 1000); // current epoch time in seconds
      const startTime = Math.floor(fastState.startTime! / 1000); // start time in seconds
      const endTime = startTime + settings.fastingHours * 60 * 60; // end time in seconds
      const totalSecondsRemaining = Math.max(0, endTime - now);

      const isComplete = totalSecondsRemaining <= 0;

      if (isComplete) {
        return {
          hours: 0,
          minutes: 0,
          seconds: 0,
          isComplete: true,
        };
      }

      const hours = Math.floor(totalSecondsRemaining / 3600);
      const minutes = Math.floor((totalSecondsRemaining % 3600) / 60);
      const seconds = totalSecondsRemaining % 60;

      return {
        hours,
        minutes,
        seconds,
        isComplete: false,
      };
    };

    // Initial calculation
    setTimeRemaining(calculateTimeRemaining());

    // Update countdown every second
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [fastState.isActive, fastState.startTime, settings.fastingHours]);

  return timeRemaining;
}
