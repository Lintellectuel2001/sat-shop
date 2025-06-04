
import React, { useEffect, useRef } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const DigitalSlideshow = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data: siteSettings } = useSiteSettings();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Digital elements data
    const elements = Array.from({ length: 15 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      type: Math.floor(Math.random() * 4),
      opacity: 0.3 + Math.random() * 0.4
    }));

    let animationFrame: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Animated gradient background
      const time = Date.now() * 0.001;
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `hsl(${240 + Math.sin(time * 0.5) * 20}, 70%, 15%)`);
      gradient.addColorStop(0.5, `hsl(${260 + Math.cos(time * 0.3) * 15}, 60%, 10%)`);
      gradient.addColorStop(1, `hsl(${220 + Math.sin(time * 0.7) * 25}, 65%, 8%)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw floating digital elements
      elements.forEach((element) => {
        ctx.save();
        ctx.translate(element.x, element.y);
        ctx.rotate(element.rotation);
        ctx.globalAlpha = element.opacity;
        
        ctx.fillStyle = '#8B5CF6';
        ctx.strokeStyle = '#A855F7';
        ctx.lineWidth = 2;

        // Draw different digital icons
        switch (element.type) {
          case 0: // Download icon
            ctx.beginPath();
            ctx.rect(-10, -10, 20, 20);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, -5);
            ctx.lineTo(0, 8);
            ctx.moveTo(-5, 3);
            ctx.lineTo(0, 8);
            ctx.lineTo(5, 3);
            ctx.stroke();
            break;
          case 1: // Cloud icon
            ctx.beginPath();
            ctx.arc(-5, 0, 8, 0, Math.PI * 2);
            ctx.arc(5, 0, 6, 0, Math.PI * 2);
            ctx.arc(0, -5, 10, 0, Math.PI * 2);
            ctx.stroke();
            break;
          case 2: // Code brackets
            ctx.beginPath();
            ctx.moveTo(-8, -5);
            ctx.lineTo(-10, 0);
            ctx.lineTo(-8, 5);
            ctx.moveTo(8, -5);
            ctx.lineTo(10, 0);
            ctx.lineTo(8, 5);
            ctx.stroke();
            break;
          case 3: // Gear icon
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, 4, 0, Math.PI * 2);
            ctx.stroke();
            for (let i = 0; i < 8; i++) {
              const angle = (i * Math.PI * 2) / 8;
              ctx.beginPath();
              ctx.moveTo(Math.cos(angle) * 6, Math.sin(angle) * 6);
              ctx.lineTo(Math.cos(angle) * 10, Math.sin(angle) * 10);
              ctx.stroke();
            }
            break;
        }
        
        ctx.restore();

        // Update position
        element.x += element.vx;
        element.y += element.vy;
        element.rotation += element.rotationSpeed;

        // Wrap around edges
        if (element.x < -20) element.x = canvas.width + 20;
        if (element.x > canvas.width + 20) element.x = -20;
        if (element.y < -20) element.y = canvas.height + 20;
        if (element.y > canvas.height + 20) element.y = -20;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Rotating logo in top corner */}
      <div className="absolute top-8 left-8 z-10">
        <div className="relative">
          <img 
            src={siteSettings?.logo_url || "/lovable-uploads/d7990538-4e18-4b76-bb29-4e16e74bf512.png"}
            alt={siteSettings?.logo_text || "Sat-shop"}
            className="w-16 h-16 object-contain animate-spin"
            style={{ 
              animationDuration: '8s',
              filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))'
            }}
          />
          {/* Glowing ring effect */}
          <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-pulse"></div>
        </div>
      </div>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
      
      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
            Sat-Shop
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-100">
            Votre marketplace digital de confiance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-accent hover:bg-accent/90 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
              Découvrir nos produits
            </button>
            <button className="px-8 py-3 border-2 border-white/50 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300">
              En savoir plus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalSlideshow;
