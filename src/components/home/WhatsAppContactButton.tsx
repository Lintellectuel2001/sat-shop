import React from "react";
import { MessageCircleQuestion } from "lucide-react";
const WhatsAppContactButton = () => {
  const openWhatsAppChat = () => {
    const phoneNumber = "213669254864";
    const message = "Bonjour, j'ai une question concernant vos services Sat-shop.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  return <button onClick={openWhatsAppChat} aria-label="Contacter sur WhatsApp" className="fixed bottom-24 right-4 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:bg-[#1FAA59] transition-colors duration-300 z-50 text-base mx-0 my-0 px-[8px] py-[8px]">
      <MessageCircleQuestion className="h-7 w-7" />
    </button>;
};
export default WhatsAppContactButton;