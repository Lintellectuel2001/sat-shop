import React from 'react';
import { Star } from "lucide-react";

interface ProductHeaderProps {
  name: string;
  price: string;
  rating: number;
  reviews: number;
}

const ProductHeader = ({ name, price, rating, reviews }: ProductHeaderProps) => {
  return (
    <>
      <h1 className="text-4xl font-bold">{name}</h1>
      <div className="flex items-center gap-4">
        <span className="text-2xl font-semibold text-primary">{price}</span>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 fill-[#ffd700] text-[#ffd700]"
            />
          ))}
          <span className="text-sm text-accent ml-2">
            ({reviews} avis)
          </span>
        </div>
      </div>
    </>
  );
};

export default ProductHeader;