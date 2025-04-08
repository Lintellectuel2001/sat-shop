
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useRealtimeOrders = (onOrdersChange: () => void) => {
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          onOrdersChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onOrdersChange]);
};
