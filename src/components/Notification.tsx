import React, { useEffect } from 'react';
import type { NotificationType } from '../utils/types';

interface NotificationProps {
  type: NotificationType;
  message: string;
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getTypeStyles = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-500',
          icon: '✓',
          borderColor: 'border-green-500',
        };
      case 'error':
        return {
          bgColor: 'bg-red-500',
          icon: '✕',
          borderColor: 'border-red-500',
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-500',
          icon: '⚠',
          borderColor: 'border-yellow-500',
        };
      case 'info':
      default:
        return {
          bgColor: 'bg-blue-500',
          icon: 'ℹ',
          borderColor: 'border-blue-500',
        };
    }
  };

  const { bgColor, icon } = getTypeStyles(type);

  return (
    <div
      className={`max-w-sm w-full ${bgColor} text-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 transform transition-all duration-300 ease-in-out border-2 border-white`}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-lg font-semibold">{icon}</span>
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-white">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="inline-flex text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white rounded-md p-1"
              onClick={onClose}
            >
              <span className="sr-only">Cerrar</span>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
