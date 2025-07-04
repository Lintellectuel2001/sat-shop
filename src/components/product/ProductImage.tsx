import React from 'react';
import ProductBadges from './ProductBadges';
import ProductActions from './ProductActions';

interface ProductImageProps {
  image: string;
  name: string;
  isAvailable: boolean;
  category?: string;
  isPhysical: boolean;
  productId: string;
  productPrice: string;
}

const ProductImage = ({ image, name, isAvailable, category, isPhysical, productId, productPrice }: ProductImageProps) => {
  return (
    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl mb-10 transform-gpu">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500 hover-lift"
        style={{ 
          filter: 'drop-shadow(0 15px 35px rgba(99, 102, 241, 0.15))',
          transformStyle: 'preserve-3d'
        }}
      />
      
      {/* Effet holographique au survol */}
      <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
      
      {/* Overlay au survol avec effets 3D */}
      <ProductActions 
        isAvailable={isAvailable} 
        productName={name} 
        productId={productId} 
        productPrice={productPrice} 
      />

      <ProductBadges 
        isAvailable={isAvailable} 
        category={category} 
        isPhysical={isPhysical} 
      />

      {/* Particules flottantes */}
      <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-accent-400 rounded-full animate-parallax opacity-60"></div>
      <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-parallax opacity-40" style={{ animationDelay: '3s' }}></div>
    </div>
  );
};

export default ProductImage;