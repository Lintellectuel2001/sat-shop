
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminCheck } from "@/hooks/useAdminCheck";

export const useProductAvailability = () => {
  const { toast } = useToast();
  const { isAdmin } = useAdminCheck();

  const handleToggleAvailability = async (id: string, newStatus: boolean) => {
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
        .update({ is_available: newStatus })
        .eq('id', id);

      if (error) {
        console.error('Error toggling product availability:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de modifier la disponibilité du produit: " + error.message,
        });
        return;
      }

      toast({
        title: "Succès",
        description: `Produit marqué comme ${newStatus ? 'disponible' : 'non disponible'}`,
      });
    } catch (error) {
      console.error('Unexpected error toggling product availability:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
      });
    }
  };

  return { handleToggleAvailability };
};
