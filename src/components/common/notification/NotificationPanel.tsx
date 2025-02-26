import React, { useState, useEffect } from 'react';
import { getNotifications } from '../../../services/notificationService';
import NotificationEntry from './NotificationEntry';

import { useUser } from '../../contexts/UserContext';

interface NotificationPanelProps {
  isOpen: boolean;
  notification: any;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const userContext = useUser();

  useEffect(() => {
    async function fetchNotifications() {
      if (!userContext.uid) return;
      const loadedNotifications = await getNotifications(userContext.uid);
      setNotifications(loadedNotifications);
    }
    fetchNotifications();
  }, [userContext.uid, isOpen]);

  return (
    <div className="relative">
      <div className={`absolute top-full right-22 mt-22 w-80 h-96 bg-white shadow-lg rounded-lg z-50 border border-red-500 overflow-y-auto transition-transform duration-300 ease-in-out transform ${isOpen ? 'scale-y-100' : 'scale-y-0'}`} style={{ transformOrigin: 'top' }}>
        {notifications.map((notification) => (
          <NotificationEntry key={Math.random()} notification={notification} />
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;