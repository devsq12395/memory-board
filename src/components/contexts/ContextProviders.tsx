import React from 'react';
import { ToolboxProvider } from './ToolboxContext';
import { UserProvider } from './UserContext';
import { APIProvider } from '@vis.gl/react-google-maps';

const ContextProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <UserProvider>
      <ToolboxProvider>
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_ID as string}>
          {children}
        </APIProvider>
      </ToolboxProvider>
    </UserProvider>
  );
};

export default ContextProviders;