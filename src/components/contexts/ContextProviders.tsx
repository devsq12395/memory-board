import React from 'react';
import { ToolboxProvider } from './ToolboxContext';
import { UserProvider } from './UserContext';
import { APIProvider } from '@vis.gl/react-google-maps';
import { PopupsProvider } from './PopupsContext';

interface ContextProvidersProps {
  children: React.ReactNode;
}

const ContextProviders: React.FC<ContextProvidersProps> = ({ children }) => {
  return (
    <UserProvider>
      <PopupsProvider>
        <ToolboxProvider>
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_ID as string}>
            {children}
          </APIProvider>
        </ToolboxProvider>
      </PopupsProvider>
    </UserProvider>
  );
};

export default ContextProviders;