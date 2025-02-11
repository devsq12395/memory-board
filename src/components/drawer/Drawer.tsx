import React from 'react';
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

  const handleButtonClick = async (btn: string) => {
    switch (btn) {
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
    <div className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transition-transform duration-300 ${isOpen ? 'transform-none' : 'translate-x-full'}`}>
      {/* Close button */}
      <button onClick={toggleDrawer} className="absolute top-2 left-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300 cursor-pointer">
        <XMarkIcon className="h-5 w-5 text-gray-800" />
      </button>
      <hr className="mt-10 border-gray-300" />

      {/* Contents */}
      {isAuthenticated ? (
        <div>
          {/* Buttons when logged in */}
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