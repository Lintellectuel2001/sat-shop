import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const paymentLink = location.state?.paymentLink;

  const handleOrder = () => {
    if (paymentLink) {
      window.location.href = paymentLink;
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Lien de paiement non trouvé",
      });
      navigate('/');
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
                </div>
              </div>
            )}

            <Button 
              onClick={handleOrder}
              className="w-full lg:w-auto text-lg py-6 bg-primary hover:bg-primary/90"
            >
              Commander Maintenant
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;