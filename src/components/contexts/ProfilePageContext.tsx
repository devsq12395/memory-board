import React, { createContext, useState, useContext } from 'react';

interface ProfilePageContextType {
  pageUsername: string | null;
  pageUserID: string | null;

  setPageUsername: React.Dispatch<React.SetStateAction<string | null>>;
  setPageUserID: React.Dispatch<React.SetStateAction<string | null>>;
}

const ProfilePageContext = createContext<ProfilePageContextType | undefined>(undefined);

export const ProfilePageProvider: React.FC = ({ children }) => {
  const [pageUsername, setPageUsername] = useState<string | null>(null);
  const [pageUserID, setPageUserID] = useState<string | null>(null);

  return (
    <ProfilePageContext.Provider value={{ pageUsername, pageUserID, setPageUsername, setPageUserID }}>
      {children}
    </ProfilePageContext.Provider>
  );
};

export const useProfilePage = () => {
  const context = useContext(ProfilePageContext);
  if (!context) {
    throw new Error('useProfilePage must be used within a ProfilePageProvider');
  }
  return context;
};