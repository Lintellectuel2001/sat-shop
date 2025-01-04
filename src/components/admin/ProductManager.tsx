import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProductHeader from './products/ProductHeader';
import ProductGrid from './products/ProductGrid';
import { useNavigate } from 'react-router-dom';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour accéder à cette page",
      });
      navigate('/login');
      return false;
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', session.user.id)
      .single();

    if (!adminData) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous n'avez pas les droits d'administration",
      });
      navigate('/');
      return false;
    }

    return true;
  };

  const handleProductCreate = async () => {
    try {
      console.log('Creating product:', newProduct);

      const isAdmin = await checkAdminStatus();
      if (!isAdmin) return;

      if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.image || !newProduct.payment_link) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Tous les champs obligatoires doivent être remplis",
        });
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: newProduct.name,
          price: newProduct.price,
          category: newProduct.category,
          image: newProduct.image,
          payment_link: newProduct.payment_link,
          description: newProduct.description,
          features: newProduct.features,
        }])
        .select();

      if (error) {
        console.error('Error creating product:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de créer le produit: " + error.message,
        });
        return;
      }

      console.log('Product created successfully:', data);
      
      toast({
        title: "Succès",
        description: "Produit créé avec succès",
      });
      
      onProductsChange();
      setIsDialogOpen(false);
      setNewProduct({
        id: '',
        name: '',
        price: '',
        category: '',
        image: '',
        payment_link: '',
      });
    } catch (error) {
      console.error('Unexpected error creating product:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
      });
    }
  };

  const handleProductUpdate = async (updatedProduct: Product) => {
    try {
      const isAdmin = await checkAdminStatus();
      if (!isAdmin) return;

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
        console.error('Error updating product:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de mettre à jour le produit: " + error.message,
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Produit mis à jour avec succès",
      });
      
      onProductsChange();
    } catch (error) {
      console.error('Unexpected error updating product:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
      });
    }
  };

  const handleProductDelete = async (id: string) => {
    try {
      const isAdmin = await checkAdminStatus();
      if (!isAdmin) return;

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de supprimer le produit: " + error.message,
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Produit supprimé avec succès",
      });
      
      onProductsChange();
    } catch (error) {
      console.error('Unexpected error deleting product:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
      });
    }
  };

  return (
    <div className="space-y-6">
      <ProductHeader
        productsCount={products.length}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        newProduct={newProduct}
        onProductChange={(field, value) => 
          setNewProduct({ ...newProduct, [field]: value })
        }
        onSubmit={handleProductCreate}
      />
      <ProductGrid
        products={products}
        onEdit={handleProductUpdate}
        onDelete={handleProductDelete}
      />
    </div>
  );
};

export default ProductManager;