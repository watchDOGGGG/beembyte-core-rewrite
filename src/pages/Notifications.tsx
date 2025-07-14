
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { NotificationsList } from '@/components/notifications/NotificationsList';
import { Notification } from '@/components/notifications/NotificationItem';
import { toast } from "@/components/ui/sonner";

// In a real app, this would come from an API
const fetchNotifications = (): Promise<Notification[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
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
        {
          id: '4',
          type: 'deadline',
          title: 'Deadline Approaching',
          content: 'Your task "Market Research Report" is due in 24 hours',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
          isRead: false,
          taskId: '4',
        },
        {
          id: '5',
          type: 'task-accepted',
          title: 'Task Accepted',
          content: 'Your statistical analysis task has been accepted',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          isRead: true,
          taskId: '5',
        },
        {
          id: '6',
          type: 'message',
          title: 'New Message',
          content: 'A responder has a question about your task requirements',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
          isRead: true,
          taskId: '6',
        }
      ]);
    }, 500);
  });
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (error) {
        toast.error("Failed to load notifications");
        console.error("Error loading notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    toast.success("All notifications marked as read");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-beembyte-darkBlue shadow-sm rounded-lg">
      <h1 className="text-2xl font-bold p-6 border-b">Your Notifications</h1>

      {isLoading ? (
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-beembyte-blue mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading notifications...</p>
        </div>
      ) : notifications.length > 0 ? (
        <NotificationsList
          notifications={notifications}
          onReadNotification={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      ) : (
        <div className="p-12 text-center">
          <p className="text-gray-500">You don't have any notifications yet</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
