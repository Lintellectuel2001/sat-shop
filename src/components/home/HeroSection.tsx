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
          <button 
            onClick={() => navigate('/marketplace')}
            className="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            Découvrir nos offres
            <span className="inline-block">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;