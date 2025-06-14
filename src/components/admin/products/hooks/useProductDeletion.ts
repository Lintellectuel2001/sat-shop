
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminCheck } from "@/hooks/useAdminCheck";

export const useProductDeletion = () => {
  const { toast } = useToast();
  const { isAdmin } = useAdminCheck();

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

      // First, get the product to check if it exists
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('id, name')
        .eq('id', id)
        .single();

      if (fetchError || !product) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Produit introuvable",
        });
        return;
      }

      // Delete all related records first to avoid foreign key constraint violations
      
      // 1. Delete delivery orders
      await supabase
        .from('delivery_orders')
        .delete()
        .eq('product_id', id);

      // 2. Delete orders
      await supabase
        .from('orders')
        .delete()
        .eq('product_id', id);

      // 3. Delete saved carts
      await supabase
        .from('saved_carts')
        .delete()
        .eq('product_id', id);

      // 4. Delete wishlists
      await supabase
        .from('wishlists')
        .delete()
        .eq('product_id', id);

      // 5. Delete product tags
      await supabase
        .from('product_tags')
        .delete()
        .eq('product_id', id);

      // 6. Delete stock history
      await supabase
        .from('stock_history')
        .delete()
        .eq('product_id', id);

      // Finally, delete the product
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
        description: `Produit "${product.name}" supprimé avec succès`,
      });
    } catch (error) {
      console.error('Unexpected error deleting product:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
      });
    }
  };

  return { handleProductDelete };
};
