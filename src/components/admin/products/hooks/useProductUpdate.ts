
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { Product } from '../types/product.types';

export const useProductUpdate = () => {
  const { toast } = useToast();
  const { isAdmin } = useAdminCheck();

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
    } catch (error) {
      console.error('Unexpected error updating product:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
      });
    }
  };

  return { handleProductUpdate };
};
