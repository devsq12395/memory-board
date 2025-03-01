import React, { createContext, useState, useContext } from 'react';

interface SystemContextType {
  mode: 'desktop' | 'mobile-portrait' | 'mobile-landscape';
  setMode: React.Dispatch<React.SetStateAction<'desktop' | 'mobile-portrait' | 'mobile-landscape'>>;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC = ({ children }) => {
  const [mode, setMode] = useState<'desktop' | 'mobile-portrait' | 'mobile-landscape'>('desktop');

  return (
    <SystemContext.Provider value={{ mode, setMode }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};