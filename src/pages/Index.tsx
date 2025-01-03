import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/home/HeroSection";
import NewsletterSection from "../components/home/NewsletterSection";
import ProductsSection from "../components/home/ProductsSection";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const plugin = React.useMemo(
    () =>
      Autoplay({
        delay: 8000,
        stopOnInteraction: false,
      }),
    []
  );

  const handleAdminAccess = () => {
    if (adminCode === "852654") {
      setIsDialogOpen(false);
      navigate("/admin");
    } else {
      toast({
        variant: "destructive",
        title: "Code incorrect",
        description: "Le code d'accès administrateur est invalide.",
      });
    }
    setAdminCode("");
  };

  return (
    <div className="min-h-screen">
      {/* Admin Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsDialogOpen(true)}
          className="p-3 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors duration-200"
          aria-label="Accès administrateur"
        >
          <Settings className="w-6 h-6 text-primary" />
        </button>
      </div>

      {/* Admin Access Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accès Administrateur</DialogTitle>
            <DialogDescription>
              Veuillez entrer le code d'accès administrateur
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Code d'accès"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdminAccess()}
            />
            <Button onClick={handleAdminAccess} className="w-full">
              Accéder
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Navbar />
      
      {/* Carousel Section */}
      <section className="w-full bg-white pt-16">
        <Carousel 
          className="w-full max-w-[2000px] mx-auto" 
          opts={{ 
            loop: true,
          }}
          plugins={[plugin]}
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[85vh] max-h-[800px] w-full overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} to-transparent opacity-60`} />
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover object-[50%_5%] sm:object-[50%_25%]"
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