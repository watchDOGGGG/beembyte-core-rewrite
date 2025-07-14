
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Bell, CheckCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Notification {
  id: string;
  type: 'task-accepted' | 'task-completed' | 'message' | 'deadline';
  title: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  taskId?: string;
  responderId?: string;
}

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

export const NotificationItem = ({ notification, onRead }: NotificationItemProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    if (!notification.isRead) {
      onRead(notification.id);
    }
    
    // Navigate based on notification type
    if (notification.taskId) {
      if (notification.type === 'message') {
        navigate(`/chat/${notification.taskId}`);
      } else {
        navigate(`/task/${notification.taskId}`);
      }
    }
  };
  
  const getIcon = () => {
    switch (notification.type) {
      case 'task-accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'task-completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'deadline':
        return <Calendar className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-beembyte-blue" />;
    }
  };
  
  return (
    <div
      className={cn(
        "p-3 border-b transition-all cursor-pointer",
        notification.isRead ? "bg-white dark:bg-gray-800" : "bg-beembyte-softBlue dark:bg-beembyte-darkBlue/40",
        isHovered && "bg-gray-50 dark:bg-gray-700"
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h4 className={cn(
            "text-sm font-medium",
            !notification.isRead && "font-semibold"
          )}>
            {notification.title}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {notification.content}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
          </p>
        </div>
        {!notification.isRead && (
          <div className="h-2 w-2 rounded-full bg-beembyte-blue flex-shrink-0 mt-2"></div>
        )}
      </div>
    </div>
  );
};
