
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useMarketingNotifications } from '@/hooks/useMarketingNotifications';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NotificationsMenuProps {
  userId: string;
}

const NotificationsMenu = ({ userId }: NotificationsMenuProps) => {
  const { notifications, unreadCount, markAsRead } = useMarketingNotifications(userId);

  const handleNotificationClick = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative border-secondary hover:bg-secondary hover:text-accent transition-all duration-300"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-2 min-w-[20px] h-5 bg-accent hover:bg-accent"
              variant="secondary"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[350px] p-0 overflow-hidden rounded-xl border border-secondary shadow-elegant"
      >
        <div className="bg-accent text-white py-3 px-4 font-semibold">
          Notifications
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Aucune notification
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                className={cn(
                  "flex flex-col items-start p-4 space-y-1 cursor-pointer border-b border-gray-100 hover:bg-secondary transition-colors",
                  !notification.is_read && "bg-soft"
                )}
              >
                <div className="font-medium text-primary">{notification.title}</div>
                <div className="text-sm text-muted-foreground">{notification.message}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(notification.created_at).toLocaleDateString()}
                </div>
                {!notification.is_read && (
                  <Badge variant="secondary" className="mt-2 bg-accent text-white">Nouveau</Badge>
                )}
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsMenu;
