import React from 'react';
import { ToolboxProvider } from './ToolboxContext';
import { UserProvider } from './UserContext';
import { APIProvider } from '@vis.gl/react-google-maps';
import { PopupsProvider } from './PopupsContext';
import { SystemProvider } from './SystemContext';

interface ContextProvidersProps {
  children: React.ReactNode;
}

const ContextProviders: React.FC<ContextProvidersProps> = ({ children }) => {
  return (
    <SystemProvider>
      <UserProvider>
        <PopupsProvider>
          <ToolboxProvider>
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_ID as string}>
              {children}
            </APIProvider>
          </ToolboxProvider>
        </PopupsProvider>
      </UserProvider>
    </SystemProvider>
  );
};

export default ContextProviders;