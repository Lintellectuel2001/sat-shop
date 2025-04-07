
import React from 'react';
import { Card } from "@/components/ui/card";
import { Star, Check, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  is_available?: boolean;
}

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

const ProductGrid = ({ products, isLoading }: ProductGridProps) => {
  const navigate = useNavigate();

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  if (isLoading) {
    return (
      <div className="col-span-full text-center py-8 text-gray-500">
        Chargement des produits...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          Aucun produit trouvé pour cette catégorie
        </div>
      ) : (
        products.map((product) => (
          <Card 
            key={product.id} 
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleProductClick(product)}
          >
            <div className="aspect-square overflow-hidden bg-white p-4 relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
              {/* Availability badge */}
              <Badge 
                className={`absolute top-2 left-2 ${
                  product.is_available !== false 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {product.is_available !== false ? (
                  <span className="flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Disponible
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <X className="h-3 w-3" />
                    Non Disponible
                  </span>
                )}
              </Badge>
              
              {/* Category badge */}
              {product.category && (
                <Badge 
                  className="absolute bottom-2 left-2 bg-primary hover:bg-primary/90"
                >
                  {product.category}
                </Badge>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-primary font-medium">{product.price}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-accent">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default ProductGrid;
