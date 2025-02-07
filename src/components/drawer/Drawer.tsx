import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DrawerProps {
  isOpen: boolean;
  toggleDrawer: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, toggleDrawer }) => {
  return (
    <div className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transition-transform duration-300 ${isOpen ? 'transform-none' : 'translate-x-full'}`}>
      <button onClick={toggleDrawer} className="absolute top-2 left-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300">
        <XMarkIcon className="h-5 w-5 text-gray-800" />
      </button>
      <hr className="mt-10 border-gray-300" />
    </div>
  );
};

export default Drawer;