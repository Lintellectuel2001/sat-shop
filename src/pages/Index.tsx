
import React from 'react';
import ModernNavbar from "../components/modern/ModernNavbar";
import Footer from "../components/Footer";
import ModernHeroSection from "../components/modern/ModernHeroSection";
import NewsletterSection from "../components/home/NewsletterSection";
import ModernProductsSection from "../components/modern/ModernProductsSection";
import AdminAccessButton from "../components/home/AdminAccessButton";
import WhatsAppContactButton from "../components/home/WhatsAppContactButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ModernNavbar />
      
      <ModernHeroSection />
      <ModernProductsSection />
      <NewsletterSection />
      <Footer />

      <AdminAccessButton />
      <WhatsAppContactButton />
    </div>
  );
};

export default Index;
