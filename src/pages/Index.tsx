import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/home/HeroSection";
import NewsletterSection from "../components/home/NewsletterSection";
import ProductsSection from "../components/home/ProductsSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect } from "react";
import useEmblaCarousel from 'embla-carousel-react';

const Index = () => {
  const slides = [
    {
      title: "Divertissement à la maison",
      description: "Profitez du meilleur du divertissement depuis votre canapé",
      image: "/lovable-uploads/93f4a4d3-0266-4de9-adcb-0b83e06ef79a.png",
      color: "from-green-500",
    },
    {
      title: "Moments en famille",
      description: "Partagez des moments inoubliables avec vos proches",
      image: "/lovable-uploads/d5a2fef2-4158-4ee4-b25e-8492028478d8.png",
      color: "from-pink-500",
    },
  ];

  const [api] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (api) {
      const intervalId = setInterval(() => {
        api.scrollNext();
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(intervalId);
    }
  }, [api]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Carousel Section */}
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto px-4">
          <Carousel className="w-full max-w-5xl mx-auto" setApi={api}>
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[600px] w-full overflow-hidden rounded-xl">
                    <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} to-transparent opacity-60`} />
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 p-8 text-white">
                      <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
                      <p className="text-lg">{slide.description}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </section>

      <HeroSection />
      <ProductsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;