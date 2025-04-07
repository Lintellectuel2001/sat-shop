
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useRealtimeProducts = (onProductsChange: () => void) => {
  // Écouter les changements en temps réel sur la table des produits
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          onProductsChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onProductsChange]);
};
