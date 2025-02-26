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
      className="fixed top-5 right-20 z-50 rounded-full"
      iconSize='text-lg'
      onClick={toggleNotification}
    />
    {children && <div className="absolute top-full right-0 mt-2">{children}</div>}
  </div>
);

export default NotificationButton;