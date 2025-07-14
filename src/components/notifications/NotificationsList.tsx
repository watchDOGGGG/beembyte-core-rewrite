
import { useState } from 'react';
import { NotificationItem, Notification } from './NotificationItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { CheckCheck } from 'lucide-react';

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAllAsRead: () => void;
  onReadNotification: (id: string) => void;
}

export const NotificationsList = ({
  notifications,
  onMarkAllAsRead,
  onReadNotification,
}: NotificationsListProps) => {
  const hasUnread = notifications.some(notification => !notification.isRead);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-medium">Notifications</h3>
        {hasUnread && (
          <Button 
            onClick={onMarkAllAsRead}
            variant="ghost" 
            size="sm"
            className="text-xs h-8 px-2"
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            Mark all as read
          </Button>
        )}
      </div>
      
      <ScrollArea className="h-[400px]">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={onReadNotification}
            />
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p>No notifications yet</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
