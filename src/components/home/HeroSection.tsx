
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, Star, Shield } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="section-spacing bg-gradient-to-br from-white via-primary-50/30 to-accent-50/20 relative overflow-hidden">
      {/* Éléments décoratifs améliorés */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[40rem] h-[40rem] bg-gradient-to-br from-accent-200/20 via-purple-200/15 to-blue-200/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-[35rem] h-[35rem] bg-gradient-to-br from-pink-200/15 via-accent-200/20 to-cyan-200/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-gradient-to-br from-yellow-200/10 to-orange-200/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        
        {/* Particules flottantes */}
        <div className="absolute top-20 right-1/4 w-2 h-2 bg-accent-400 rounded-full animate-bounce-gentle opacity-60"></div>
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-bounce-gentle opacity-40" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-bounce-gentle opacity-50" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container-modern relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-20">
          {/* Contenu textuel amélioré */}
          <div className="lg:w-1/2 space-y-10 animate-fade-in">
            {/* Badge de statut premium */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-accent-100 via-purple-50 to-blue-50 text-accent-700 rounded-2xl text-sm font-semibold shadow-soft border border-accent-200/50 shimmer-effect">
              <Sparkles className="w-5 h-5 text-accent-600" />
              <span>Services Premium IPTV • Qualité 4K</span>
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            </div>

            {/* Titre principal avec effet de gradient animé */}
            <div className="space-y-8">
              <h1 className="leading-tight">
                L'excellence du divertissement avec{" "}
                <span className="gradient-text font-bold">Sat-shop</span>
              </h1>
              
              <p className="text-2xl text-primary-600 leading-relaxed max-w-2xl font-light">
                Plongez dans l'univers du streaming premium avec nos services IPTV 
                de haute qualité. Une expérience de divertissement révolutionnaire 
                vous attend.
              </p>
            </div>

            {/* Boutons d'action avec effets avancés */}
            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <Button 
                onClick={() => navigate('/marketplace')}
                className="btn-modern group text-lg px-12 py-6"
              >
                <Zap className="mr-3 w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                Explorer nos services
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/contact')}
                className="btn-secondary group text-lg px-12 py-6"
              >
                <Shield className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                Support 24/7
              </Button>
            </div>

            {/* Statistiques ou indicateurs de confiance améliorés */}
            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-gradient-to-r from-transparent via-primary-200 to-transparent">
              <div className="text-center group">
                <div className="text-3xl font-bold text-transparent bg-gradient-to-br from-accent-600 to-purple-600 bg-clip-text group-hover:scale-110 transition-transform duration-300">5000+</div>
                <div className="text-sm text-primary-600 font-medium">Clients satisfaits</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-transparent bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text group-hover:scale-110 transition-transform duration-300">24/7</div>
                <div className="text-sm text-primary-600 font-medium">Support disponible</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-transparent bg-gradient-to-br from-blue-600 to-cyan-600 bg-clip-text group-hover:scale-110 transition-transform duration-300">99.9%</div>
                <div className="text-sm text-primary-600 font-medium">Disponibilité</div>
              </div>
            </div>
          </div>

          {/* Image avec effets 3D */}
          <div className="lg:w-1/2 animate-scale-in">
            <div className="relative group">
              {/* Effets de glow multiples */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-400/20 via-purple-400/15 to-blue-400/10 rounded-3xl blur-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-l from-pink-400/10 via-accent-400/15 to-cyan-400/10 rounded-3xl blur-2xl transform -rotate-2 group-hover:-rotate-4 transition-transform duration-700"></div>
              
              <div className="relative overflow-hidden rounded-3xl shadow-floating group-hover:shadow-glow transition-all duration-700">
                <img 
                  src="/lovable-uploads/a580d33f-4553-4993-a451-83a3d067be07.png"
                  alt="Illustration de services IPTV premium"
                  className="relative w-full h-auto group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                
                {/* Overlay avec effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
              
              {/* Badges flottants animés */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-br from-white via-accent-50 to-purple-50 p-6 rounded-3xl shadow-floating animate-bounce-gentle border border-white/50 backdrop-blur-sm">
                <div className="text-3xl">⚡</div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-white via-green-50 to-emerald-50 p-4 rounded-2xl shadow-elegant animate-float border border-white/50 backdrop-blur-sm" style={{ animationDelay: '1s' }}>
                <div className="text-xl">🎯</div>
              </div>
              
              <div className="absolute top-1/4 -left-8 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-3 rounded-xl shadow-soft animate-bounce-gentle opacity-80 border border-white/50 backdrop-blur-sm" style={{ animationDelay: '2s' }}>
                <div className="text-lg">🚀</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
