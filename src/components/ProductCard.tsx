
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Package, Truck } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: string;
  description?: string;
  image: string;
  category: string;
  features?: string[];
  payment_link: string;
  rating?: number;
  reviews?: number;
  is_available?: boolean;
  is_physical?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleOrderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.is_physical) {
      console.log('Redirection vers la page COD pour le produit:', product.name);
      navigate('/cod');
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer card-modern"
      onClick={handleProductClick}
    >
      <div className="aspect-square overflow-hidden bg-white dark:bg-gray-800 p-4 relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
        />
        {product.is_physical && (
          <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">
            <Truck className="h-3 w-3 mr-1" />
            COD
          </Badge>
        )}
        {product.category && (
          <Badge className="absolute top-2 right-2 bg-primary hover:bg-primary/90">
            {product.category.toUpperCase()}
          </Badge>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-lg dark:text-white line-clamp-2">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {product.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-primary dark:text-accent-400 font-bold text-xl">
            {product.price}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {product.rating || 5} ({product.reviews || 0})
            </span>
          </div>
        </div>
        
        <Button 
          onClick={handleOrderClick}
          className="w-full btn-modern"
          type="button"
        >
          {product.is_physical ? 'Commander avec livraison' : 'Commander Maintenant'}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
