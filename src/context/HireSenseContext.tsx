'use client';

import { createContext, useContext, ReactNode } from 'react';
import useHireSense from '@/lib/hooks/useHireSense';

// Create context with default values
const HireSenseContext = createContext<ReturnType<typeof useHireSense> | undefined>(undefined);

// Provider component
export const HireSenseProvider = ({ children }: { children: ReactNode }) => {
  const hireSense = useHireSense();
  
  return (
    <HireSenseContext.Provider value={hireSense}>
      {children}
    </HireSenseContext.Provider>
  );
};

// Custom hook to use the context
export const useHireSenseContext = () => {
  const context = useContext(HireSenseContext);
  
  if (context === undefined) {
    throw new Error('useHireSenseContext must be used within a HireSenseProvider');
  }
  
  return context;
};