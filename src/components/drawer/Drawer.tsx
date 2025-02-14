import React, { useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useUser } from '../contexts/UserContext';
import supabase from '../../lib/supabase';
import Button from '../common/Button';

interface DrawerProps {
  isOpen: boolean;
  toggleDrawer: () => void;
  toggleLoginPopup: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, toggleDrawer, toggleLoginPopup }) => {
  const { isAuthenticated, setIsAuthenticated, setUid } = useUser();
  const drawerRef = useRef<HTMLDivElement>(null);

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
        <img src="/path/to/profile.jpg" alt="User Profile" className="h-10 w-10 rounded-full mr-3" />
        <div>
          <p className="font-medium">Sandra Adams</p>
          <p className="text-sm text-gray-500">sandra_a88@gmail.com</p>
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