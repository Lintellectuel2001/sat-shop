
import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/home/HeroSection";
import NewsletterSection from "../components/home/NewsletterSection";
import ProductsSection from "../components/home/ProductsSection";
import DigitalSlideshow from "../components/home/DigitalSlideshow";
import AdminAccessButton from "../components/home/AdminAccessButton";
import WhatsAppContactButton from "../components/home/WhatsAppContactButton";

// NOTE: This page already uses components that require React Router and React Query
// These will be properly provided by our updated App.tsx and main.tsx setup

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <DigitalSlideshow />
      <HeroSection />
      <ProductsSection />
      <NewsletterSection />
      <Footer />

      <AdminAccessButton />
      <WhatsAppContactButton />
    </div>
  );
};

export default Index;
