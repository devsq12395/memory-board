import React, { createContext, useState, useContext } from 'react';

interface ToolboxContextType {
  isPlacingPin: boolean;
  isRefreshPins: boolean;
  addingNewMemoryId: string | null;

  sharePhotoUrl: string | null;
  sharePhotoPopupIsOpen: boolean;

  setIsPlacingPin: (value: boolean) => void;
  setIsRefreshPins: (value: boolean) => void;
  setAddingNewMemoryId: (value: string | null) => void;

  setSharePhotoUrl: (value: string | null) => void;
  setSharePhotoPopupIsOpen: (value: boolean) => void;
}

const ToolboxContext = createContext<ToolboxContextType | undefined>(undefined);

export const ToolboxProvider: React.FC = ({ children }) => {
  const [isPlacingPin, setIsPlacingPin] = useState(false);
  const [isRefreshPins, setIsRefreshPins] = useState(false);
  const [addingNewMemoryId, setAddingNewMemoryId] = useState<string | null>(null);
  const [sharePhotoUrl, setSharePhotoUrl] = useState<string | null>(null);
  const [sharePhotoPopupIsOpen, setSharePhotoPopupIsOpen] = useState<boolean>(false);

  return (
    <ToolboxContext.Provider value={{ 
      isPlacingPin, setIsPlacingPin, 
      isRefreshPins, setIsRefreshPins, 
      addingNewMemoryId, setAddingNewMemoryId,
      sharePhotoUrl, setSharePhotoUrl,
      sharePhotoPopupIsOpen, setSharePhotoPopupIsOpen
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
