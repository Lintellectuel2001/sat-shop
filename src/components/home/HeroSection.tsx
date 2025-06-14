
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, Star } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="section-spacing bg-gradient-to-br from-white via-primary-50 to-accent-50 relative overflow-hidden">
      {/* Éléments décoratifs en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-accent-200/30 to-purple-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-br from-pink-200/30 to-accent-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        {/* Éléments géométriques flottants */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-gradient-to-r from-accent-400/20 to-purple-400/20 rounded-lg animate-bounce-gentle"></div>
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-gradient-to-r from-pink-400/20 to-accent-400/20 rounded-full animate-float"></div>
        
        {/* Particules lumineuses */}
        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-accent-400 rounded-full animate-bounce-gentle"></div>
        <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-glow" style={{ animationDelay: '5s' }}></div>
        <div className="absolute top-1/2 left-1/5 w-1 h-1 bg-pink-400 rounded-full animate-float" style={{ animationDelay: '10s' }}></div>
      </div>

      <div className="container-modern relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Contenu textuel */}
          <div className="lg:w-1/2 space-y-8 animate-fade-in">
            {/* Badge de statut */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-medium font-body">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Services Premium IPTV</span>
              <Star className="w-3 h-3 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Titre principal avec nouvelle typographie */}
            <div className="space-y-6">
              <h1 className="font-heading leading-tight">
                Découvrez l'excellence avec{" "}
                <span className="gradient-text font-display">Sat-shop</span>
              </h1>
              
              <p className="text-xl text-primary-600 leading-relaxed max-w-2xl font-body">
                Explorez notre sélection premium de services IPTV, conçue pour 
                transformer votre expérience de divertissement avec une qualité exceptionnelle.
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={() => navigate('/marketplace')}
                className="btn-modern group font-sans"
              >
                Explorer nos services
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/contact')}
                className="btn-secondary group font-sans"
              >
                <Zap className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Nous contacter
              </Button>
            </div>

            {/* Statistiques */}
            <div className="flex items-center gap-8 pt-8 border-t border-primary-200">
              <div className="text-center card-modern p-4">
                <div className="text-2xl font-bold text-primary-900 gradient-text font-display">1000+</div>
                <div className="text-sm text-primary-600 font-body">Clients satisfaits</div>
              </div>
              <div className="text-center card-modern p-4">
                <div className="text-2xl font-bold text-primary-900 gradient-text font-display">24/7</div>
                <div className="text-sm text-primary-600 font-body">Support disponible</div>
              </div>
              <div className="text-center card-modern p-4">
                <div className="text-2xl font-bold text-primary-900 gradient-text font-display">99.9%</div>
                <div className="text-sm text-primary-600 font-body">Disponibilité</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="lg:w-1/2 animate-scale-in">
            <div className="relative">
              {/* Effet de glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-400/20 to-purple-400/20 rounded-3xl blur-2xl transform rotate-3 animate-glow"></div>
              
              <img 
                src="/lovable-uploads/a580d33f-4553-4993-a451-83a3d067be07.png"
                alt="Illustration de services IPTV premium"
                className="relative w-full h-auto rounded-3xl shadow-modern"
                style={{ filter: 'drop-shadow(0 25px 50px rgba(99, 102, 241, 0.15))' }}
              />
              
              {/* Badge flottant */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-modern animate-bounce-gentle">
                <div className="text-2xl animate-pulse">⚡</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Effet de vague en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;
