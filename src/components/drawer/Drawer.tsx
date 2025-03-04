import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../lib/supabase';
import Button from '../common/Button';

import { LOGO_LINK, DEFAULT_AVATAR } from '../../constants/constants';

import { useUser } from '../contexts/UserContext';
import { getUserDetailsViaID } from '../../services/profile';
import { logout } from '../../services/authService';

interface DrawerProps {
  isOpen: boolean;
  toggleDrawer: () => void;
  toggleLoginPopup: () => void;
  toggleUserSettingsPopup: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, toggleDrawer, toggleLoginPopup, toggleUserSettingsPopup }) => {
  const { isAuthenticated, setIsAuthenticated, setUid, uid } = useUser();
  const drawerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    user_name: '',
    bio: '',
    avatar_url: DEFAULT_AVATAR,
    email: ''
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!uid){
        setUserData({
          first_name: '',
          last_name: '',
          user_name: '',
          bio: '',
          avatar_url: DEFAULT_AVATAR,
          email: ''
        });
        return;
      }

      const userDetails = await getUserDetailsViaID(uid);
      if (userDetails) {
        const { data: { session } } = await supabase.auth.getSession();
        const email = session?.user?.email || '';

        setUserData({
          first_name: userDetails.first_name,
          last_name: userDetails.last_name,
          user_name: userDetails.user_name,
          bio: userDetails.bio || '',
          avatar_url: userDetails.avatar_url || DEFAULT_AVATAR,
          email: email
        });
      }
    };

    fetchUserDetails();
  }, [uid]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        toggleDrawer();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [toggleDrawer, isOpen]);

  const handleButtonClick = async (btn: string) => {
    switch (btn) {
      case 'Profile':
        navigate(`/${userData.user_name}`);
        window.location.reload();
        break;
      case 'Home':
        navigate('/');
        window.location.reload();
        break;
      case 'Profile Settings':
        toggleUserSettingsPopup();
        break;
      case 'Login':
        toggleLoginPopup();
        break;
      case 'Logout':
        await logout();
        setIsAuthenticated(false);
        setUid(null);
        navigate('/');
        window.location.reload();
        break;
      default:
        break;
    }
  };

  const renderButton = (text: string, action: string) => (
    <Button
      type="button"
      text={text}
      onClick={async () => await handleButtonClick(action)}
      className="w-full text-left"
      styleType="drawer-content"
    />
  );

  return (
    <div ref={drawerRef} className={`fixed top-0 right-0 w-64 md:w-96 h-full bg-white shadow-lg z-50 transition-transform duration-300 ${isOpen ? 'transform-none' : 'translate-x-full'}`}>
      <div className="flex flex-col justify-between h-full">
        {/* Top Part */}
        <div>
          {userData.user_name === '' ? <>
            {/* Header Logo if not logged in */}
            <div>
              <div className="flex justify-center mt-4 cursor-pointer px-4" onClick={() => handleButtonClick('Home')}>
                <img src={LOGO_LINK} alt="Logo" className="w-full h-auto" />
              </div>
              <p className="text-center text-sm text-gray-500 mt-2 pb-6">Created by SQ Software, 2025</p>
              <hr className="border-gray-300" />
            </div>
          </> : <>
            {/* User Info if logged in */}
            <div className="flex items-center p-4 cursor-pointer" onClick={() => handleButtonClick('Profile')}>
              <img src={userData.avatar_url} alt="User Profile" className="h-10 w-10 rounded-full mr-3" />
              <div>
                <p className="font-medium">{userData.first_name} {userData.last_name}</p>
                <p className="text-sm text-gray-500">{userData.email}</p>
              </div>
            </div>
            <hr className="border-gray-300" />
          </>} 

          {/* Contents */}
          {isAuthenticated ? (
            <div>
              {/* Buttons when logged in */}
              {renderButton('Home', 'Home')}
              {renderButton('Profile Settings', 'Profile Settings')}
              {renderButton('Logout', 'Logout')}
            </div>
          ) : (
            <div>
              {/* Buttons when not logged in */}
              {renderButton('Home', 'Home')}
              {renderButton('Login / Signup', 'Login')}
            </div>
          )}
        </div>

        {/* Footer Logo if logged in */}
        {userData.user_name !== '' && (
          <div>
            <hr className="border-gray-300" />
            <div className="flex justify-center mt-4 cursor-pointer px-4" onClick={() => handleButtonClick('Home')}>
              <img src={LOGO_LINK} alt="Logo" className="w-full h-auto" />
            </div>
            <p className="text-center text-sm text-gray-500 mt-2 pb-6">Created by SQ Software, 2025</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drawer;