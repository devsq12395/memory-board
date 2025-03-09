import React from 'react';
import { ToolboxProvider } from './ToolboxContext';
import { UserProvider } from './UserContext';
import { APIProvider } from '@vis.gl/react-google-maps';
import { PopupsProvider } from './PopupsContext';
import { SystemProvider } from './SystemContext';
import { ProfilePageProvider } from './ProfilePageContext';
import { ShopProvider } from './ShopContext';
import Shop from '../../routes/Shop';

interface ContextProvidersProps {
  children: React.ReactNode;
}

const ContextProviders: React.FC<ContextProvidersProps> = ({ children }) => {
  return (
    <SystemProvider>
      <UserProvider>
        <ProfilePageProvider>
          <PopupsProvider>
            <ShopProvider>
              <ToolboxProvider>
                <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_ID as string}>
                  {children}
                </APIProvider>
              </ToolboxProvider>
            </ShopProvider>
          </PopupsProvider>
        </ProfilePageProvider>
      </UserProvider>
    </SystemProvider>
  );
};

export default ContextProviders;