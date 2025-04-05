
import React from "react";
import { MessageCircleQuestion } from "lucide-react";

const WhatsAppContactButton = () => {
  const openWhatsAppChat = () => {
    const phoneNumber = "213669254864";
    const message = "Bonjour, j'ai une question concernant vos services Sat-shop.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button 
      onClick={openWhatsAppChat}
      className="fixed bottom-24 right-4 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:bg-[#1FAA59] transition-colors duration-300 z-50"
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircleQuestion className="h-6 w-6" />
    </button>
  );
};

export default WhatsAppContactButton;
