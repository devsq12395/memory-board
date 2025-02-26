import React, { useEffect, useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { getNumberOfUninteractedNotifications } from '../../../services/notificationService';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';

interface NotificationButtonProps {
  toggleNotification: () => void;
  children?: React.ReactNode;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({ toggleNotification, children }) => {
  const { uid } = useUser();
  const [uninteractedCount, setUninteractedCount] = useState<number>(0);

  useEffect(() => {
    const fetchCount = async () => {
      if (uid) {
        const count = await getNumberOfUninteractedNotifications(uid);
        setUninteractedCount(count);
      }
    };
    fetchCount();
  }, [uid]);

  return (
    <div className="relative">
      <Button 
        type="button"
        icon={faBell}
        styleType="top-right-button"
        className="fixed top-5 right-20 z-50 rounded-full cursor-pointer"
        iconSize='text-lg'
        onClick={toggleNotification}
      />
      {uninteractedCount > 0 && (
        <span className="absolute top-2 right-20 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-52">
          {uninteractedCount}
        </span>
      )}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black bg-white z-50"></div>
      {children && <div>{children}</div>}
    </div>
  );
};

export default NotificationButton;