import React from 'react';
import Notification from './Notification';
import type { Notification as NotificationType } from '../utils/types';

interface NotificationContainerProps {
  notifications: NotificationType[];
  onRemove: (id: string) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onRemove,
}) => {
  console.log(
    'NotificationContainer rendering with notifications:',
    notifications
  );

  if (notifications.length === 0) {
    console.log('No notifications to display');
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => onRemove(notification.id)}
          duration={notification.duration}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
