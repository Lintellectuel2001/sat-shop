
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Order {
  id: string;
  product_name: string;
  amount: string;
  status: string;
  created_at: string;
  updated_at: string;
  order_token: string;
  customer_name?: string;
  customer_email?: string;
  guest_email?: string;
  guest_phone?: string;
  guest_address?: string;
  user_id?: string;
  product_id?: string;
}

export interface OrderFormData {
  productId: string;
  productName: string;
  amount: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
}

export const useOrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createOrder = async (orderData: OrderFormData, isGuest: boolean = true) => {
    setIsLoading(true);
    try {
      const orderPayload = {
        product_name: orderData.productName,
        amount: orderData.amount,
        product_id: orderData.productId,
        status: 'pending',
        ...(isGuest ? {
          guest_email: orderData.customerEmail,
          guest_phone: orderData.customerPhone,
          guest_address: orderData.customerAddress,
          customer_name: orderData.customerName
        } : {
          customer_email: orderData.customerEmail,
          customer_name: orderData.customerName,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Commande créée",
        description: `Votre commande a été créée avec succès. Numéro de suivi: ${data.order_token}`,
      });

      return data;
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la commande",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderByToken = async (token: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_token', token)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Commande non trouvée",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserOrders = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger vos commandes",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    orders,
    isLoading,
    createOrder,
    getOrderByToken,
    getUserOrders
  };
};
