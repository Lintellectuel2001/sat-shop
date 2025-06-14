
import React from 'react';
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ProductForm from './ProductForm';
import QuickDeleteButton from './QuickDeleteButton';

interface Product {
  id: string;
  name: string;
  price: string;
  description?: string;
  image: string;
  category: string;
  features?: string[];
  payment_link: string;
  is_available?: boolean;
}

interface ProductHeaderProps {
  productsCount: number;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  newProduct: Product;
  onProductChange: (field: string, value: any) => void;
  onSubmit: () => void;
  onProductsChange: () => void;
}

const ProductHeader = ({ 
  productsCount, 
  isDialogOpen, 
  setIsDialogOpen, 
  newProduct, 
  onProductChange, 
  onSubmit,
  onProductsChange
}: ProductHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Produits</h2>
        <p className="text-gray-600">{productsCount} produit(s) au total</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <QuickDeleteButton onProductsChange={onProductsChange} />
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Produit
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un Nouveau Produit</DialogTitle>
              <DialogDescription>
                Remplissez les informations du nouveau produit.
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              product={newProduct}
              onProductChange={onProductChange}
              onSubmit={onSubmit}
              submitLabel="Ajouter"
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProductHeader;
