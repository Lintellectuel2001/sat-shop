
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ChatSupportDialog from './ChatSupportDialog';
import { useChat } from '@/hooks/useChat';

const ChatSupportButton = () => {
  const { isOpen, setIsOpen, unreadCount } = useChat();

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full shadow-lg bg-accent hover:bg-accent/90 p-4 h-14 w-14 flex items-center justify-center"
        aria-label="Support en direct"
      >
        <MessageSquare size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>
      
      <ChatSupportDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};

export default ChatSupportButton;
