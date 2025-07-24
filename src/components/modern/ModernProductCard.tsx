import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ModernProductCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
  rating: number;
  reviews: number;
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
  isAvailable = true,
  category,
  isPhysical = false
}: ModernProductCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewProduct = () => {
    if (!isAvailable) {
      toast({
        variant: "destructive",
        title: "Article non disponible",
        description: "Cet article n'est actuellement pas disponible.",
      });
      return;
    }
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) {
      toast({
        variant: "destructive",
        title: "Article non disponible",
        description: "Cet article n'est actuellement pas disponible.",
      });
      return;
    }
    navigate(`/product/${id}`);
  };

  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-border/50 hover:border-accent-300">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-accent-50 aspect-square">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
            onClick={handleViewProduct}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {category && (
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs font-medium">
              {category.toUpperCase()}
            </Badge>
          )}
          {isPhysical && (
            <Badge className="bg-warning-500 hover:bg-warning-600 text-white text-xs">
              Livraison
            </Badge>
          )}
        </div>

        {/* Availability indicator */}
        <div className="absolute top-3 right-3">
          <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-success-500' : 'bg-error-500'}`} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Product name */}
        <h3 className="font-semibold text-lg leading-tight text-foreground group-hover:text-accent-600 transition-colors line-clamp-2">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({reviews})</span>
        </div>

        {/* Price and actions */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{price}</p>
            {isPhysical && (
              <p className="text-xs text-warning-600 font-medium">
                Paiement à la livraison
              </p>
            )}
          </div>
          
          <Button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className="bg-accent-500 hover:bg-accent-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isAvailable ? 'Commander' : 'Indisponible'}
          </Button>
        </div>
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-pulse" />
      </div>
    </div>
  );
};

export default ModernProductCard;