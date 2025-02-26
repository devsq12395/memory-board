import React from 'react';
import NotificationEntry from './NotificationEntry';

interface NotificationPanelProps {
  isOpen: boolean;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen }) => {
  return (
    <div className="relative">
      {isOpen && (
        <div className="absolute top-full right-0 mt-4 w-80 bg-white shadow-lg rounded-lg z-50 border border-red-500">
          <NotificationEntry />
          <NotificationEntry />
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;