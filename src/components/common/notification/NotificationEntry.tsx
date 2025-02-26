import React from 'react';

const NotificationEntry: React.FC = () => {
  return (
    <div className="flex items-center p-4 border-b border-gray-200">
      <img src="placeholder.png" alt="Notification" className="w-12 h-12 rounded-full mr-4" />
      <div className="flex-1">
        <div className="text-gray-900">This is a notification text placeholder.</div>
        <div className="text-gray-500 text-sm">XX hours ago</div>
      </div>
    </div>
  );
};

export default NotificationEntry;