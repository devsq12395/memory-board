import React, { createContext, useState, useContext } from 'react';

import { PopupMode } from '../toolbox/EditPinDetailsPopup';

interface PopupsContextType {
  curImageID: string | null;
  isImagePopupOpen: boolean;
  editMemoryPopupMode: PopupMode;
  isMemoryDetailsPopupOpenOnPageStart: boolean;
  refreshMemoryDetailsPopup: boolean;
  isDeleteMemoryPopupOpen: boolean;
  curMemoryId: string | null;
  isBuyMemoryPopupOpen: boolean;

  setCurImageID: (value: string | null) => void;
  setIsImagePopupOpen: (value: boolean) => void;
  setEditMemoryPopupMode: (value: PopupMode) => void;
  setIsMemoryDetailsPopupOpenOnPageStart: (value: boolean) => void;
  setRefreshMemoryDetailsPopup: (value: boolean) => void;
  setIsDeleteMemoryPopupOpen: (value: boolean) => void;
  setCurMemoryId: (value: string | null) => void;
  setIsBuyMemoryPopupOpen: (value: boolean) => void;
}

const PopupsContext = createContext<PopupsContextType | undefined>(undefined);

export const PopupsProvider: React.FC = ({ children }) => {
  const [curImageID, setCurImageID] = useState<string | null>(null);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState<boolean>(false);
  const [editMemoryPopupMode, setEditMemoryPopupMode] = useState<PopupMode>('hidden');
  const [isMemoryDetailsPopupOpenOnPageStart, setIsMemoryDetailsPopupOpenOnPageStart] = useState<boolean>(false);
  const [refreshMemoryDetailsPopup, setRefreshMemoryDetailsPopup] = useState<boolean>(false);

  const [isDeleteMemoryPopupOpen, setIsDeleteMemoryPopupOpen] = useState<boolean>(false);
  const [curMemoryId, setCurMemoryId] = useState<string | null>(null);

  const [isBuyMemoryPopupOpen, setIsBuyMemoryPopupOpen] = useState<boolean>(false);

  return (
    <PopupsContext.Provider value={{ 
      curImageID, isImagePopupOpen, editMemoryPopupMode,
      setCurImageID, setIsImagePopupOpen, setEditMemoryPopupMode,
      isMemoryDetailsPopupOpenOnPageStart, setIsMemoryDetailsPopupOpenOnPageStart,
      refreshMemoryDetailsPopup, setRefreshMemoryDetailsPopup,
      isDeleteMemoryPopupOpen, setIsDeleteMemoryPopupOpen,
      curMemoryId, setCurMemoryId,
      isBuyMemoryPopupOpen, setIsBuyMemoryPopupOpen
    }}>
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