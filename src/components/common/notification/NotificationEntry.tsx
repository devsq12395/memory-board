import React from 'react';
import { interactWithNotification } from '../../../services/notificationService';

const NotificationEntry: React.FC<any> = ({ notification }) => {
  const displayText = notification.text.length > 110 ? notification.text.slice(0, 110) + '...' : notification.text;

  const onNotificationClick = async () => {
    await interactWithNotification(notification.id, 1);
    window.location.assign(notification.url);
  };

  const backgroundClass = notification.isInteracted === 0 ? 'bg-blue-50' : 'bg-white';

  return (
    <div className={`flex p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer ${backgroundClass}`} onClick={onNotificationClick}>
      <img src={notification.avatar} alt="Notification" className="w-12 h-12 rounded-full mr-4" />
      <div className="flex-1">
        <div className="text-gray-900">{displayText}</div>
        <div className="text-gray-500 text-sm">XX hours ago</div>
      </div>
    </div>
  );
};

export default NotificationEntry;