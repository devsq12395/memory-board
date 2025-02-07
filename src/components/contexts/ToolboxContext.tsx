import React, { createContext, useState, useContext } from 'react';

interface ToolboxContextType {
  isPlacingPin: boolean;
  setIsPlacingPin: (value: boolean) => void;
}

const ToolboxContext = createContext<ToolboxContextType | undefined>(undefined);

export const ToolboxProvider: React.FC = ({ children }) => {
  const [isPlacingPin, setIsPlacingPin] = useState(false);

  return (
    <ToolboxContext.Provider value={{ isPlacingPin, setIsPlacingPin }}>
      {children}
    </ToolboxContext.Provider>
  );
};

export const useToolbox = () => {
  const context = useContext(ToolboxContext);
  if (!context) {
    throw new Error('useToolbox must be used within a ToolboxProvider');
  }
  return context;
};
