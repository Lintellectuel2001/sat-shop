
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProductDeletion } from './hooks/useProductDeletion';

interface QuickDeleteButtonProps {
  onProductsChange: () => void;
}

const QuickDeleteButton = ({ onProductsChange }: QuickDeleteButtonProps) => {
  const [productName, setProductName] = useState('');
  const { deleteProductByName } = useProductDeletion();

  const handleQuickDelete = async () => {
    if (!productName.trim()) {
      return;
    }

    await deleteProductByName(productName.trim());
    setProductName('');
    onProductsChange(); // Refresh the product list
  };

  return (
    <div className="flex gap-2 items-center">
      <Input
        placeholder="Nom du produit à supprimer"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleQuickDelete();
          }
        }}
      />
      <Button
        variant="destructive"
        size="sm"
        onClick={handleQuickDelete}
        disabled={!productName.trim()}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Supprimer
      </Button>
    </div>
  );
};

export default QuickDeleteButton;
