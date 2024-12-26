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
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';

const Index = () => {
  const slides = [
    {
      title: "Moments en famille",
      description: "Partagez des moments inoubliables avec vos proches",
      image: "/lovable-uploads/d5a2fef2-4158-4ee4-b25e-8492028478d8.png",
      color: "from-pink-500",
    },
    {
      title: "Divertissement à la maison",
      description: "Profitez du meilleur du divertissement depuis votre canapé",
      image: "/lovable-uploads/93f4a4d3-0266-4de9-adcb-0b83e06ef79a.png",
      color: "from-green-500",
    },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (emblaApi) {
      const intervalId = setInterval(() => {
        emblaApi.scrollNext();
      }, 10000);

      return () => clearInterval(intervalId);
    }
  }, [emblaApi]);

  const onApiChange = React.useCallback((api: UseEmblaCarouselType[1]) => {
    if (api) {
      console.log('Carousel initialized');
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Carousel Section */}
      <section className="w-full bg-white">
        <Carousel className="w-full" setApi={onApiChange}>
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[70vh] max-h-[500px] sm:h-[calc(100vh-4rem)] w-full overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} to-transparent opacity-60`} />
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover object-[50%_10%] sm:object-[50%_25%]"
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
      </section>

      <HeroSection />
      <ProductsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;