
import React from 'react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Message } from '@/hooks/useChat';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === 'user';
  const timestamp = new Date(message.timestamp);
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true, locale: fr });

  return (
    <div className={cn(
      "flex",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-2",
        isUser 
          ? "bg-accent text-white rounded-br-none" 
          : "bg-muted text-primary rounded-bl-none"
      )}>
        <div className="text-sm">{message.content}</div>
        <div className={cn(
          "text-xs mt-1", 
          isUser ? "text-white/70" : "text-muted-foreground"
        )}>
          {timeAgo}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
