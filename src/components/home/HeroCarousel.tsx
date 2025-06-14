import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

type Slide = {
  id: string;
  title: string;
  description?: string;
  image: string;
  color: string;
  text_color?: string;
  order: number;
}

const HeroCarousel = () => {
  const { toast } = useToast();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showText, setShowText] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  
  const plugin = useMemo(
    () =>
      Autoplay({
        delay: 6000,
        stopOnInteraction: true,
      }),
    []
  );

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data, error } = await supabase
          .from('slides')
          .select('*')
          .order('order', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        setSlides(data || []);
      } catch (error) {
        console.error('Error fetching slides:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les slides",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlides();
  }, [toast]);

  // Reset text visibility and show after 2 seconds when slides change
  useEffect(() => {
    setShowText(false);
    const timer = setTimeout(() => {
      setShowText(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [slides]);

  // Handle slide changes using the carousel API
  useEffect(() => {
    if (!api) {
      return;
    }

    const handleSlideChange = () => {
      setShowText(false);
      setTimeout(() => setShowText(true), 2000);
    };

    api.on("select", handleSlideChange);

    return () => {
      api.off("select", handleSlideChange);
    };
  }, [api]);

  if (isLoading) {
    return <div className="w-full bg-white pt-16 h-[85vh] max-h-[800px] flex items-center justify-center">
      <p>Chargement...</p>
    </div>;
  }

  return (
    <section className="w-full bg-white pt-16">
      <Carousel 
        className="w-full max-w-[2000px] mx-auto" 
        opts={{ 
          loop: true,
        }}
        plugins={[plugin]}
        setApi={setApi}
      >
        <CarouselContent>
          {slides.map((slide: Slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[85vh] max-h-[800px] w-full overflow-hidden group cursor-pointer">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-[50%_5%] sm:object-[50%_25%]
                  transition-transform duration-1000 ease-out
                  group-hover:scale-110 group-hover:rotate-1"
                />
                
                <div 
                  className={`absolute inset-0 bg-gradient-to-r ${slide.color} to-transparent 
                  opacity-60 transition-all duration-700 ease-in-out 
                  group-hover:opacity-40 group-hover:backdrop-blur-sm`}
                />
                
                <div 
                  className={`absolute bottom-0 left-0 right-0 p-8 
                  bg-gradient-to-t from-black/50 to-transparent
                  transform transition-all duration-500 ease-out
                  ${showText ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
                  ${slide.text_color || 'text-white'}`}
                >
                  <h3 
                    className={`text-2xl font-bold mb-2 
                    transform transition-all duration-500 delay-100
                    ${showText ? 'translate-x-0' : 'translate-x-10'}
                    drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]`}
                  >
                    {slide.title}
                  </h3>
                  
                  {slide.description && (
                    <p 
                      className={`text-lg
                      transform transition-all duration-500 delay-200
                      ${showText ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                      drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]`}
                    >
                      {slide.description}
                    </p>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious 
          className="left-4 opacity-70 hover:opacity-100
          transition-all duration-300 ease-in-out
          backdrop-blur-sm bg-white/20 hover:bg-white/40
          border-0 shadow-lg"
        />
        <CarouselNext 
          className="right-4 opacity-70 hover:opacity-100
          transition-all duration-300 ease-in-out
          backdrop-blur-sm bg-white/20 hover:bg-white/40
          border-0 shadow-lg"
        />
      </Carousel>
    </section>
  );
};

export default HeroCarousel;
