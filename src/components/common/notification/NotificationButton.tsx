import { faBell } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import React from 'react';

interface NotificationButtonProps {
  toggleNotification: () => void;
  children?: React.ReactNode;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({ toggleNotification, children }) => (
  <div className="relative">
    <Button 
      type="button"
      icon={faBell}
      styleType="top-right-button"
      className="fixed top-5 right-20 z-50 rounded-full cursor-pointer"
      iconSize='text-lg'
      onClick={toggleNotification}
    />
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black bg-white z-50"></div>
    {children && <div>{children}</div>}
  </div>
);

export default NotificationButton;