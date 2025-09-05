import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Users, Zap, Play, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EnhancedHeroSection = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, value: '10K+', label: 'Clients satisfaits', color: 'text-accent' },
    { icon: Zap, value: '24/7', label: 'Support premium', color: 'text-warning' },
    { icon: Star, value: '99.9%', label: 'Disponibilité garantie', color: 'text-success' },
  ];

  const features = [
    { icon: Shield, text: 'Sécurisé & Fiable' },
    { icon: Award, text: 'Qualité Premium' },
    { icon: Zap, text: 'Service Rapide' },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/10">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-accent/5 rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>
        
        {/* Floating geometric shapes */}
        <motion.div
          animate={{ 
            y: [-10, 10, -10],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 w-20 h-20 border-2 border-accent/20 rounded-xl rotate-45"
        />
        <motion.div
          animate={{ 
            y: [-10, 10, -10],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-32 left-16 w-16 h-16 bg-gradient-to-br from-accent/10 to-transparent rounded-full"
        />
        <motion.div
          animate={{ 
            y: [-10, 10, -10],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute top-1/2 right-32 w-12 h-12 border border-accent/30 rounded-full"
        />
      </div>

      <div className="container-modern relative z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, staggerChildren: 0.3 }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          
          {/* Content */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Star className="w-4 h-4 fill-accent" />
                Service Premium #1 en France
              </motion.div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-foreground mb-6">
                L'excellence du{' '}
                <span className="gradient-text">streaming</span>
                {' '}à portée de main
              </h1>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-muted-foreground leading-relaxed max-w-2xl"
            >
              Découvrez une expérience de divertissement révolutionnaire avec nos services 
              IPTV premium. Qualité 4K, contenu illimité et support 24/7.
            </motion.p>

            {/* Features */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-xl backdrop-blur-sm"
                >
                  <feature.icon className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/marketplace')}
                  className="btn-modern text-lg px-10 py-6 group ripple-effect"
                >
                  Découvrir nos offres
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/contact')}
                  className="text-lg px-10 py-6 group bg-background/50 backdrop-blur-sm hover:bg-background/80"
                >
                  <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  Voir la démo
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-3 gap-8 pt-12 border-t border-border/50"
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center group cursor-pointer"
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
                  </motion.div>
                  <div className="text-3xl font-bold text-foreground gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <motion.div 
              whileHover={{ scale: 1.02, rotateY: 5 }}
              transition={{ duration: 0.6 }}
              className="relative perspective-container"
            >
              <div className="relative">
                <motion.img
                  src="/lovable-uploads/b2c903e2-7816-4770-a684-fda4325c61d5.png"
                  alt="Services premium IPTV"
                  className="w-full h-auto rounded-3xl shadow-premium transform-gpu"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-transparent to-accent/10 rounded-3xl"></div>
                <div className="absolute inset-0 rounded-3xl shadow-glow-intense opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
              
              {/* Floating UI Elements */}
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [-10, 10, -10],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  delay: 1, 
                  duration: 0.6,
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute -top-8 -right-8 bg-card rounded-2xl p-6 shadow-elegant border border-border/50 backdrop-blur-sm"
              >
                <div className="text-3xl mb-2">🎬</div>
                <div className="text-sm font-semibold text-card-foreground">4K Ultra HD</div>
                <div className="text-xs text-muted-foreground">Qualité cinéma</div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [-10, 10, -10],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  delay: 1.3, 
                  duration: 0.6,
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 },
                  rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }
                }}
                className="absolute -bottom-8 -left-8 bg-card rounded-2xl p-6 shadow-elegant border border-border/50 backdrop-blur-sm"
              >
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-sm font-semibold text-card-foreground">Streaming Instantané</div>
                <div className="text-xs text-muted-foreground">0 latence</div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [-10, 10, -10],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  delay: 1.6, 
                  duration: 0.6,
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
                  rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
                }}
                className="absolute top-1/2 -right-16 bg-accent text-accent-foreground rounded-2xl p-4 shadow-glow"
              >
                <div className="text-xl font-bold">99.9%</div>
                <div className="text-xs">Uptime</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;