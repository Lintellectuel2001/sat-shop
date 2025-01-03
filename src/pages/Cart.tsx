import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const product = location.state?.product;

  const handleOrder = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour continuer",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: parseFloat(product.price.replace('DA', '')),
          client_name: profile?.full_name || user.email,
          client_email: user.email,
          client_phone: profile?.phone || '',
          back_url: `${window.location.origin}/profile`,
          webhook_url: `${window.location.origin}/webhook-payment`,
        },
      });

      if (error) {
        console.error('Payment creation error:', error);
        throw new Error('Erreur lors de la création du paiement');
      }

      if (data?.checkout_url) {
        // Enregistrer l'action dans l'historique
        await supabase
          .from('cart_history')
          .insert({
            user_id: user.id,
            action_type: 'payment_initiated',
            product_id: product.name
          });

        window.location.href = data.checkout_url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement du paiement",
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
            
            {product && (
              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.price}</p>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={handleOrder}
              className="w-full lg:w-auto text-lg py-6 bg-primary hover:bg-primary/90"
            >
              Procéder au paiement
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;