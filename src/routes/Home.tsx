import React, { useState } from 'react';
import MapComponent from "../components/common/MapComponent";
import OwnersToolbox from "../components/toolbox/OwnersToolbox";
import PlacePin from "../components/toolbox/PlacePin";
import Footer from "../components/footer/Footer";
import Drawer from '../components/drawer/Drawer';
import DrawerButton from '../components/drawer/DrawerButton';
import LoginPopup from '../components/auth/LoginPopup';


const Home = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [pinPosition, setPinPosition] = useState<{ lat: number; lng: number } | null>(null);

  const toggle = (component: string) => {
    switch (component) {
      case 'drawer':
        setIsDrawerOpen(!isDrawerOpen);
        break;
      case 'loginPopup':
        setIsLoginPopupOpen(!isLoginPopupOpen);
        break;
      default:
        break;
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setPinPosition({ lat, lng });
  };

  return (
    <div>
      {/* Drawer */}
      <DrawerButton toggleDrawer={() => toggle('drawer')} />
      <Drawer 
        isOpen={isDrawerOpen} 
        toggleDrawer={() => toggle('drawer')} 
        toggleLoginPopup={() => toggle('loginPopup')} 
      />
      
      {/* Main Components */}
      <OwnersToolbox />
      <MapComponent onMapClick={handleMapClick} />
      <PlacePin pinPosition={pinPosition} />

      {/* Toolbox Components */}
      {/* Footer Components */}
      <Footer />
      <button onClick={() => toggle('loginPopup')}>Open Login Popup</button>
      {isLoginPopupOpen && <LoginPopup onClose={() => toggle('loginPopup')} />}
    </div>
  );
};

export default Home;
