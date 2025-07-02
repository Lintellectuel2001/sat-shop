import React from 'react';
import { Button } from "@/components/ui/button";
import ProductRating from './ProductRating';

interface ProductInfoProps {
  name: string;
  price: string;
  rating: number;
  reviews: number;
  isPhysical: boolean;
  isAvailable: boolean;
  onCardClick: () => void;
}

const ProductInfo = ({ 
  name, 
  price, 
  rating, 
  reviews, 
  isPhysical, 
  isAvailable, 
  onCardClick 
}: ProductInfoProps) => {
  return (
    <div className="space-y-5 transform-gpu px-2">
      {/* Nom du produit */}
      <h3 className="font-semibold text-xl text-primary-900 group-hover:text-accent-600 transition-colors duration-300 line-clamp-2 hover-lift leading-tight">
        {name}
      </h3>

      {/* Rating et reviews */}
      <ProductRating rating={rating} reviews={reviews} />

      {/* Prix et bouton - AGRANDI */}
      <div className="flex items-center justify-between pt-3">
        <div className="space-y-2 hover-lift">
          <span className="text-3xl font-bold text-primary-900 gradient-text">
            {price}
          </span>
          {isPhysical && (
            <div className="text-sm text-amber-600 font-medium animate-pulse">
              Paiement à la livraison
            </div>
          )}
        </div>
        
        <Button 
          className="btn-modern text-base px-8 py-3 h-auto ripple-effect"
          onClick={onCardClick}
          disabled={!isAvailable}
        >
          {isAvailable ? 'Voir détails' : 'Indisponible'}
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;