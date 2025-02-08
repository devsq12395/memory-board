import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useUser } from '../contexts/UserContext';

interface DrawerProps {
  isOpen: boolean;
  toggleDrawer: () => void;
  toggleLoginPopup: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, toggleDrawer, toggleLoginPopup }) => {
  const { isAuthenticated, setIsAuthenticated, setUid } = useUser();

  const handleAuthButtonClick = () => {
    if (isAuthenticated) {
      // Logout functionality
      setIsAuthenticated(false);
      setUid(null);
    } else {
      toggleLoginPopup();
    }
  };

  return (
    <div className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transition-transform duration-300 ${isOpen ? 'transform-none' : 'translate-x-full'}`}>
      {/* Close button */}
      <button onClick={toggleDrawer} className="absolute top-2 left-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300 cursor-pointer">
        <XMarkIcon className="h-5 w-5 text-gray-800" />
      </button>
      <hr className="mt-10 border-gray-300" />

      {/* Contents */}
      <div
        className="px-4 py-2 mt-2 bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer border-b border-gray-300"
        onClick={handleAuthButtonClick}
      >
        {isAuthenticated ? 'Logout' : 'Login / Signup'}
      </div>
    </div>
  );
};

export default Drawer;