
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import OrderSummary from '@/components/cart/OrderSummary';
import OrderTracking from '@/components/cart/OrderTracking';

interface OrderTracking {
  status: string;
  notes?: string;
  created_at: string;
}

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const paymentLink = location.state?.paymentLink;
  const [orderTracking, setOrderTracking] = useState<OrderTracking[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.orderId) {
      setOrderId(location.state.orderId);
      fetchOrderTracking(location.state.orderId);
      subscribeToOrderUpdates(location.state.orderId);
    }
  }, [location.state?.orderId]);

  const fetchOrderTracking = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('order_tracking')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setOrderTracking(data || []);
    } catch (error) {
      console.error('Error fetching order tracking:', error);
    }
  };

  const subscribeToOrderUpdates = (orderId: string) => {
    const channel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_tracking',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          setOrderTracking(current => [...current, payload.new as OrderTracking]);
          toast({
            title: "Mise à jour de la commande",
            description: `Statut: ${payload.new.status}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleOrder = async () => {
    if (paymentLink) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('cart_history')
            .insert([{
              user_id: user.id,
              product_id: location.state?.product?.id,
              action_type: 'purchase'
            }]);
        }

        window.location.href = paymentLink;
      } catch (error) {
        console.error('Error recording purchase:', error);
        window.location.href = paymentLink;
      }
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Lien de paiement non trouvé",
      });
      navigate('/');
    }
  };

  const handlePromoCodeApply = (promoCode: any) => {
    toast({
      title: "Code promo appliqué",
      description: `Réduction appliquée: ${promoCode.discount_percentage ? promoCode.discount_percentage + '%' : promoCode.discount_amount + '€'}`,
    });
  };

  const handleSaveCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour sauvegarder votre panier",
        });
        return;
      }

      if (!location.state?.product?.id) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Produit non trouvé",
        });
        return;
      }

      const { error } = await supabase
        .from('saved_carts')
        .insert([{
          user_id: user.id,
          product_id: location.state.product.id,
          quantity: 1
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Panier sauvegardé avec succès",
      });
    } catch (error) {
      console.error('Error saving cart:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder le panier",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>
          
          <OrderSummary
            product={location.state?.product}
            onSaveCart={handleSaveCart}
            onOrder={handleOrder}
            onPromoCodeApply={handlePromoCodeApply}
          />
          
          <OrderTracking tracking={orderTracking} />
        </div>
      </main>
    </div>
  );
};

export default Cart;
