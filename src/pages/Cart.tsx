import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const product = location.state?.product;

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('Session error:', sessionError);
      toast({
        title: "Session expirée",
        description: "Veuillez vous reconnecter pour continuer",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
  };

  const handleOrder = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        toast({
          title: "Session expirée",
          description: "Veuillez vous reconnecter pour continuer",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!product || !product.price) {
        console.error('Invalid product data:', product);
        toast({
          title: "Erreur de produit",
          description: "Les informations du produit sont invalides",
          variant: "destructive",
        });
        return;
      }

      const paymentData = {
        amount: parseFloat(product.price.replace(' DA', '')),
        client_name: profile?.full_name || session.user.email,
        client_email: session.user.email,
        client_phone: profile?.phone || '',
        back_url: window.location.origin + '/profile',
        webhook_url: window.location.origin + '/webhook-payment',
      };

      console.log('Creating payment with data:', paymentData);

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: paymentData,
      });

      if (error) {
        console.error('Payment creation error:', error);
        toast({
          title: "Erreur de paiement",
          description: "Une erreur est survenue lors de la création du paiement. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      if (!data || !data.checkout_url) {
        console.error('Invalid response from payment service:', data);
        toast({
          title: "Erreur de paiement",
          description: "Le service de paiement n'a pas répondu correctement. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      // Save to cart history before redirecting
      const { error: historyError } = await supabase
        .from('cart_history')
        .insert({
          user_id: session.user.id,
          action_type: 'payment_initiated',
          product_id: product.name
        });

      if (historyError) {
        console.error('Error saving to cart history:', historyError);
      }

      // Redirect to payment page
      window.location.href = data.checkout_url;
    } catch (error) {
      console.error('Payment process error:', error);
      toast({
        title: "Erreur de paiement",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors du traitement du paiement",
        variant: "destructive",
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
            
            {product ? (
              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.price}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Votre panier est vide</p>
            )}

            {product && (
              <Button 
                onClick={handleOrder}
                className="w-full lg:w-auto text-lg py-6 bg-primary hover:bg-primary/90"
              >
                Procéder au paiement
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;