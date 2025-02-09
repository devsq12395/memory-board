import React, { createContext, useState, useContext } from 'react';

interface ToolboxContextType {
  isPlacingPin: boolean;
  isRefreshPins: boolean;
  addingNewMemoryId: string | null;

  setIsPlacingPin: (value: boolean) => void;
  setIsRefreshPins: (value: boolean) => void;
  setAddingNewMemoryId: (value: string | null) => void;
}

const ToolboxContext = createContext<ToolboxContextType | undefined>(undefined);

export const ToolboxProvider: React.FC = ({ children }) => {
  const [isPlacingPin, setIsPlacingPin] = useState(false);
  const [isRefreshPins, setIsRefreshPins] = useState(false);
  const [addingNewMemoryId, setAddingNewMemoryId] = useState<string | null>(null);

  return (
    <ToolboxContext.Provider value={{ 
      isPlacingPin, setIsPlacingPin, 
      isRefreshPins, setIsRefreshPins,
      addingNewMemoryId, setAddingNewMemoryId
    }}>
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
