import React, { createContext, useState, useContext } from 'react';

interface ShopContextType {
  isBuyMemoryPopupOpen: boolean;
  isCartPopupOpen: boolean;

  setIsBuyMemoryPopupOpen: (value: boolean) => void;
  setIsCartPopupOpen: (value: boolean) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC = ({ children }) => {
  const [isBuyMemoryPopupOpen, setIsBuyMemoryPopupOpen] = useState<boolean>(false);
  const [isCartPopupOpen, setIsCartPopupOpen] = useState<boolean>(false);

  return (
    <ShopContext.Provider value={{ 
      isBuyMemoryPopupOpen, setIsBuyMemoryPopupOpen,
      isCartPopupOpen, setIsCartPopupOpen
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};