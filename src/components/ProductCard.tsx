
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
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

const ProductCard = ({ 
  id, 
  name, 
  price, 
  image, 
  rating, 
  reviews, 
  isAvailable = true, 
  category,
  isPhysical = false 
}: ProductCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCardClick = () => {
    if (!isAvailable) {
      toast({
        title: "Produit indisponible",
        description: "Ce produit n'est actuellement pas disponible.",
        variant: "destructive",
      });
      return;
    }
    navigate(`/product/${id}`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) return;
    
    toast({
      title: "Ajouté au panier",
      description: `${name} a été ajouté à votre panier.`,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Ajouté aux favoris",
      description: `${name} a été ajouté à vos favoris.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="product-card group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary/30 rounded-t-xl">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge className={`text-[10px] px-2 py-0.5 ${isAvailable ? 'badge-available' : 'badge-unavailable'}`}>
            {isAvailable ? 'Dispo' : 'Épuisé'}
          </Badge>
          {category && (
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
              {category}
            </Badge>
          )}
          {isPhysical && (
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 text-[10px] px-2 py-0.5">
              📦
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2 rounded-t-xl"
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="sm"
              onClick={handleQuickAdd}
              className="bg-white/90 text-foreground hover:bg-white shadow-sm h-8 w-8 p-0"
              disabled={!isAvailable}
            >
              <ShoppingCart className="w-3 h-3" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="sm"
              variant="outline"
              onClick={handleWishlist}
              className="bg-white/90 border-white/50 text-foreground hover:bg-white shadow-sm h-8 w-8 p-0"
            >
              <Heart className="w-3 h-3" />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-tight">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${
                  i < rating 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-muted-foreground'
                }`}
              /> 
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-1">
          <div className="space-y-0.5">
            <span className="text-lg font-bold text-foreground">
              {price}
            </span>
            {isPhysical && (
              <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                Paiement livraison
              </div>
            )}
          </div>
          
          <Button 
            size="sm"
            className="btn-modern text-xs px-3 py-1 h-7"
            disabled={!isAvailable}
          >
            {isAvailable ? 'Voir' : 'Épuisé'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
