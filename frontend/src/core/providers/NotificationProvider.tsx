import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationContext } from '@core/providers/NotificationContext';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const notify = (message: string, type: 'success' | 'error' = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-5 right-5 z-50 p-4 rounded-lg backdrop-blur-md border-2 ${
              notification.type === 'error'
                ? 'border-[#FF003C] bg-[rgba(255,0,60,0.1)] text-[#FF003C]'
                : 'border-[#00F0FF] bg-[rgba(0,240,255,0.1)] text-[#00F0FF]'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
};
