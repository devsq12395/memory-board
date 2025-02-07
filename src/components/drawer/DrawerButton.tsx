import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';

interface DrawerButtonProps {
  toggleDrawer: () => void;
}

const DrawerButton: React.FC<DrawerButtonProps> = ({ toggleDrawer }) => {
  return (
    <button onClick={toggleDrawer} className={`fixed top-5 right-5 z-50 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-transform duration-300`}>
      <Bars3Icon className="h-6 w-6 text-gray-800" />
    </button>
  );
};

export default DrawerButton;