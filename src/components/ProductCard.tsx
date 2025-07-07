
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import ProductImage from './product/ProductImage';
import ProductInfo from './product/ProductInfo';

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

  return (
    <div 
      className={`group card-modern hover-lift cursor-pointer relative overflow-hidden ripple-effect perspective-container ${
        !isAvailable ? 'opacity-60' : ''
      } scale-110`}
      onClick={handleCardClick}
    >
      <ProductImage 
        image={image}
        name={name}
        isAvailable={isAvailable}
        category={category}
        isPhysical={isPhysical}
      />

      <ProductInfo 
        name={name}
        price={price}
        rating={rating}
        reviews={reviews}
        isPhysical={isPhysical}
        isAvailable={isAvailable}
        onCardClick={handleCardClick}
      />

      {/* Effet de brillance au survol avec animation 3D */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-pulse"></div>
        <div className="absolute -top-1/2 -right-1/2 w-40 h-40 bg-gradient-to-r from-accent-400/10 to-purple-400/10 rounded-full animate-float"></div>
      </div>

      {/* Bordure lumineuse au survol */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-accent-200 transition-all duration-500 pointer-events-none animate-glow"></div>
    </div>
  );
};

export default ProductCard;
