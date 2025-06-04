
import React, { useEffect, useState } from 'react';
import { Cloud, Download, Upload } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const DigitalSlideshow = () => {
  const { data: siteSettings } = useSiteSettings();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Floating digital elements
  const digitalElements = [
    { icon: Cloud, position: 'top-20 left-20', delay: '0s', color: 'text-blue-400' },
    { icon: Download, position: 'top-32 right-32', delay: '1s', color: 'text-green-400' },
    { icon: Upload, position: 'bottom-40 left-40', delay: '2s', color: 'text-purple-400' },
    { icon: Cloud, position: 'bottom-20 right-20', delay: '3s', color: 'text-cyan-400' },
    { icon: Download, position: 'top-1/2 left-10', delay: '1.5s', color: 'text-indigo-400' },
    { icon: Upload, position: 'top-1/2 right-10', delay: '2.5s', color: 'text-pink-400' },
  ];

  return (
    <section className="relative h-[85vh] max-h-[800px] w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,56,202,0.1)_50%,transparent_75%)] bg-[length:60px_60px] animate-pulse"></div>
      </div>

      {/* Floating digital elements */}
      {digitalElements.map((element, index) => (
        <div
          key={index}
          className={`absolute ${element.position} opacity-30`}
          style={{
            animationDelay: element.delay,
            animation: `float 6s ease-in-out infinite, fadeIn 2s ease-out`
          }}
        >
          <element.icon 
            className={`w-16 h-16 ${element.color} drop-shadow-lg`}
            style={{
              filter: 'drop-shadow(0 0 10px currentColor)',
            }}
          />
        </div>
      ))}

      {/* Central logo container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={`relative transition-all duration-2000 ease-out ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          {/* Glow effect behind logo */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-cyan-600/30 rounded-full blur-3xl scale-150 animate-pulse"></div>
          
          {/* Logo container with 3D rotation */}
          <div className="relative">
            <div 
              className="w-80 h-80 flex items-center justify-center rounded-full bg-gradient-to-r from-white/10 to-white/20 backdrop-blur-md border border-white/30 shadow-2xl"
              style={{
                animation: 'rotate3D 8s linear infinite, shine 3s ease-in-out infinite',
                transformStyle: 'preserve-3d',
                background: `
                  linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.3) 100%),
                  radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 70%)
                `
              }}
            >
              <img
                src={siteSettings?.logo_url || "/lovable-uploads/d7990538-4e18-4b76-bb29-4e16e74bf512.png"}
                alt="Sat-Shop Logo"
                className="w-64 h-64 object-contain drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))'
                }}
              />
            </div>
          </div>

          {/* Animated rings around logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 border border-white/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
            <div className="absolute w-[420px] h-[420px] border border-purple-400/30 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
          </div>
        </div>
      </div>

      {/* Overlay text */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center">
        <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
          Découvrez l'Excellence Numérique
        </h1>
        <p className="text-xl text-white/80 drop-shadow-md">
          Votre marketplace de produits digitaux premium
        </p>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        @keyframes rotate3D {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        
        @keyframes shine {
          0%, 100% { box-shadow: 0 0 50px rgba(255,255,255,0.2), inset 0 0 50px rgba(255,255,255,0.1); }
          50% { box-shadow: 0 0 100px rgba(255,255,255,0.4), inset 0 0 100px rgba(255,255,255,0.2); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 0.3; transform: scale(1); }
        }
      `}</style>
    </section>
  );
};

export default DigitalSlideshow;
