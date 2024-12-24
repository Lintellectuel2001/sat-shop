import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-32 pb-16 px-4 bg-white">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-1/2 animate-fade-up">
          <p className="text-accent text-lg mb-4">
            Découvrez nos services premium 🌟
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8 text-primary">
            Services IPTV, Sharing et VOD de qualité
          </h1>
          <button 
            onClick={() => navigate('/marketplace')}
            className="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            Découvrir nos offres
            <span className="inline-block">→</span>
          </button>
        </div>
        <div className="lg:w-1/2 mt-8 lg:mt-0 relative">
          <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-[#ffd700] rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute -z-10 bottom-0 right-20 w-48 h-48 bg-[#ff69b4] rounded-full opacity-30 blur-3xl"></div>
          <img
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
            alt="Hero"
            className="rounded-2xl shadow-lg relative z-10"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;