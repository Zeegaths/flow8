import React, { createContext, useContext, useState } from 'react';
import { MNEEService } from '../services/MNEEService';

interface MNEEContextType {
  mneeService: MNEEService | null;
  isInitialized: boolean;
  error: string | null;
}

const MNEEContext = createContext<MNEEContextType>({
  mneeService: null,
  isInitialized: false,
  error: null,
});

export const MNEEProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // TEMPORARILY DISABLED - Skip MNEE initialization for now
  const [isInitialized] = useState(true); // Pretend it's initialized
  const [error] = useState<string | null>(null);

  console.log('🚧 MNEE Service temporarily disabled - building UI first');

  // Return mock service for now
  return (
    <MNEEContext.Provider value={{ mneeService: null, isInitialized, error }}>
      {children}
    </MNEEContext.Provider>
  );
};

export const useMNEE = () => useContext(MNEEContext);