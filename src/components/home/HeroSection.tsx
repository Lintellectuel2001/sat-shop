
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, Star, Play, Shield, Award } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden perspective-container">
      {/* Arrière-plan 3D animé */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grille 3D animée */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:100px_100px] animate-pulse"></div>
        </div>
        
        {/* Sphères flottantes 3D */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-accent-400/30 to-purple-400/30 rounded-full blur-xl animate-float-3d"></div>
        <div className="absolute top-2/3 right-1/4 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-accent-400/20 rounded-full blur-lg animate-float-3d" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-gradient-to-br from-cyan-400/25 to-blue-400/25 rounded-full blur-md animate-float-3d" style={{ animationDelay: '4s' }}></div>
        
        {/* Particules lumineuses */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-accent-400 rounded-full animate-parallax opacity-60"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>

      {/* Effet holographique de fond */}
      <div className="absolute inset-0 holographic opacity-10"></div>

      <div className="container mx-auto px-6 relative z-10 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Contenu textuel avec animations 3D */}
          <div className="space-y-8 transform-gpu">
            {/* Badge premium avec effet néon */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-accent-500/20 to-purple-500/20 backdrop-blur-lg border border-accent-400/30 rounded-full text-white font-semibold neon-glow hover-lift">
              <Sparkles className="w-5 h-5 animate-pulse text-accent-300" />
              <span className="gradient-text">Services Premium IPTV</span>
              <Award className="w-4 h-4 animate-pulse text-yellow-400" />
            </div>

            {/* Titre principal avec effet de machine à écrire */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white">
                L'excellence 
                <br />
                <span className="gradient-text animate-glow inline-block hover-lift">
                  Sat-shop
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                Transformez votre expérience de divertissement avec nos services 
                <span className="text-accent-300 font-semibold"> IPTV premium </span>
                de qualité exceptionnelle.
              </p>
            </div>

            {/* Statistiques avec cartes 3D */}
            <div className="grid grid-cols-3 gap-6 py-8">
              <div className="card-modern bg-white/10 backdrop-blur-lg border-white/20 text-center hover-lift">
                <div className="text-3xl font-bold gradient-text">1000+</div>
                <div className="text-sm text-gray-300">Clients satisfaits</div>
              </div>
              <div className="card-modern bg-white/10 backdrop-blur-lg border-white/20 text-center hover-lift" style={{ animationDelay: '0.2s' }}>
                <div className="text-3xl font-bold gradient-text">24/7</div>
                <div className="text-sm text-gray-300">Support</div>
              </div>
              <div className="card-modern bg-white/10 backdrop-blur-lg border-white/20 text-center hover-lift" style={{ animationDelay: '0.4s' }}>
                <div className="text-3xl font-bold gradient-text">99.9%</div>
                <div className="text-sm text-gray-300">Disponibilité</div>
              </div>
            </div>

            {/* Boutons d'action avec effets 3D avancés */}
            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <Button 
                onClick={() => navigate('/marketplace')}
                className="bg-gradient-to-r from-accent-500 to-purple-600 hover:from-accent-600 hover:to-purple-700 text-white px-8 py-6 rounded-2xl font-semibold text-lg shadow-2xl hover-lift neon-glow group transform-gpu"
              >
                <Play className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                Explorer nos services
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/contact')}
                className="bg-white/10 backdrop-blur-lg border-white/30 text-white hover:bg-white/20 px-8 py-6 rounded-2xl font-semibold text-lg hover-lift group transform-gpu"
              >
                <Shield className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                Nous contacter
              </Button>
            </div>

            {/* Indicateur de fonctionnalités */}
            <div className="flex items-center gap-8 pt-8 border-t border-white/20">
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Streaming HD/4K</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span className="text-sm">Multi-appareils</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                <span className="text-sm">Support 24/7</span>
              </div>
            </div>
          </div>

          {/* Zone visuelle 3D interactive */}
          <div className="relative perspective-container">
            {/* Conteneur principal avec effet de lévitation */}
            <div className="relative transform-gpu hover-lift">
              {/* Cercles concentriques animés */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-96 h-96 border border-accent-400/30 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
                <div className="absolute w-80 h-80 border border-purple-400/20 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
                <div className="absolute w-64 h-64 border border-pink-400/15 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
              </div>

              {/* Image centrale avec effets 3D */}
              <div className="relative z-10 transform-gpu hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-400/20 to-purple-400/20 rounded-3xl blur-2xl animate-glow"></div>
                <img 
                  src="/lovable-uploads/a580d33f-4553-4993-a451-83a3d067be07.png"
                  alt="Services IPTV Premium"
                  className="relative w-full h-auto rounded-3xl shadow-2xl transform-gpu"
                  style={{ 
                    filter: 'drop-shadow(0 25px 50px rgba(99, 102, 241, 0.3))',
                    transformStyle: 'preserve-3d'
                  }}
                />
              </div>

              {/* Éléments flottants interactifs */}
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-r from-accent-400 to-purple-400 rounded-2xl animate-bounce-gentle hover-lift neon-glow flex items-center justify-center">
                <Zap className="w-8 h-8 text-white animate-pulse" />
              </div>

              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-r from-pink-400 to-accent-400 rounded-full animate-pulse-3d flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>

              <div className="absolute top-1/4 -right-12 w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg animate-tilt flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Effet de vague liquide en bas */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-20 fill-white">
          <path d="M0,60L48,65C96,70,192,80,288,75C384,70,480,50,576,45C672,40,768,50,864,60C960,70,1056,80,1152,75L1200,70L1200,120L0,120Z" className="animate-pulse"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
