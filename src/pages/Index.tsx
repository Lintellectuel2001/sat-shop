import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/home/HeroSection";
import NewsletterSection from "../components/home/NewsletterSection";
import ProductsSection from "../components/home/ProductsSection";
import { UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [accessCode, setAccessCode] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
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

  const handleAccessCode = () => {
    if (accessCode === "852654") {
      setIsDialogOpen(false);
      navigate("/admin");
    } else {
      toast({
        variant: "destructive",
        title: "Code incorrect",
        description: "Veuillez vérifier votre code d'accès",
      });
    }
    setAccessCode("");
  };

  return (
    <div className="min-h-screen">
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

      {/* Admin Access Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <UserCog className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accès Administrateur</DialogTitle>
            <DialogDescription>
              Veuillez entrer le code d'accès pour continuer
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              type="password"
              placeholder="Code d'accès"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAccessCode();
                }
              }}
            />
            <Button onClick={handleAccessCode}>
              Accéder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;