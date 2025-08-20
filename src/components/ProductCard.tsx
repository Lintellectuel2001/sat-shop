
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
      <div className="relative aspect-square overflow-hidden bg-secondary/30 rounded-t-xl">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover p-4 group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className={isAvailable ? 'badge-available' : 'badge-unavailable'}>
            {isAvailable ? 'Disponible' : 'Épuisé'}
          </Badge>
          {category && (
            <Badge variant="secondary" className="text-xs">
              {category.toUpperCase()}
            </Badge>
          )}
          {isPhysical && (
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
              Livraison
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
              className="bg-white/90 text-foreground hover:bg-white shadow-sm"
              disabled={!isAvailable}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="sm"
              variant="outline"
              onClick={handleWishlist}
              className="bg-white/90 border-white/50 text-foreground hover:bg-white shadow-sm"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-lg text-foreground group-hover:text-accent transition-colors line-clamp-2">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${
                  i < rating 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-muted-foreground'
                }`}
              /> 
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({reviews})</span>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <span className="text-2xl font-bold text-foreground">
              {price}
            </span>
            {isPhysical && (
              <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                Paiement à la livraison
              </div>
            )}
          </div>
          
          <Button 
            className="btn-modern"
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
