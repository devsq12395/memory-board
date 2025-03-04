import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import OwnersToolbox from "../components/toolbox/OwnersToolbox";

import MapComponent from "../components/common/MapComponent";
import PlacePin from "../components/toolbox/PlacePin";
import Footer from "../components/footer/Footer";
import Drawer from '../components/drawer/Drawer';
import DrawerButton from '../components/drawer/DrawerButton';
import MapLogo from '../components/common/MapLogo';

import LoginPopup from '../components/auth/LoginPopup';
import PinDetailsPopup from '../components/toolbox/PinDetailsPopup';
import ChooseStickerPopup from '../components/toolbox/ChooseStickerPopup';
import MemoryDetailsPopup from '../components/memory-details/MemoryDetailsPopup';
import ImageViewer from '../components/common/ImageViewer';
import UserSettingsPopup from '../components/settings/UserSettingsPopup';
import TakePhotoPopup from '../components/toolbox/TakePhotoPopup';

import { useToolbox } from '../components/contexts/ToolboxContext';
import { useUser } from '../components/contexts/UserContext';
import { usePopups } from '../components/contexts/PopupsContext';
import { useProfilePage } from '../components/contexts/ProfilePageContext';
import { getUserDetails } from '../services/profile';

import LoginButton from '../components/common/LoginButton';
import NotificationButton from '../components/common/notification/NotificationButton';
import NotificationPanel from '../components/common/notification/NotificationPanel';

const Home = () => {
  const toolboxContext = useToolbox();
  const popupsContext = usePopups();
  const userContext = useUser();
  const profilePageContext = useProfilePage();

  const { username: pageUsername } = useParams<{ username: string }>();
  const { memoryId: pageMemoryId } = useParams<{ memoryId: string }>();

  const [pageUserID, setPageUserID] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
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

  // Set which user this page is about
  useEffect(() => {
    if (pageUsername) {
      const fetchUserID = async () => {
        const userDetails = await getUserDetails(pageUsername);
        if (userDetails) {
          setPageUserID(userDetails.user_id);
          toolboxContext.setIsRefreshPins(true);

          profilePageContext.setPageUsername(pageUsername);
          profilePageContext.setPageUserID(userDetails.user_id);
        } else {
          setPageUserID(null);
        }
      };
      fetchUserID();
    } else {
      toolboxContext.setIsRefreshPins(true);
    }
  }, [pageUsername]);

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

  useEffect(() => {
    if (pageMemoryId) {
      setSelectedMemoryId(pageMemoryId);
      setIsMemoryDetailsPopupOpen(true);
    }
  }, [selectedMemoryId]);

  const closeMemoryDetailsPopup = () => {
    setIsMemoryDetailsPopupOpen(false);
    setSelectedMemoryId(null);

    window.history.pushState({}, '', 
      `${profilePageContext.pageUsername ? `/${profilePageContext.pageUsername}` : '/'}`
    );
  };

  return (
    <div>
      {/* Top Right Buttons */}
      {!userContext.isAuthenticated ? <>
        <LoginButton 
          toggleLoginPopup={() => setIsLoginPopupOpen(!isLoginPopupOpen)}
        />
      </>:<>
        <NotificationButton 
          toggleNotification={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
        >
          <NotificationPanel 
            isOpen={isNotificationPanelOpen} 
          />
        </NotificationButton>
      </>}
      <DrawerButton toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} />

      {/* Drawer */}
      <Drawer 
        isOpen={isDrawerOpen} 
        toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} 
        toggleLoginPopup={() => setIsLoginPopupOpen(!isLoginPopupOpen)} 
        toggleUserSettingsPopup={() => setIsUserSettingsPopupOpen(!isUserSettingsPopupOpen)}
      />
      
      {/* Main Components */}
      {pageUserID && pageUserID == userContext.uid && <OwnersToolbox />}
      <MapComponent 
        onMapClick={handleMapClick} 
        pageUserID={pageUserID}
        setSelectedMemoryId={setSelectedMemoryId}
        setIsMemoryDetailsPopupOpen={setIsMemoryDetailsPopupOpen}
      />
      <PlacePin pinPosition={pinPosition} />
      <MapLogo />

      {/* Toolbox Components */}
      <button onClick={() => setIsLoginPopupOpen(!isLoginPopupOpen)}>Open Login Popup</button>

      {/* Footer Components */}
      <Footer 
        pageUserID={pageUserID}
      />

      {/* Popups */}
      <PinDetailsPopup 
        mode='place'
        stickerData={chosenSticker}
        setIsChooseStickerPopupOpen={setIsChooseStickerPopupOpen}
        setIsTriggerDelayedRefresh={setIsTriggerDelayedRefresh}
      />
      {isChooseStickerPopupOpen && 
        <ChooseStickerPopup 
          setStickerData={setChosenSticker} 
          onClose={() => setIsChooseStickerPopupOpen(!isChooseStickerPopupOpen)} 
        />
      }
      {isMemoryDetailsPopupOpen && 
        <MemoryDetailsPopup 
          memoryId={selectedMemoryId || ''} 
          onClose={closeMemoryDetailsPopup} 
          pageUserID={pageUserID || ''}
        />
      }
      {isLoginPopupOpen && <LoginPopup onClose={() => setIsLoginPopupOpen(!isLoginPopupOpen)} />}
      <ImageViewer />
      <UserSettingsPopup 
        isShow={isUserSettingsPopupOpen}
        onClose={() => setIsUserSettingsPopupOpen(!isUserSettingsPopupOpen)} 
      />

      <TakePhotoPopup />
    </div>
  );
};

export default Home;
