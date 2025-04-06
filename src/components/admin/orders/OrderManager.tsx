
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import OrderTable from './OrderTable';
import OrderHeader from './OrderHeader';
import OrderStatusDialog from './OrderStatusDialog';
import OrdersReport from './OrdersReport';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Récupère les commandes avec les informations de suivi
      const { data, error } = await supabase
        .from('delivery_orders')
        .select(`
          *,
          products(name, price, image),
          order_tracking(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les commandes",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status, notes) => {
    try {
      // Ajouter un nouvel enregistrement de suivi
      const { error: trackingError } = await supabase
        .from('order_tracking')
        .insert([
          { 
            order_id: orderId,
            status,
            notes: notes || null
          }
        ]);

      if (trackingError) throw trackingError;

      // Mettre à jour le statut de la commande
      const { error: orderError } = await supabase
        .from('delivery_orders')
        .update({ status })
        .eq('id', orderId);

      if (orderError) throw orderError;

      toast({
        title: "Statut mis à jour",
        description: "Le statut de la commande a été mis à jour avec succès",
      });

      // Rafraîchir les données
      fetchOrders();
      setIsStatusDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la commande",
      });
    }
  };

  return (
    <div className="space-y-6">
      <OrderHeader 
        ordersCount={orders.length} 
        onGenerateReport={() => setIsReportDialogOpen(true)}
      />
      
      <OrderTable 
        orders={orders} 
        loading={loading} 
        onStatusUpdate={(order) => {
          setSelectedOrder(order);
          setIsStatusDialogOpen(true);
        }}
      />

      {selectedOrder && (
        <OrderStatusDialog
          open={isStatusDialogOpen}
          onOpenChange={setIsStatusDialogOpen}
          order={selectedOrder}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      <OrdersReport 
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        orders={orders}
      />
    </div>
  );
};

export default OrderManager;
