import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import DeliveryOrdersGrid from './DeliveryOrdersGrid';
import { useToast } from "@/hooks/use-toast";
import { useAdminCheck } from "@/hooks/useAdminCheck";

interface DeliveryOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  status: string;
  amount: string;
  created_at: string;
  product_id: string | null;
}

const DeliveryManager = () => {
  const { toast } = useToast();
  const { isAdmin } = useAdminCheck();

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['delivery-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delivery_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les commandes",
        });
        throw error;
      }

      return data as DeliveryOrder[];
    },
  });

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous n'avez pas les droits d'administration",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('delivery_orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Statut de la commande mis à jour",
      });

      refetch();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Commandes en livraison</h2>
        <div className="text-sm text-muted-foreground">
          {orders?.length || 0} commande(s)
        </div>
      </div>

      <DeliveryOrdersGrid 
        orders={orders || []} 
        onStatusUpdate={updateOrderStatus} 
      />
    </div>
  );
};

export default DeliveryManager;