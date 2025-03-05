
import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useChat } from '@/hooks/useChat';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

interface ChatSupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChatSupportDialog = ({ open, onOpenChange }: ChatSupportDialogProps) => {
  const { resetUnreadCount } = useChat();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      resetUnreadCount();
    }
  }, [open, resetUnreadCount]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 gap-0 h-[550px] max-h-[90vh] flex flex-col" ref={contentRef}>
        <ChatHeader onClose={() => onOpenChange(false)} />
        <ChatMessages />
        <ChatInput />
      </DialogContent>
    </Dialog>
  );
};

export default ChatSupportDialog;
