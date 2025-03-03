import React, { createContext, useContext, useState } from 'react';
import './AlertContext.css';
import { MdCheckCircle, MdInfo, MdWarning } from 'react-icons/md';
import { IoCloseCircle } from 'react-icons/io5';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <MdCheckCircle />;
      case 'error':
        return <IoCloseCircle />;  // 새로운 에러 아이콘
      case 'info':
        return <MdInfo />;
      case 'warning':
        return <MdWarning />;
      default:
        return null;
    }
  };

  const showAlert = (message, type = 'success') => {
    return new Promise((resolve) => {
      const newAlert = {
        id: Date.now(),
        message,
        type
      };
      
      setAlerts(prev => [...prev, newAlert]);
      
      setTimeout(() => {
        setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
        resolve();
      }, 3000);
    });
  };

  return (
    <AlertContext.Provider value={{ alerts, showAlert }}>
      {children}
      {alerts.length > 0 && (
        <div className="alert-container">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`alert-message alert-${alert.type}`}
            >
              {getIcon(alert.type)}
              <span className="alert-text">{alert.message}</span>
            </div>
          ))}
        </div>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}; 