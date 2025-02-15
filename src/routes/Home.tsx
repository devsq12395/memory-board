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
import MemoryDetailsPopup from '../components/memory-details/MemoryDetailsPopup';
import ImageViewer from '../components/common/ImageViewer';
import UserSettingsPopup from '../components/settings/UserSettingsPopup';

import { useToolbox } from '../components/contexts/ToolboxContext';
import { usePopups } from '../components/contexts/PopupsContext';

const Home = () => {
  const toolboxContext = useToolbox();
  const popupsContext = usePopups();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isChooseStickerPopupOpen, setIsChooseStickerPopupOpen] = useState(false);
  const [isMemoryDetailsPopupOpen, setIsMemoryDetailsPopupOpen] = useState(false);
  const [isUserSettingsPopupOpen, setIsUserSettingsPopupOpen] = useState(false);
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);

  const [isTriggerDelayedRefresh, setIsTriggerDelayedRefresh] = useState(false);
  const [chosenSticker, setChosenSticker] = useState<{ name: string; imageUrl: string }>(
    { name: 'Sticker 1', imageUrl: 'https://res.cloudinary.com/dkloacrmg/image/upload/v1717925908/cld-sample-3.jpg' }
  );
  const [pinPosition, setPinPosition] = useState<{ lat: number; lng: number } | null>(null);

  const handleMapClick = (lat: number, lng: number) => {
    setPinPosition({ lat, lng });
  };

  // Delayed refresh of the pins
  useEffect(() => {
    if (isTriggerDelayedRefresh) {
      const timeoutId = setTimeout(() => {
        toolboxContext.setIsRefreshPins(true);
        setIsTriggerDelayedRefresh(false);
        console.log ('refreshing');
      }, 200);

      return () => clearTimeout(timeoutId);
    }
  }, [isTriggerDelayedRefresh]);
  

  return (
    <div>
      {/* Drawer */}
      <DrawerButton toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} />
      <Drawer 
        isOpen={isDrawerOpen} 
        toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} 
        toggleLoginPopup={() => setIsLoginPopupOpen(!isLoginPopupOpen)} 
        toggleUserSettingsPopup={() => setIsUserSettingsPopupOpen(!isUserSettingsPopupOpen)}
      />
      
      {/* Main Components */}
      <OwnersToolbox />
      <MapComponent 
        onMapClick={handleMapClick} 
        setSelectedMemoryId={setSelectedMemoryId}
        setIsMemoryDetailsPopupOpen={setIsMemoryDetailsPopupOpen}
      />
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
          setIsTriggerDelayedRefresh={setIsTriggerDelayedRefresh}
        />
      }
      {isChooseStickerPopupOpen && 
        <ChooseStickerPopup 
          setStickerData={setChosenSticker} 
          onClose={() => setIsChooseStickerPopupOpen(!isChooseStickerPopupOpen)} 
        />
      }
      {isMemoryDetailsPopupOpen && 
        <MemoryDetailsPopup 
          memoryId={selectedMemoryId || ''} 
          onClose={() => setIsMemoryDetailsPopupOpen(false)} 
        />
      }
      {isLoginPopupOpen && <LoginPopup onClose={() => setIsLoginPopupOpen(!isLoginPopupOpen)} />}
      <ImageViewer />
      <UserSettingsPopup 
        isShow={isUserSettingsPopupOpen}
        onClose={() => setIsUserSettingsPopupOpen(!isUserSettingsPopupOpen)} 
      />
    </div>
  );1
};

export default Home;
