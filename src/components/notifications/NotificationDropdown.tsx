
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { NotificationsList } from './NotificationsList';
import { Notification } from './NotificationItem';
import { useNavigate } from 'react-router-dom';

// Mock data - in a real app, this would come from an API
const getMockNotifications = (): Notification[] => {
  return [
    {
      id: '1',
      type: 'task-accepted',
      title: 'Task Accepted',
      content: 'Your research paper task has been accepted by a responder',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      isRead: false,
      taskId: '1',
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message',
      content: 'You have received a new message about your essay task',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isRead: true,
      taskId: '2',
    },
    {
      id: '3',
      type: 'task-completed',
      title: 'Task Completed',
      content: 'Your content writing task has been completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      isRead: false,
      taskId: '3',
    },
  ];
};

export const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // In a real app, fetch notifications from API
    setNotifications(getMockNotifications());
  }, []);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const handleReadNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
    setOpen(false);
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };
  
  const handleViewAll = () => {
    setOpen(false);
    navigate('/notifications');
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <NotificationsList 
          notifications={notifications.slice(0, 5)}
          onMarkAllAsRead={handleMarkAllAsRead}
          onReadNotification={handleReadNotification}
        />
        <div className="p-2 border-t text-center">
          <Button 
            variant="ghost" 
            className="text-sm w-full"
            onClick={handleViewAll}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
