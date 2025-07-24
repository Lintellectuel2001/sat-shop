import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Shield, Zap, Users } from 'lucide-react';

const ModernHeroSection = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Shield, title: "Sécurisé", desc: "Transactions 100% sécurisées" },
    { icon: Zap, title: "Rapide", desc: "Livraison instantanée" },
    { icon: Users, title: "Support 24/7", desc: "Assistance client dédiée" },
  ];

  const stats = [
    { value: "10K+", label: "Clients satisfaits" },
    { value: "99.9%", label: "Disponibilité" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary-50/30 to-accent-50/20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-accent-200/30 to-accent-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-br from-accent-100/20 to-accent-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-gradient-to-r from-accent-400/20 to-accent-500/20 rounded-2xl rotate-12 animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-gradient-to-r from-accent-300/20 to-accent-400/20 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-medium">
                <Star className="w-4 h-4 fill-current" />
                <span>Services IPTV Premium</span>
              </div>

              {/* Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  Découvrez l'excellence avec{" "}
                  <span className="bg-gradient-to-r from-accent-600 to-accent-800 bg-clip-text text-transparent">
                    Sat-shop
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                  La meilleure plateforme pour vos services IPTV, VOD et bien plus encore. 
                  Qualité premium, prix abordables.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  onClick={() => navigate('/marketplace')}
                  size="lg"
                  className="bg-accent-500 hover:bg-accent-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  Explorer nos services
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/contact')}
                  className="border-accent-200 text-accent-700 hover:bg-accent-50"
                >
                  Nous contacter
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="text-center lg:text-left">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-100 rounded-2xl mb-3">
                        <Icon className="w-6 h-6 text-accent-600" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                {/* Main image container */}
                <div className="relative bg-gradient-to-br from-white to-primary-50 rounded-3xl p-8 shadow-xl border border-border/50">
                  <img 
                    src="/lovable-uploads/a580d33f-4553-4993-a451-83a3d067be07.png"
                    alt="Services IPTV Premium"
                    className="w-full h-auto rounded-2xl"
                  />
                  
                  {/* Floating badge */}
                  <div className="absolute -top-4 -right-4 bg-success-500 text-white px-4 py-2 rounded-2xl font-semibold shadow-lg">
                    ✨ Premium
                  </div>
                </div>

                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent-100/50 to-accent-200/50 rounded-3xl blur-xl -z-10 scale-105" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-12 border-t border-border/50">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernHeroSection;