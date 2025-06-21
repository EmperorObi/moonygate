
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface LoadingContextProps {
  isLoading: boolean;
  progress: number;
  startRouteTransition: () => void;
  endRouteTransition: () => void;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const startRouteTransition = useCallback(() => {
    clearProgressInterval();
    setIsLoading(true);
    setProgress(0); // Start from 0

    // Simulate progress
    let currentProgress = 0;
    progressIntervalRef.current = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 10) + 5; 
      if (currentProgress < 90) {
        setProgress(currentProgress);
      } else {
        setProgress(90); // Hold at 90 until navigation completes
        clearProgressInterval();
      }
    }, 150); 
  }, [clearProgressInterval]);

  const endRouteTransition = useCallback(() => {
    clearProgressInterval();
    setProgress(100);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setProgress(0); 
    }, 300); 
    return () => clearTimeout(timer); // Cleanup timeout on unmount or if called again
  }, [clearProgressInterval]);

  return (
    <LoadingContext.Provider value={{ isLoading, progress, startRouteTransition, endRouteTransition }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function usePageLoading(): LoadingContextProps {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('usePageLoading must be used within a LoadingProvider');
  }
  return context;
}
