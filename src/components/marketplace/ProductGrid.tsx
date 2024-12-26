import React from 'react';
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Product } from '@/data/products';

interface ProductGridProps {
  products: Product[];
  onProductClick: (productId: number) => void;
}

const ProductGrid = ({ products, onProductClick }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card 
          key={product.id} 
          className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onProductClick(product.id)}
        >
          <div className="aspect-square overflow-hidden bg-white p-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />
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
      ))}
    </div>
  );
};

export default ProductGrid;