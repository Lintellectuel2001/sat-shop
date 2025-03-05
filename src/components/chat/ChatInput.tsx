
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from '@/hooks/useChat';

const ChatInput = () => {
  const [message, setMessage] = useState('');
  const { sendMessage, loading } = useChat();

  const handleSend = () => {
    if (message.trim() === '') return;
    
    sendMessage(message);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tapez votre message..."
          className="resize-none min-h-[60px]"
          disabled={loading}
        />
        <Button 
          onClick={handleSend}
          disabled={loading || message.trim() === ''}
          className="h-auto"
          aria-label="Envoyer"
        >
          <Send size={18} />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Appuyez sur Entrée pour envoyer, Maj+Entrée pour une nouvelle ligne
      </p>
    </div>
  );
};

export default ChatInput;
