
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from './useAuthState';

interface CreateOrderData {
  product_id: string;
  product_name: string;
  amount: string;
  guest_info?: {
    email: string;
    phone: string;
    address: string;
    name: string;
  };
}

export const useOrderManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isLoggedIn, userId } = useAuthState();

  const createOrder = async (orderData: CreateOrderData) => {
    try {
      setIsLoading(true);

      const orderPayload = {
        product_id: orderData.product_id,
        product_name: orderData.product_name,
        amount: orderData.amount,
        user_id: isLoggedIn ? userId : null,
        customer_name: isLoggedIn ? null : orderData.guest_info?.name,
        guest_email: isLoggedIn ? null : orderData.guest_info?.email,
        guest_phone: isLoggedIn ? null : orderData.guest_info?.phone,
        guest_address: isLoggedIn ? null : orderData.guest_info?.address,
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select('*')
        .single();

      if (error) throw error;

      toast({
        title: "Commande créée",
        description: `Votre commande #${data.order_token} a été créée avec succès`,
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

  const trackOrder = async (orderToken: string, email?: string) => {
    try {
      setIsLoading(true);

      let query = supabase
        .from('orders')
        .select('*')
        .eq('order_token', orderToken.toUpperCase());

      // Si un email est fourni pour une commande invité, l'utiliser pour la vérification
      if (email && !isLoggedIn) {
        query = query.eq('guest_email', email);
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_token', orderToken.toUpperCase())
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          variant: "destructive",
          title: "Commande introuvable",
          description: "Aucune commande trouvée avec ce numéro",
        });
        return null;
      }

      // Vérification supplémentaire pour les commandes invités avec email
      if (email && data.guest_email && data.guest_email !== email) {
        toast({
          variant: "destructive",
          title: "Email incorrect",
          description: "L'email ne correspond pas à cette commande",
        });
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la recherche de commande:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de rechercher la commande",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserOrders = async () => {
    if (!isLoggedIn || !userId) return [];

    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
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
    createOrder,
    trackOrder,
    getUserOrders,
    isLoading,
    isLoggedIn
  };
};
