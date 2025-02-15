import React, { useEffect} from 'react';
import Popup from '../common/Popup';

import { useUser } from '../contexts/UserContext';
import { getUserDetailsViaID } from '../../services/profile';

interface UserSettingsPopupProps {
  isShow: boolean;
  onClose: () => void;
}

const UserSettingsPopup: React.FC<UserSettingsPopupProps> = ({ isShow, onClose }) => {
  const userContext = useUser();
  let userData = {};

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!isShow || !userContext.uid) return;

      const userDetails = await getUserDetailsViaID(userContext.uid);
      if (userDetails) {
        userData = userDetails;
      }
    };

    fetchUserDetails();
  }, [userContext.uid]);

  return (
    <Popup isShow={isShow} titleText="User Settings">
      <div className="flex flex-col">
        
      </div>
    </Popup>
  );
};

export default UserSettingsPopup;