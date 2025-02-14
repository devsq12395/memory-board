import React, { createContext, useState, useContext } from 'react';

interface PopupsContextType {
  curImageID: string | null;
  setCurImageID: (value: string | null) => void;
  isImagePopupOpen: boolean;
  setIsImagePopupOpen: (value: boolean) => void;
}

const PopupsContext = createContext<PopupsContextType | undefined>(undefined);

export const PopupsProvider: React.FC = ({ children }) => {
  const [curImageID, setCurImageID] = useState<string | null>(null);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState<boolean>(false);

  return (
    <PopupsContext.Provider value={{ curImageID, setCurImageID, isImagePopupOpen, setIsImagePopupOpen }}>
      {children}
    </PopupsContext.Provider>
  );
};

export const usePopups = () => {
  const context = useContext(PopupsContext);
  if (!context) {
    throw new Error('usePopups must be used within a PopupsProvider');
  }
  return context;
};