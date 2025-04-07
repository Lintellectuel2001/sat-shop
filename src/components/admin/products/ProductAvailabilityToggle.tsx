
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ProductAvailabilityToggleProps {
  isAvailable: boolean;
  onToggle: () => void;
}

const ProductAvailabilityToggle = ({ isAvailable, onToggle }: ProductAvailabilityToggleProps) => {
  return (
    <Button
      variant={isAvailable ? "outline" : "destructive"}
      onClick={onToggle}
      className={`flex items-center gap-1 ${isAvailable ? 'border-green-500 text-green-600 hover:bg-green-50' : 'bg-red-500 hover:bg-red-600'}`}
    >
      {isAvailable ? (
        <>
          <Check className="h-4 w-4" />
          <span>Disponible</span>
        </>
      ) : (
        <>
          <X className="h-4 w-4" />
          <span>Non Disponible</span>
        </>
      )}
    </Button>
  );
};

export default ProductAvailabilityToggle;
