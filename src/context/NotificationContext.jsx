import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((title, message, type = 'info') => {
    const newNotif = {
      id: Date.now().toString(),
      title,
      message,
      type,
      time: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotif, ...prev].slice(0, 50)); // Keep last 50
    setUnreadCount(prev => prev + 1);
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
