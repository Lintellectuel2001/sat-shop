import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductActionsProps {
  isAvailable: boolean;
  productName: string;
}

const ProductActions = ({ isAvailable, productName }: ProductActionsProps) => {
  const { toast } = useToast();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) return;
    
    toast({
      title: "Ajouté au panier",
      description: `${productName} a été ajouté à votre panier.`,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Ajouté aux favoris",
      description: `${productName} a été ajouté à vos favoris.`,
    });
  };

  return (
    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4 perspective-container">
      <Button
        size="sm"
        onClick={handleQuickAdd}
        className="bg-white/90 text-primary-900 hover:bg-white shadow-soft hover-lift neon-glow px-4 py-2"
        disabled={!isAvailable}
      >
        <ShoppingCart className="w-5 h-5 animate-pulse" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handleWishlist}
        className="bg-white/90 border-white/50 text-primary-900 hover:bg-white shadow-soft hover-lift pulse-3d px-4 py-2"
      >
        <Heart className="w-5 h-5 animate-pulse" />
      </Button>
    </div>
  );
};

export default ProductActions;