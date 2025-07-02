import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Check, X, Package } from "lucide-react";

interface ProductBadgesProps {
  isAvailable: boolean;
  category?: string;
  isPhysical: boolean;
}

const ProductBadges = ({ isAvailable, category, isPhysical }: ProductBadgesProps) => {
  return (
    <>
      {/* Badges avec effets 3D - TEXTE RÉDUIT */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        {/* Badge de disponibilité */}
        <Badge 
          className={`${isAvailable 
            ? 'badge-available hover-lift neon-glow px-2 py-1 text-xs' 
            : 'badge-unavailable hover-lift px-2 py-1 text-xs'
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
          <Badge className="bg-white/90 text-primary-700 hover:bg-white font-medium hover-lift animate-morph px-2 py-1 text-xs">
            {category.toUpperCase()}
          </Badge>
        )}
      </div>

      {/* Badge produit physique */}
      {isPhysical && (
        <Badge className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover-lift pulse-3d px-2 py-1 text-xs">
          <Package className="h-3 w-3 mr-1 animate-pulse" />
          Livraison
        </Badge>
      )}
    </>
  );
};

export default ProductBadges;