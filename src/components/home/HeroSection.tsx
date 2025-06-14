
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="section-spacing bg-gradient-to-br from-white via-primary-50 to-accent-50 relative overflow-hidden">
      {/* Éléments décoratifs en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-accent-200/30 to-purple-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-br from-pink-200/30 to-accent-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container-modern relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Contenu textuel */}
          <div className="lg:w-1/2 space-y-8 animate-fade-in">
            {/* Badge de statut */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Services Premium IPTV</span>
            </div>

            {/* Titre principal */}
            <div className="space-y-6">
              <h1 className="leading-tight">
                Découvrez l'excellence avec{" "}
                <span className="gradient-text">Sat-shop</span>
              </h1>
              
              <p className="text-xl text-primary-600 leading-relaxed max-w-2xl">
                Explorez notre sélection premium de services IPTV, conçue pour 
                transformer votre expérience de divertissement avec une qualité exceptionnelle.
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={() => navigate('/marketplace')}
                className="btn-modern group"
              >
                Explorer nos services
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/contact')}
                className="btn-secondary group"
              >
                <Zap className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Nous contacter
              </Button>
            </div>

            {/* Statistiques ou indicateurs de confiance */}
            <div className="flex items-center gap-8 pt-8 border-t border-primary-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-900">1000+</div>
                <div className="text-sm text-primary-600">Clients satisfaits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-900">24/7</div>
                <div className="text-sm text-primary-600">Support disponible</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-900">99.9%</div>
                <div className="text-sm text-primary-600">Disponibilité</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="lg:w-1/2 animate-scale-in">
            <div className="relative">
              {/* Effet de glow derrière l'image */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-400/20 to-purple-400/20 rounded-3xl blur-2xl transform rotate-3"></div>
              
              <img 
                src="/lovable-uploads/a580d33f-4553-4993-a451-83a3d067be07.png"
                alt="Illustration de services IPTV premium"
                className="relative w-full h-auto rounded-3xl shadow-modern hover-lift"
              />
              
              {/* Badge flottant */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-modern animate-bounce-gentle">
                <div className="text-2xl">⚡</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
