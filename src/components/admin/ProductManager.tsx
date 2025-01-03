import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import ProductForm from './products/ProductForm';
import ProductCard from './products/ProductCard';

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

interface ProductManagerProps {
  products: Product[];
  onProductsChange: () => void;
}

const ProductManager = ({ products, onProductsChange }: ProductManagerProps) => {
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    name: '',
    price: '',
    category: '',
    image: '',
    payment_link: '',
  });
  const { toast } = useToast();

  const handleProductCreate = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.image || !newProduct.payment_link) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis",
      });
      return;
    }

    const { error } = await supabase
      .from('products')
      .insert([newProduct]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le produit",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Produit créé avec succès",
    });
    
    onProductsChange();
    setNewProduct({
      id: '',
      name: '',
      price: '',
      category: '',
      image: '',
      payment_link: '',
    });
  };

  const handleProductUpdate = async (updatedProduct: Product) => {
    if (!updatedProduct.name || !updatedProduct.price || !updatedProduct.category || !updatedProduct.image || !updatedProduct.payment_link) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis",
      });
      return;
    }

    const { error } = await supabase
      .from('products')
      .update(updatedProduct)
      .eq('id', updatedProduct.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le produit",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Produit mis à jour avec succès",
    });
    
    onProductsChange();
  };

  const handleProductDelete = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le produit",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Produit supprimé avec succès",
    });
    
    onProductsChange();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gestion des Produits</h2>
        <Dialog>
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
              onProductChange={(field, value) => 
                setNewProduct({ ...newProduct, [field]: value })
              }
              onSubmit={handleProductCreate}
              submitLabel="Créer"
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={handleProductUpdate}
            onDelete={handleProductDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductManager;