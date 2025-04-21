'use client';

import { createContext, useContext, ReactNode } from 'react';
import useMetProAi from '@/lib/hooks/useMetProAi'; //  adjust the path if necessary

// Create context with default values
const MetProAiContext = createContext<ReturnType<typeof useMetProAi> | undefined>(undefined);

// Provider component
export const MetProAiProvider = ({ children }: { children: ReactNode }) => {
  const metProAi = useMetProAi(); //  useMetProAi hook
  
  return (
    <MetProAiContext.Provider value={metProAi}>
      {children}
    </MetProAiContext.Provider>
  );
};

// Custom hook to use the context
export const useMetProAiContext = () => {
  const context = useContext(MetProAiContext);
  
  if (context === undefined) {
    throw new Error('useMetProAiContext must be used within a MetProAiProvider');
  }
  
  return context;
};
