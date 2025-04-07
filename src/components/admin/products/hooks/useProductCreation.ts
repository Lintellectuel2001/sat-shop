
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminCheck } from "@/hooks/useAdminCheck";

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

export const useProductCreation = (onProductsChange: () => void) => {
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    name: '',
    price: '',
    category: '',
    image: '',
    payment_link: '',
    is_available: true,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAdminCheck();

  const handleProductCreate = async () => {
    try {
      if (!isAdmin) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous n'avez pas les droits d'administration",
        });
        return;
      }

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
          is_available: newProduct.is_available !== undefined ? newProduct.is_available : true,
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
      
      toast({
        title: "Succès",
        description: "Produit créé avec succès",
      });
      
      setIsDialogOpen(false);
      setNewProduct({
        id: '',
        name: '',
        price: '',
        category: '',
        image: '',
        payment_link: '',
        is_available: true,
      });
      
      // Appeler onProductsChange après une création réussie
      onProductsChange();
    } catch (error) {
      console.error('Unexpected error creating product:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
      });
    }
  };

  return {
    newProduct,
    setNewProduct,
    isDialogOpen,
    setIsDialogOpen,
    handleProductCreate,
  };
};
