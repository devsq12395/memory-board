import React, { createContext, useState, useContext } from 'react';

interface UserContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  uid: string | null;
  setUid: (value: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ isAuthenticated, setIsAuthenticated, uid, setUid }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};