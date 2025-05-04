
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import OrderHeader from './OrderHeader';
import OrderTable from './OrderTable';
import { useRealtimeOrders } from './hooks/useRealtimeOrders';
import { Order } from '../products/hooks/useProductTypes';

const OrderManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    validated: 0,
    pending: 0,
    cancelled: 0
  });
  const { toast } = useToast();

  // Écouter les changements en temps réel
  useRealtimeOrders(fetchOrders);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // Calculer les statistiques
    const total = orders.length;
    const validated = orders.filter(order => order.status === 'validated').length;
    const pending = orders.filter(order => order.status === 'pending').length;
    const cancelled = orders.filter(order => order.status === 'cancelled').length;
    
    setStats({
      total,
      validated,
      pending,
      cancelled
    });
  }, [orders]);

  async function fetchOrders() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false }) as { data: Order[] | null, error: Error | null };
      
      if (error) throw error;
      
      setOrders(data || []);
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
  }

  async function handleStatusChange(orderId: string, newStatus: 'validated' | 'cancelled') {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId) as { error: Error | null };
      
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: `Commande ${newStatus === 'validated' ? 'validée' : 'annulée'} avec succès`,
      });
      
      // Mettre à jour la liste des commandes
      fetchOrders();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la commande",
      });
    }
  }

  async function handleDeleteOrder(orderId: string) {
    console.log('Tentative de suppression de la commande:', orderId); // Log pour débogage
    
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      
      if (error) {
        console.error('Erreur détaillée:', error);
        throw error;
      }
      
      toast({
        title: "Succès",
        description: "Commande supprimée avec succès",
      });
      
      // Mettre à jour la liste des commandes
      fetchOrders();
    } catch (error) {
      console.error('Erreur lors de la suppression de la commande:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la commande",
      });
    }
  }

  return (
    <div className="space-y-6">
      <OrderHeader stats={stats} isLoading={isLoading} />
      <OrderTable 
        orders={orders} 
        isLoading={isLoading} 
        onStatusChange={handleStatusChange}
        onDeleteOrder={handleDeleteOrder}
      />
    </div>
  );
};

export default OrderManager;
