
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface ProductImageProps {
  image: string;
  name: string;
  isAvailable?: boolean;
}

const ProductImage = ({ image, name, isAvailable }: ProductImageProps) => {
  return (
    <div className="relative">
      <img 
        src={image} 
        alt={name} 
        className="w-16 h-16 object-cover rounded"
      />
      <Badge 
        className={`absolute -top-2 -left-2 ${isAvailable ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
      >
        {isAvailable ? 'Disponible' : 'Non Disponible'}
      </Badge>
    </div>
  );
};

export default ProductImage;
