
import React, { useState } from 'react';
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  is_available?: boolean;
}

interface ProductActionsProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDeleteClick: (id: string) => void;
}

const ProductActions = ({ product, onEdit, onDeleteClick }: ProductActionsProps) => {
  const [editingProduct, setEditingProduct] = useState<Product>(product);

  return (
    <div className="flex space-x-2 justify-end">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setEditingProduct(product)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le Produit</DialogTitle>
            <DialogDescription>
              Modifiez les informations du produit.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onProductChange={(field, value) => 
              setEditingProduct({ ...editingProduct, [field]: value })
            }
            onSubmit={() => {
              onEdit(editingProduct);
            }}
            submitLabel="Mettre à jour"
          />
        </DialogContent>
      </Dialog>
      <Button
        variant="destructive"
        size="icon"
        onClick={() => onDeleteClick(product.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProductActions;
