
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from './use-toast';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'support';
  timestamp: string;
}

interface ChatState {
  messages: Message[];
  isOpen: boolean;
  loading: boolean;
  unreadCount: number;
  setIsOpen: (isOpen: boolean) => void;
  sendMessage: (content: string) => void;
  resetUnreadCount: () => void;
}

// Mock support agent responses
const supportResponses = [
  "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
  "Merci pour votre question. Je vais vérifier cela pour vous.",
  "Bien sûr, je serais heureux de vous aider avec cela.",
  "Pour cette question spécifique, je vous recommande de consulter notre page FAQ.",
  "Veuillez patienter un moment pendant que je recherche les informations dont vous avez besoin.",
  "Avez-vous essayé de redémarrer l'application ?",
  "Je comprends votre préoccupation. Laissez-moi vous aider à résoudre ce problème.",
  "Merci pour votre patience. Y a-t-il autre chose que je puisse faire pour vous ?",
  "N'hésitez pas à nous contacter à nouveau si vous avez d'autres questions."
];

// Helper function to get a random response
const getRandomResponse = () => {
  const randomIndex = Math.floor(Math.random() * supportResponses.length);
  return supportResponses[randomIndex];
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isOpen: false,
  loading: false,
  unreadCount: 0,
  setIsOpen: (isOpen) => set({ isOpen }),
  sendMessage: (content) => {
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    set((state) => ({ 
      messages: [...state.messages, userMessage],
      loading: true 
    }));
    
    // Simulate support agent response
    setTimeout(() => {
      const supportMessage: Message = {
        id: uuidv4(),
        content: getRandomResponse(),
        sender: 'support',
        timestamp: new Date().toISOString(),
      };
      
      set((state) => ({
        messages: [...state.messages, supportMessage],
        loading: false,
        unreadCount: state.isOpen ? state.unreadCount : state.unreadCount + 1
      }));
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  },
  resetUnreadCount: () => set({ unreadCount: 0 }),
}));

export const useChat = () => {
  const chatStore = useChatStore();
  const { toast } = useToast();

  // Enhanced version with toast notifications
  const sendMessage = (content: string) => {
    chatStore.sendMessage(content);
    
    // If chat is closed, show toast notification when support responds
    if (!chatStore.isOpen) {
      setTimeout(() => {
        toast({
          title: "Nouveau message du support",
          description: "Vous avez reçu une réponse à votre message",
        });
      }, 1000 + Math.random() * 2000);
    }
  };

  return {
    ...chatStore,
    sendMessage,
  };
};
