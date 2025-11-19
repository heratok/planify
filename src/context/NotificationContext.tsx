import React, { createContext, useState, useCallback } from 'react';
import type { Notification, NotificationType } from '../utils/types';
import NotificationContainer from '../components/NotificationContainer';

interface NotificationContextType {
  addNotification: (
    type: NotificationType,
    message: string,
    duration?: number
  ) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export { NotificationContext };

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  console.log(
    'NotificationProvider rendering with notifications:',
    notifications
  );

  const addNotification = useCallback(
    (type: NotificationType, message: string, duration = 4000) => {
      const id =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const notification: Notification = {
        id,
        type,
        message,
        duration,
      };

      console.log('Adding notification:', notification);
      setNotifications((prev) => {
        const newNotifications = [...prev, notification];
        console.log('Current notifications:', newNotifications);
        return newNotifications;
      });
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    addNotification,
    removeNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </NotificationContext.Provider>
  );
};
