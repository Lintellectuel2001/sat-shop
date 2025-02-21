
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductForm from './ProductForm';

interface Product {
  id: string;
  name: string;
  price: string;
  description?: string;
  image: string;
  category: string;
  features?: string[];
  rating?: number;
  reviews?: number;
}

interface ProductHeaderProps {
  productsCount: number;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  newProduct: Product;
  onProductChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

const ProductHeader = ({
  productsCount,
  isDialogOpen,
  setIsDialogOpen,
  newProduct,
  onProductChange,
  onSubmit
}: ProductHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Produits ({productsCount})</h2>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un produit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau produit</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={newProduct}
            onProductChange={onProductChange}
            onSubmit={onSubmit}
            submitLabel="Créer"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductHeader;
