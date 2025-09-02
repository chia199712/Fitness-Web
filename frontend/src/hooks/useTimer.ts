import { useState, useEffect, useRef, useCallback } from 'react';

interface TimerConfig {
  initialTime?: number; // in seconds
  countdown?: boolean;
  autoStart?: boolean;
  onComplete?: () => void;
}

interface TimerState {
  time: number;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
}

interface TimerControls {
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  addTime: (seconds: number) => void;
  setTime: (seconds: number) => void;
}

export function useTimer({
  initialTime = 0,
  countdown = false,
  autoStart = false,
  onComplete
}: TimerConfig = {}): [TimerState, TimerControls] {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const pausedTimeRef = useRef<number>(0);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused) {
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current) / 1000);
        
        if (countdown) {
          const newTime = Math.max(0, initialTime - elapsed);
          setTime(newTime);
          
          if (newTime === 0) {
            setIsRunning(false);
            setIsCompleted(true);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            onComplete?.();
          }
        } else {
          setTime(initialTime + elapsed);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (isPaused && isRunning) {
        pausedTimeRef.current = Date.now() - startTimeRef.current;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, initialTime, countdown, onComplete]);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    setIsCompleted(false);
    pausedTimeRef.current = 0;
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTime(initialTime);
    pausedTimeRef.current = 0;
    setIsCompleted(false);
  }, [initialTime]);

  const reset = useCallback(() => {
    setTime(initialTime);
    pausedTimeRef.current = 0;
    setIsCompleted(false);
    if (!isRunning) {
      setIsPaused(false);
    }
  }, [initialTime, isRunning]);

  const addTime = useCallback((seconds: number) => {
    setTime(prev => prev + seconds);
  }, []);

  const setTimerTime = useCallback((seconds: number) => {
    setTime(seconds);
    if (countdown && seconds === 0 && isRunning) {
      setIsRunning(false);
      setIsCompleted(true);
      onComplete?.();
    }
  }, [countdown, isRunning, onComplete]);

  const state: TimerState = {
    time,
    isRunning,
    isPaused,
    isCompleted
  };

  const controls: TimerControls = {
    start,
    pause,
    resume,
    stop,
    reset,
    addTime,
    setTime: setTimerTime
  };

  return [state, controls];
}

// Helper functions for formatting time
export function formatTime(seconds: number, includeHours = false): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (includeHours || hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function parseTimeString(timeString: string): number {
  const parts = timeString.split(':').map(Number);
  
  if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  
  return 0;
}