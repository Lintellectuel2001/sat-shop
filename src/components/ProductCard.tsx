
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import WishlistButton from './wishlist/WishlistButton';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  description?: string;
  is_available?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  const handleOrderNow = () => {
    navigate(`/checkout?productId=${product.id}&productName=${encodeURIComponent(product.name)}&productPrice=${encodeURIComponent(product.price)}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <WishlistButton productId={product.id} />
        </div>
        {product.is_available === false && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive">Indisponible</Badge>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
        </div>
        
        <Badge variant="secondary" className="mb-2">
          {product.category}
        </Badge>
        
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-primary">{product.price}</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetails}
              className="flex items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              Voir
            </Button>
            <Button
              size="sm"
              onClick={handleOrderNow}
              disabled={product.is_available === false}
              className="flex items-center gap-1"
            >
              <ShoppingCart className="w-4 h-4" />
              Commander
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
