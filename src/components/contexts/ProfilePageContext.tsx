import React, { createContext, useState, useContext } from 'react';

interface ProfilePageContextType {
  pageUsername: string | null;
  pageUserID: string | null;
  numOfMemories: number;
  numOfMemoriesLimit: number;
  isRefreshUserDetails: boolean;

  setPageUsername: React.Dispatch<React.SetStateAction<string | null>>;
  setPageUserID: React.Dispatch<React.SetStateAction<string | null>>;
  setNumOfMemories: React.Dispatch<React.SetStateAction<number>>;
  setNumOfMemoriesLimit: React.Dispatch<React.SetStateAction<number>>;
  setIsRefreshUserDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfilePageContext = createContext<ProfilePageContextType | undefined>(undefined);

export const ProfilePageProvider: React.FC = ({ children }) => {
  const [pageUsername, setPageUsername] = useState<string | null>(null);
  const [pageUserID, setPageUserID] = useState<string | null>(null);
  const [numOfMemories, setNumOfMemories] = useState<number>(0);
  const [numOfMemoriesLimit, setNumOfMemoriesLimit] = useState<number>(0);
  const [isRefreshUserDetails, setIsRefreshUserDetails] = useState<boolean>(true); // Defaults to true so it will run on start

  return (
    <ProfilePageContext.Provider value={{ 
      pageUsername, setPageUsername, 
      pageUserID, setPageUserID, 
      numOfMemories, setNumOfMemories, 
      numOfMemoriesLimit, setNumOfMemoriesLimit,
      isRefreshUserDetails, setIsRefreshUserDetails
    }}>
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