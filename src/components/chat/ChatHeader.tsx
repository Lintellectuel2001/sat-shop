
import React from 'react';
import { X } from 'lucide-react';
import { DialogTitle, DialogHeader } from "@/components/ui/dialog";

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  return (
    <DialogHeader className="border-b py-4 px-6 flex flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <DialogTitle>Support Client</DialogTitle>
      </div>
      <button 
        onClick={onClose}
        className="rounded-full p-1 hover:bg-gray-100 transition-colors"
        aria-label="Fermer"
      >
        <X size={18} />
      </button>
    </DialogHeader>
  );
};

export default ChatHeader;
