import React, { useEffect, useRef, useState } from 'react';
import supabase from '../../lib/supabase';
import Button from '../common/Button';

import { useUser } from '../contexts/UserContext';
import { getUserDetailsViaID } from '../../services/profile';

interface DrawerProps {
  isOpen: boolean;
  toggleDrawer: () => void;
  toggleLoginPopup: () => void;
  toggleUserSettingsPopup: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, toggleDrawer, toggleLoginPopup, toggleUserSettingsPopup }) => {
  const { isAuthenticated, setIsAuthenticated, setUid, uid } = useUser();
  const drawerRef = useRef<HTMLDivElement>(null);

  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    avatar_url: 'https://res.cloudinary.com/dkloacrmg/image/upload/v1717925908/cld-sample-3.jpg',
    email: ''
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!uid){
        setUserData({
          first_name: '',
          last_name: '',
          bio: '',
          avatar_url: 'https://res.cloudinary.com/dkloacrmg/image/upload/v1717925908/cld-sample-3.jpg',
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
          bio: userDetails.bio || '',
          avatar_url: userDetails.avatar_url || 'https://res.cloudinary.com/dkloacrmg/image/upload/v1717925908/cld-sample-3.jpg',
          email: email
        });
      }
    };

    fetchUserDetails();
  }, [uid]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        toggleDrawer();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleDrawer, isOpen]);

  const handleButtonClick = async (btn: string) => {
    switch (btn) {
      case 'Profile Settings':
        toggleUserSettingsPopup();
        break;
      case 'Login':
        toggleLoginPopup();
        break;
      case 'Logout':
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        setUid(null);
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
      className="w-full"
      styleType="drawer-content"
    />
  );

  return (
    <div ref={drawerRef} className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transition-transform duration-300 ${isOpen ? 'transform-none' : 'translate-x-full'}`}>
      {/* User Info */}
      <div className="flex items-center p-4">
        <img src={userData.avatar_url} alt="User Profile" className="h-10 w-10 rounded-full mr-3" />
        <div>
          <p className="font-medium">{userData.first_name} {userData.last_name}</p>
          <p className="text-sm text-gray-500">{userData.email}</p>
        </div>
      </div>
      <hr className="border-gray-300" />

      {/* Contents */}
      {isAuthenticated ? (
        <div>
          {/* Buttons when logged in */}
          {renderButton('Profile Settings', 'Profile Settings')}
          {renderButton('Logout', 'Logout')}
        </div>
      ) : (
        <div>
          {/* Buttons when not logged in */}
          {renderButton('Login / Signup', 'Login')}
        </div>
      )}
    </div>
  );
};

export default Drawer;