import React, { createContext, useContext, useState } from 'react';
import { mneeService } from '../services/MNEEService';  // ← Changed to lowercase

interface MNEEContextType {
  mneeService: typeof mneeService;
  isInitialized: boolean;
  error: string | null;
}

const MNEEContext = createContext<MNEEContextType>({
  mneeService: mneeService,  // ← Use mneeService (lowercase)
  isInitialized: false,
  error: null,
});

export const MNEEProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized] = useState(true);
  const [error] = useState<string | null>(null);

  console.log('🔧 MNEE Service temporarily disabled - building UI first');

  // Return mock service for now
  return (
    <MNEEContext.Provider value={{ mneeService, isInitialized, error }}>
      {children}
    </MNEEContext.Provider>
  );
};

export const useMNEE = () => useContext(MNEEContext);