import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-white to-secondary">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            Découvrez l'excellence <br />
            avec <span className="text-accent">Sat-shop</span>
          </h1>
          <p className="text-lg text-primary/80 leading-relaxed">
            Explorez notre sélection premium de services IPTV, conçue pour 
            transformer votre expérience de divertissement.
          </p>
          <div className="pt-4">
            <Button 
              onClick={() => navigate('/marketplace')}
              className="bg-accent hover:bg-accent/90 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Explorer nos services
              <span className="inline-block ml-2">→</span>
            </Button>
          </div>
        </div>
        <div className="lg:w-1/2">
          <img 
            src="/lovable-uploads/a580d33f-4553-4993-a451-83a3d067be07.png"
            alt="Illustration de services IPTV"
            className="w-full h-auto rounded-2xl shadow-elegant"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;