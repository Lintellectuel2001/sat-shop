import React from 'react';
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
import Autoplay from "embla-carousel-autoplay";

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

const Index = () => {
  const plugin = React.useMemo(
    () =>
      Autoplay({
        delay: 8000,
        stopOnInteraction: false,
      }),
    []
  );

  return (
    <div className="min-h-screen">
      <div className="flex flex-col lg:flex-row items-start gap-8 bg-white pt-8 px-4">
        {/* Hero Section - Left side */}
        <div className="lg:w-1/2 pt-8">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Découvrez l'excellence <br />
            avec <span className="text-accent">Sat-shop</span>
          </h1>
          <p className="text-lg text-primary/80 leading-relaxed mb-8">
            Explorez notre sélection premium de services IPTV, conçue pour 
            transformer votre expérience de divertissement.
          </p>
        </div>

        {/* Carousel Section - Right side */}
        <div className="lg:w-1/2">
          <Carousel 
            className="w-full" 
            opts={{ 
              loop: true,
            }}
            plugins={[plugin]}
          >
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[400px] w-full overflow-hidden rounded-2xl">
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
      </div>

      <ProductsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;