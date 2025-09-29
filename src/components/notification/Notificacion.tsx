import React, { useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import "./Notification.css";

export type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationProps {
  message: string;
  type?: NotificationType;
  onClose: () => void;
  duration?: number; // ms
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type = "info",
  onClose,
  duration = 2000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const iconMap = {
    success: <FaCheckCircle className="notif-icon" />,
    error: <FaTimesCircle className="notif-icon" />,
    info: <FaInfoCircle className="notif-icon" />,
    warning: <FaExclamationTriangle className="notif-icon" />,
  };

  return (
    <div className={`notification notification-${type}`}>
      {iconMap[type]}
      <span>{message}</span>
    </div>
  );
};

export default Notification;
