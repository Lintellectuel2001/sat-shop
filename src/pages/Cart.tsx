
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PromoCodeInput from '@/components/marketing/PromoCodeInput';

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
        // Record the purchase attempt in cart_history
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
    // Ici nous pourrions ajuster le prix en fonction du code promo
    toast({
      title: "Code promo appliqué",
      description: `Réduction appliquée: ${promoCode.discount_percentage ? promoCode.discount_percentage + '%' : promoCode.discount_amount + '€'}`,
    });
  };

  const saveToCart = async () => {
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
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Récapitulatif de la commande</h2>
            </div>
            
            {location.state?.product && (
              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{location.state.product.name}</h3>
                    <p className="text-sm text-gray-600">{location.state.product.price}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={saveToCart}
                    className="ml-4"
                  >
                    Sauvegarder pour plus tard
                  </Button>
                </div>
              </div>
            )}

            {/* Ajout du PromoCodeInput */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Code Promo</h3>
              <PromoCodeInput onApply={handlePromoCodeApply} />
            </div>

            <Button 
              onClick={handleOrder}
              className="w-full lg:w-auto text-lg py-6 bg-primary hover:bg-primary/90"
            >
              Commander Maintenant
            </Button>
          </div>

          {orderTracking.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Suivi de commande</h2>
              <div className="space-y-4">
                {orderTracking.map((track, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-primary">{track.status}</p>
                      {track.notes && (
                        <p className="text-sm text-gray-600 mt-1">{track.notes}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(track.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Cart;
