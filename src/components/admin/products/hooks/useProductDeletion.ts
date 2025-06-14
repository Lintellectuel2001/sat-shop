
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

  return { handleProductDelete };
};
