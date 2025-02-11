import { useState, useEffect } from 'react';

import OwnersToolbox from "../components/toolbox/OwnersToolbox";

import MapComponent from "../components/common/MapComponent";
import PlacePin from "../components/toolbox/PlacePin";
import Footer from "../components/footer/Footer";
import Drawer from '../components/drawer/Drawer';
import DrawerButton from '../components/drawer/DrawerButton';

import LoginPopup from '../components/auth/LoginPopup';
import PlacePinDetailsPopup from '../components/toolbox/PlacePinDetailsPopup';
import ChooseStickerPopup from '../components/toolbox/ChooseStickerPopup';

import { useToolbox } from '../components/contexts/ToolboxContext';

const Home = () => {
  const toolboxContext = useToolbox();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isChooseStickerPopupOpen, setIsChooseStickerPopupOpen] = useState(false);
  const [chosenSticker, setChosenSticker] = useState<{ name: string; imageUrl: string }>(
    { name: 'Sticker 1', imageUrl: 'https://res.cloudinary.com/dkloacrmg/image/upload/v1717925908/cld-sample-3.jpg' }
  );
  const [pinPosition, setPinPosition] = useState<{ lat: number; lng: number } | null>(null);

  const handleMapClick = (lat: number, lng: number) => {
    setPinPosition({ lat, lng });
  };

  return (
    <div>
      {/* Drawer */}
      <DrawerButton toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} />
      <Drawer 
        isOpen={isDrawerOpen} 
        toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} 
        toggleLoginPopup={() => setIsLoginPopupOpen(!isLoginPopupOpen)} 
      />
      
      {/* Main Components */}
      <OwnersToolbox />
      <MapComponent onMapClick={handleMapClick} />
      <PlacePin pinPosition={pinPosition} />

      {/* Toolbox Components */}
      <button onClick={() => setIsLoginPopupOpen(!isLoginPopupOpen)}>Open Login Popup</button>

      {/* Footer Components */}
      <Footer />

      {/* Popups */}
      {toolboxContext.addingNewMemoryId && chosenSticker && 
        <PlacePinDetailsPopup 
          stickerData={chosenSticker}
          setIsChooseStickerPopupOpen={setIsChooseStickerPopupOpen}
        />
      }
      {isChooseStickerPopupOpen && 
        <ChooseStickerPopup 
          setStickerData={setChosenSticker} 
          onClose={() => setIsChooseStickerPopupOpen(!isChooseStickerPopupOpen)} 
        />
      }
      {isLoginPopupOpen && <LoginPopup onClose={() => setIsLoginPopupOpen(!isLoginPopupOpen)} />}
    </div>
  );
};

export default Home;
