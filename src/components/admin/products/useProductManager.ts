
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
  rating?: number;
  reviews?: number;
}

export const useProductManager = (onProductsChange: () => void) => {
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    name: '',
    price: '',
    category: '',
    image: '',
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

      if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.image) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Tous les champs obligatoires doivent être remplis",
        });
        return;
      }

      // S'assurer que le prix est au bon format
      let formattedPrice = newProduct.price;
      if (!formattedPrice.includes('DZD')) {
        formattedPrice = `${formattedPrice} DZD`;
      }

      const { data, error } = await supabase
        .from('products')
        .insert({
          name: newProduct.name,
          price: formattedPrice,
          category: newProduct.category,
          image: newProduct.image,
          description: newProduct.description,
          features: newProduct.features,
          payment_link: null,
          rating: 5,
          reviews: 0
        })
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
      
      console.log("Created product:", data);
      
      // Après avoir créé le produit, générer automatiquement un lien de paiement
      if (data && data.length > 0) {
        const createdProduct = data[0];
        await createPaymentLink(createdProduct);
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
      });
      
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

  // Fonction pour créer un lien de paiement Chargily Pay
  const createPaymentLink = async (product: any) => {
    try {
      // Extraction du prix numérique (sans "DZD")
      const priceValue = product.price.replace(/[^0-9]/g, '');
      const numericPrice = parseInt(priceValue, 10);
      
      if (isNaN(numericPrice)) {
        console.error('Prix invalide:', product.price);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Le prix du produit n'est pas un nombre valide",
        });
        return;
      }
      
      console.log("Generating payment link for product:", product.id, "with price:", numericPrice);
      
      const { data, error } = await supabase.functions.invoke('create-chargily-payment', {
        body: {
          productId: product.id,
          amount: numericPrice,
          productName: product.name
        }
      });
      
      if (error) {
        console.error('Error creating payment link:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de créer le lien de paiement: " + error.message,
        });
        return;
      }
      
      console.log("Payment link generated:", data);
      
      if (data && data.checkout_url) {
        // Mettre à jour le produit avec le lien de paiement
        const { error: updateError } = await supabase
          .from('products')
          .update({
            payment_link: data.checkout_url
          })
          .eq('id', product.id);
          
        if (updateError) {
          console.error('Error updating product with payment link:', updateError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de mettre à jour le produit avec le lien de paiement",
          });
        } else {
          console.log("Product updated with payment link");
        }
      }
    } catch (error) {
      console.error('Unexpected error creating payment link:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite lors de la création du lien de paiement",
      });
    }
  };

  const handleProductUpdate = async (updatedProduct: Product) => {
    try {
      if (!isAdmin) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous n'avez pas les droits d'administration",
        });
        return;
      }

      if (!updatedProduct.name || !updatedProduct.price || !updatedProduct.category || !updatedProduct.image) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Tous les champs obligatoires doivent être remplis",
        });
        return;
      }

      // S'assurer que le prix est au bon format pour la mise à jour
      let formattedPrice = updatedProduct.price;
      if (!formattedPrice.includes('DZD')) {
        formattedPrice = `${formattedPrice} DZD`;
      }

      const { error } = await supabase
        .from('products')
        .update({
          ...updatedProduct,
          price: formattedPrice,
          payment_link: null
        })
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

      // Après avoir mis à jour le produit, régénérer le lien de paiement
      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .eq('id', updatedProduct.id)
        .single();
        
      if (productData) {
        await createPaymentLink(productData);
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
      if (!isAdmin) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous n'avez pas les droits d'administration",
        });
        return;
      }

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

  return {
    newProduct,
    setNewProduct,
    isDialogOpen,
    setIsDialogOpen,
    handleProductCreate,
    handleProductUpdate,
    handleProductDelete,
  };
};
