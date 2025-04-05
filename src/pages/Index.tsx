
import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/home/HeroSection";
import NewsletterSection from "../components/home/NewsletterSection";
import ProductsSection from "../components/home/ProductsSection";
import HeroCarousel from "../components/home/HeroCarousel";
import AdminAccessButton from "../components/home/AdminAccessButton";
import WhatsAppContactButton from "../components/home/WhatsAppContactButton";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <HeroCarousel />
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
