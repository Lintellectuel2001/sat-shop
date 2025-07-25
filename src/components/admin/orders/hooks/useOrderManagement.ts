import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeOrders } from './useRealtimeOrders';
import { Order } from '../../products/hooks/useProductTypes';

export interface OrderStats {
  total: number;
  validated: number;
  pending: number;
  cancelled: number;
}

export const useOrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<OrderStats>({
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
      // Récupérer TOUTES les commandes (utilisateurs connectés ET invités)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Cast the status to the expected type in the Order interface
      const typedData = data?.map(order => ({
        ...order,
        status: order.status as 'pending' | 'validated' | 'cancelled'
      })) || [];
      
      console.log('Commandes récupérées (incluant les invités):', typedData.length);
      console.log('Commandes d\'invités:', typedData.filter(order => !order.user_id && order.guest_email).length);
      
      setOrders(typedData);
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
      // Si la commande est validée, nous devons calculer et enregistrer le bénéfice
      if (newStatus === 'validated') {
        // Récupérer les informations détaillées de la commande
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*, product_id')
          .eq('id', orderId)
          .single();
        
        if (orderError) throw orderError;
        
        // Récupérer les détails du produit pour le calcul du bénéfice
        if (orderData && orderData.product_id) {
          const { data: productData, error: productError } = await supabase
            .from('products')
            .select('price, purchase_price, name')
            .eq('id', orderData.product_id)
            .single();
          
          if (productError) {
            console.error('Erreur lors de la récupération des données du produit:', productError);
            throw productError;
          }
          
          if (productData) {
            // Extraire le prix de vente (en supprimant tout caractère non-numérique)
            const sellingPrice = parseFloat(productData.price.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
            // S'assurer que purchase_price est un nombre
            const purchasePrice = productData.purchase_price || 0;
            // Calculer le bénéfice
            const profit = sellingPrice - purchasePrice;
            
            console.log(`Calcul du bénéfice pour la commande ${orderId}:`);
            console.log(`- Produit: ${productData.name}`);
            console.log(`- Prix de vente: ${sellingPrice} DA`);
            console.log(`- Prix d'achat: ${purchasePrice} DA`);
            console.log(`- Bénéfice: ${profit} DA`);
            
            // Formater le bénéfice pour l'affichage
            const formattedProfit = new Intl.NumberFormat('fr-DZ', {
              style: 'currency',
              currency: 'DZD',
              maximumFractionDigits: 0
            }).format(profit);
            
            // Afficher le bénéfice dans un toast
            toast({
              title: "Bénéfice calculé",
              description: `Produit: ${productData.name}\nBénéfice: ${formattedProfit}`,
              duration: 5000
            });
            
            // Enregistrer l'achat dans l'historique des commandes avec statut "completed"
            // et ajouter le bénéfice calculé
            await supabase
              .from('cart_history')
              .insert({
                product_id: orderData.product_id,
                action_type: 'purchase',
                payment_status: 'completed',
                profit: profit
              });
            
            console.log(`Commande validée: ID=${orderId}, Bénéfice calculé=${profit}`);
          }
        }
        
        // Mise à jour du statut de la commande
        const { error } = await supabase
          .from('orders')
          .update({ status: newStatus })
          .eq('id', orderId);
        
        if (error) throw error;
      } else {
        // Pour les annulations, simplement mettre à jour le statut
        const { error } = await supabase
          .from('orders')
          .update({ status: newStatus })
          .eq('id', orderId);
        
        if (error) throw error;
      }
      
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
    try {
      // Afficher un log pour débogage
      console.log('Tentative de suppression de la commande avec ID:', orderId);
      
      // Vérifier que l'ID n'est pas undefined
      if (!orderId) {
        console.error('ID de commande invalide:', orderId);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "ID de commande invalide",
        });
        return;
      }
      
      // Remplacer la méthode de suppression avec une version plus détaillée
      const { error } = await supabase
        .from('orders')
        .delete()
        .match({ id: orderId });
      
      if (error) {
        console.error('Erreur de suppression détaillée:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: `Erreur lors de la suppression: ${error.message}`,
        });
        return;
      }
      
      // Vérifier si la commande existe encore après suppression
      const { data: checkData } = await supabase
        .from('orders')
        .select('id')
        .eq('id', orderId);
        
      if (checkData && checkData.length > 0) {
        console.error('La commande existe toujours après suppression:', orderId);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "La suppression a échoué, la commande existe toujours",
        });
        return;
      }
      
      console.log('Suppression réussie, commande ID:', orderId);
      
      toast({
        title: "Succès",
        description: "Commande supprimée avec succès",
      });
      
      // Mettre à jour la liste des commandes après suppression
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

  return {
    orders,
    isLoading,
    stats,
    handleStatusChange,
    handleDeleteOrder
  };
};
