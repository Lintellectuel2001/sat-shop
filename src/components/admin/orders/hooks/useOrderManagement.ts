
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Order } from '../../../products/hooks/useProductTypes';

export interface OrderStats {
  total: number;
  pending: number;
  validated: number;
  cancelled: number;
}

export const useOrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    validated: 0,
    cancelled: 0
  });
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const ordersData = data || [];
      setOrders(ordersData);

      // Calculer les statistiques
      const statsData = ordersData.reduce((acc, order) => {
        acc.total++;
        switch (order.status) {
          case 'pending':
            acc.pending++;
            break;
          case 'validated':
            acc.validated++;
            break;
          case 'cancelled':
            acc.cancelled++;
            break;
        }
        return acc;
      }, { total: 0, pending: 0, validated: 0, cancelled: 0 });

      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les commandes",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, status: 'validated' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: `La commande a été ${status === 'validated' ? 'validée' : 'annulée'}`,
      });

      // Recharger les commandes
      fetchOrders();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Commande supprimée",
        description: "La commande a été supprimée avec succès",
      });

      // Recharger les commandes
      fetchOrders();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la commande",
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    isLoading,
    stats,
    handleStatusChange,
    handleDeleteOrder,
    refreshOrders: fetchOrders
  };
};
