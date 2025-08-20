
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const fadeInDelay = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.2 }
  };

  const stats = [
    { icon: Users, value: '1000+', label: 'Clients satisfaits' },
    { icon: Zap, value: '24/7', label: 'Support disponible' },
    { icon: Star, value: '99.9%', label: 'Disponibilité' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container-modern relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Content */}
          <div className="space-y-8">
            <motion.div {...fadeInUp}>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Découvrez l'excellence avec{' '}
                <span className="gradient-text">Sat-shop</span>
              </h1>
            </motion.div>

            <motion.p 
              {...fadeInDelay}
              className="text-xl text-muted-foreground leading-relaxed max-w-2xl"
            >
              Plongez dans un univers de divertissement premium avec nos services IPTV 
              de haute qualité. Une expérience exceptionnelle vous attend.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                size="lg" 
                onClick={() => navigate('/marketplace')}
                className="btn-modern text-lg px-8 py-4 group"
              >
                Explorer nos services
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/contact')}
                className="text-lg px-8 py-4"
              >
                Nous contacter
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-8 pt-8"
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="w-8 h-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              <img
                src="/lovable-uploads/b2c903e2-7816-4770-a684-fda4325c61d5.png"
                alt="Services premium IPTV"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent rounded-2xl"></div>
              
              {/* Floating badges */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-card rounded-xl p-4 shadow-lg border border-border"
              >
                <div className="text-2xl">🎬</div>
                <div className="text-sm font-medium">Streaming HD</div>
              </motion.div>
              
              <motion.div 
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                className="absolute -bottom-4 -left-4 bg-card rounded-xl p-4 shadow-lg border border-border"
              >
                <div className="text-2xl">⚡</div>
                <div className="text-sm font-medium">Ultra Rapide</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
