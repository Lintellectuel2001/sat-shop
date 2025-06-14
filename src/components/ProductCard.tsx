
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Check, X, Package, ShoppingCart, Heart } from "lucide-react";
import { useNavigate } from 'react-router-dom';
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
        variant: "destructive",
        title: "Article non disponible",
        description: "Cet article n'est actuellement pas disponible.",
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
    <div 
      className={`group card-modern hover-lift cursor-pointer relative overflow-hidden ${
        !isAvailable ? 'opacity-60' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Image container avec overlay au survol */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl mb-6">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay au survol */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Button
            size="sm"
            onClick={handleQuickAdd}
            className="bg-white/90 text-primary-900 hover:bg-white shadow-soft"
            disabled={!isAvailable}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleWishlist}
            className="bg-white/90 border-white/50 text-primary-900 hover:bg-white shadow-soft"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {/* Badge de disponibilité */}
          <Badge 
            className={isAvailable 
              ? 'badge-available' 
              : 'badge-unavailable'
            }
          >
            {isAvailable ? (
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                Disponible
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <X className="h-3 w-3" />
                Épuisé
              </span>
            )}
          </Badge>

          {/* Badge de catégorie */}
          {category && (
            <Badge className="bg-white/90 text-primary-700 hover:bg-white font-medium">
              {category.toUpperCase()}
            </Badge>
          )}
        </div>

        {/* Badge produit physique */}
        {isPhysical && (
          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <Package className="h-3 w-3 mr-1" />
            Livraison
          </Badge>
        )}
      </div>

      {/* Contenu */}
      <div className="space-y-4">
        {/* Nom du produit */}
        <h3 className="font-semibold text-lg text-primary-900 group-hover:text-accent-600 transition-colors duration-300 line-clamp-2">
          {name}
        </h3>

        {/* Rating et reviews */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${
                  i < rating 
                    ? 'fill-amber-400 text-amber-400' 
                    : 'text-primary-300'
                }`} 
              />
            ))}
          </div>
          <span className="text-sm text-primary-600">
            ({reviews} avis)
          </span>
        </div>

        {/* Prix et bouton */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <span className="text-2xl font-bold text-primary-900">
              {price}
            </span>
            {isPhysical && (
              <div className="text-xs text-amber-600 font-medium">
                Paiement à la livraison
              </div>
            )}
          </div>
          
          <Button 
            className="btn-modern text-sm px-6 py-2 h-auto"
            onClick={handleCardClick}
            disabled={!isAvailable}
          >
            {isAvailable ? 'Voir détails' : 'Indisponible'}
          </Button>
        </div>
      </div>

      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-pulse"></div>
      </div>
    </div>
  );
};

export default ProductCard;
