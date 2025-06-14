
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
      className={`group card-modern hover-lift cursor-pointer relative overflow-hidden ripple-effect perspective-container ${
        !isAvailable ? 'opacity-60' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Image container avec overlay au survol et effets 3D */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl mb-6 transform-gpu">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500 hover-lift"
          style={{ 
            filter: 'drop-shadow(0 10px 25px rgba(99, 102, 241, 0.1))',
            transformStyle: 'preserve-3d'
          }}
        />
        
        {/* Effet holographique au survol */}
        <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
        
        {/* Overlay au survol avec effets 3D */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3 perspective-container">
          <Button
            size="sm"
            onClick={handleQuickAdd}
            className="bg-white/90 text-primary-900 hover:bg-white shadow-soft hover-lift neon-glow"
            disabled={!isAvailable}
          >
            <ShoppingCart className="w-4 h-4 animate-pulse" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleWishlist}
            className="bg-white/90 border-white/50 text-primary-900 hover:bg-white shadow-soft hover-lift pulse-3d"
          >
            <Heart className="w-4 h-4 animate-pulse" />
          </Button>
        </div>

        {/* Badges avec effets 3D */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {/* Badge de disponibilité */}
          <Badge 
            className={`${isAvailable 
              ? 'badge-available hover-lift neon-glow' 
              : 'badge-unavailable hover-lift'
            } transform-gpu`}
          >
            {isAvailable ? (
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3 animate-pulse" />
                Disponible
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <X className="h-3 w-3 animate-pulse" />
                Épuisé
              </span>
            )}
          </Badge>

          {/* Badge de catégorie */}
          {category && (
            <Badge className="bg-white/90 text-primary-700 hover:bg-white font-medium hover-lift animate-morph">
              {category.toUpperCase()}
            </Badge>
          )}
        </div>

        {/* Badge produit physique */}
        {isPhysical && (
          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover-lift pulse-3d">
            <Package className="h-3 w-3 mr-1 animate-pulse" />
            Livraison
          </Badge>
        )}

        {/* Particules flottantes */}
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-accent-400 rounded-full animate-parallax opacity-60"></div>
        <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-parallax opacity-40" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Contenu avec animations */}
      <div className="space-y-4 transform-gpu">
        {/* Nom du produit */}
        <h3 className="font-semibold text-lg text-primary-900 group-hover:text-accent-600 transition-colors duration-300 line-clamp-2 hover-lift">
          {name}
        </h3>

        {/* Rating et reviews */}
        <div className="flex items-center gap-2 hover-lift">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 transition-all duration-300 ${
                  i < rating 
                    ? 'fill-amber-400 text-amber-400 animate-pulse' 
                    : 'text-primary-300'
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              /> 
            ))}
          </div>
          <span className="text-sm text-primary-600 animate-fade-in">
            ({reviews} avis)
          </span>
        </div>

        {/* Prix et bouton */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1 hover-lift">
            <span className="text-2xl font-bold text-primary-900 gradient-text">
              {price}
            </span>
            {isPhysical && (
              <div className="text-xs text-amber-600 font-medium animate-pulse">
                Paiement à la livraison
              </div>
            )}
          </div>
          
          <Button 
            className="btn-modern text-sm px-6 py-2 h-auto ripple-effect"
            onClick={handleCardClick}
            disabled={!isAvailable}
          >
            {isAvailable ? 'Voir détails' : 'Indisponible'}
          </Button>
        </div>
      </div>

      {/* Effet de brillance au survol avec animation 3D */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-pulse"></div>
        <div className="absolute -top-1/2 -right-1/2 w-32 h-32 bg-gradient-to-r from-accent-400/10 to-purple-400/10 rounded-full animate-float"></div>
      </div>

      {/* Bordure lumineuse au survol */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-accent-200 transition-all duration-500 pointer-events-none animate-glow"></div>
    </div>
  );
};

export default ProductCard;
