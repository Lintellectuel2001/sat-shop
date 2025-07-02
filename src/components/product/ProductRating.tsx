import React from 'react';
import { Star } from "lucide-react";

interface ProductRatingProps {
  rating: number;
  reviews: number;
}

const ProductRating = ({ rating, reviews }: ProductRatingProps) => {
  return (
    <div className="flex items-center gap-3 hover-lift">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-5 h-5 transition-all duration-300 ${
              i < rating 
                ? 'fill-amber-400 text-amber-400 animate-pulse' 
                : 'text-primary-300'
            }`}
            style={{ animationDelay: `${i * 0.1}s` }}
          /> 
        ))}
      </div>
      <span className="text-base text-primary-600 animate-fade-in">
        ({reviews} avis)
      </span>
    </div>
  );
};

export default ProductRating;