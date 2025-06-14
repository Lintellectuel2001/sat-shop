
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
    } catch (error) {
      console.error('Unexpected error deleting product:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
      });
    }
  };

  const deleteProductByName = async (productName: string) => {
    try {
      if (!isAdmin) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous n'avez pas les droits d'administration",
        });
        return;
      }

      // First find the product by name
      const { data: products, error: searchError } = await supabase
        .from('products')
        .select('id, name')
        .ilike('name', `%${productName}%`);

      if (searchError) {
        console.error('Error searching for product:', searchError);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Erreur lors de la recherche du produit",
        });
        return;
      }

      if (!products || products.length === 0) {
        toast({
          variant: "destructive",
          title: "Produit non trouvé",
          description: `Aucun produit trouvé avec le nom "${productName}"`,
        });
        return;
      }

      if (products.length > 1) {
        toast({
          variant: "destructive",
          title: "Plusieurs produits trouvés",
          description: `${products.length} produits trouvés. Veuillez être plus spécifique.`,
        });
        return;
      }

      // Delete the found product
      const productToDelete = products[0];
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete.id);

      if (deleteError) {
        console.error('Error deleting product:', deleteError);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de supprimer le produit: " + deleteError.message,
        });
        return;
      }

      toast({
        title: "Succès",
        description: `Produit "${productToDelete.name}" supprimé avec succès`,
      });
    } catch (error) {
      console.error('Unexpected error deleting product by name:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
      });
    }
  };

  return { handleProductDelete, deleteProductByName };
};
