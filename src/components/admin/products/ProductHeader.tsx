import React from 'react';
import { FileText } from "lucide-react";
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
  productsCount,
  isDialogOpen,
  setIsDialogOpen,
  newProduct,
  onProductChange,
  onSubmit
}: ProductHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <FileText className="h-6 w-6" />
        <h2 className="text-2xl font-semibold">Gestion des Articles</h2>
        <span className="bg-gray-100 px-2 py-1 rounded-full text-sm">
          {productsCount} articles
        </span>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Article
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un Article</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouvel article.
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