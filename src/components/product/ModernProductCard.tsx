import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart, Package, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ModernProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  rating: number;
  reviews: number;
  paymentLink?: string;
  isAvailable?: boolean;
  category?: string;
  isPhysical?: boolean;
}

const ModernProductCard = ({ 
  id, 
  name, 
  price, 
  image, 
  rating, 
  reviews, 
  paymentLink, 
  isAvailable = true, 
  category,
  isPhysical = false 
}: ModernProductCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) return;
    
    toast({
      title: "Ajouté au panier",
      description: `${name} a été ajouté à votre panier.`,
      duration: 3000,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Ajouté aux favoris",
      description: `${name} a été ajouté à vos favoris.`,
      duration: 3000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group product-card cursor-pointer transform-gpu"
      onClick={handleCardClick}
    >
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-t-2xl">
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110"
          whileHover={{ scale: 1.1 }}
          style={{ 
            filter: 'drop-shadow(0 10px 30px rgba(99, 102, 241, 0.1))',
          }}
        />
        
        {/* Holographic overlay */}
        <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-t-2xl"></div>
        
        {/* Quick Action Buttons */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 rounded-t-2xl">
          <motion.div
            initial={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="sm"
              onClick={handleQuickAdd}
              className="bg-white/90 hover:bg-white text-primary-900 shadow-xl hover:shadow-2xl neon-glow backdrop-blur-sm"
              disabled={!isAvailable}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="sm"
              variant="outline"
              onClick={handleWishlist}
              className="bg-white/90 hover:bg-white border-white/50 text-primary-900 shadow-xl hover:shadow-2xl backdrop-blur-sm"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 hover:bg-white border-white/50 text-primary-900 shadow-xl hover:shadow-2xl backdrop-blur-sm"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        {/* Status & Category Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Badge 
            className={`${isAvailable 
              ? 'bg-success/90 text-white backdrop-blur-sm shadow-lg' 
              : 'bg-error/90 text-white backdrop-blur-sm shadow-lg'
            } transition-all duration-300 hover:scale-105`}
          >
            {isAvailable ? '✓ Disponible' : '✗ Épuisé'}
          </Badge>
          
          {category && (
            <Badge className="bg-white/90 text-primary-700 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-105">
              {category.toUpperCase()}
            </Badge>
          )}
        </div>

        {/* Physical Product Badge */}
        {isPhysical && (
          <Badge className="absolute top-4 right-4 bg-gradient-to-r from-warning to-warning/80 text-white backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-105">
            <Package className="w-3 h-3 mr-1" />
            Livraison
          </Badge>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        {/* Product Name */}
        <motion.h3 
          className="font-bold text-xl text-foreground group-hover:text-accent transition-colors duration-300 line-clamp-2 leading-snug"
          whileHover={{ scale: 1.02 }}
        >
          {name}
        </motion.h3>

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Star 
                  className={`w-4 h-4 transition-all duration-300 ${
                    i < rating 
                      ? 'fill-warning text-warning' 
                      : 'text-muted-foreground'
                  }`}
                />
              </motion.div>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({reviews} avis)
          </span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <div className="text-2xl font-bold gradient-text">
              {price}
            </div>
            {isPhysical && (
              <div className="text-xs text-warning font-medium animate-pulse">
                Paiement à la livraison
              </div>
            )}
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              className="btn-modern ripple-effect"
              disabled={!isAvailable}
              onClick={handleCardClick}
            >
              {isAvailable ? 'Voir détails' : 'Indisponible'}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-accent/60 rounded-full animate-parallax opacity-40"></div>
      <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-warning/60 rounded-full animate-parallax opacity-30" style={{ animationDelay: '2s' }}></div>
    </motion.div>
  );
};

export default ModernProductCard;