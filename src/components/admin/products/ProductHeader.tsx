import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
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
  payment_link: string;
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
  isDialogOpen,
  setIsDialogOpen,
  newProduct,
  onProductChange,
  onSubmit
}: ProductHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold">Liste des Produits</h2>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Produit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un Produit</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouveau produit.
            </DialogDescription>
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