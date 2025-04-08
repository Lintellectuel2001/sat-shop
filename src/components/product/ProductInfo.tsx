
import React from 'react';
import { Button } from "@/components/ui/button";
import ProductHeader from "./ProductHeader";
import ProductDescription from "./ProductDescription";
import ProductFeatures from "./ProductFeatures";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProductInfoProps {
  name: string;
  price: string;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  downloadInfo?: any;
  paymentLink: string;
}

const ProductInfo = ({ 
  name, 
  price, 
  rating, 
  reviews, 
  description, 
  features, 
  downloadInfo,
  paymentLink
}: ProductInfoProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleOrder = async () => {
    try {
      // Enregistrer la commande
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          product_name: name,
          amount: price,
          status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Enregistrer la tentative d'achat dans l'historique du panier
      const { error: cartError } = await supabase
        .from('cart_history')
        .insert([{
          action_type: 'purchase',
          product_id: name
        }]);

      if (cartError) throw cartError;

      // Créer paiement en utilisant l'Edge Function
      const { data: payment, error } = await supabase.functions.invoke('create-chargily-payment', {
        body: {
          amount: price.replace(/[^0-9]/g, ''), // Supprimer les caractères non numériques
          name: "Customer", // À remplacer par le nom réel du client
          productName: name
        }
      });

      if (error) throw error;

      // Si la création du paiement est réussie, procéder à la commande
      if (payment && payment.checkout_url) {
        // Envoyer une notification par e-mail en arrière-plan
        supabase.functions.invoke('send-order-notification', {
          body: {
            productName: name,
            productPrice: price,
            orderId: order.id
          },
        }).catch((error) => {
          console.error('Erreur lors de l\'envoi de la notification:', error);
        });

        // Rediriger vers la page de paiement
        window.location.href = payment.checkout_url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (error) {
      console.error('Erreur lors du traitement de la commande:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement de la commande"
      });
    }
  };

  return (
    <div className="space-y-6">
      <ProductHeader
        name={name}
        price={price}
        rating={rating}
        reviews={reviews}
      />

      <ProductDescription 
        description={description}
        downloadInfo={downloadInfo}
      />

      <ProductFeatures features={features} />

      <Button 
        onClick={handleOrder}
        className="w-full lg:w-auto text-lg py-6 bg-primary hover:bg-primary/90"
      >
        Commander Maintenant
      </Button>

      <div className="bg-muted p-4 rounded-lg mt-8">
        <h3 className="font-semibold mb-2">Paiement sécurisé</h3>
        <p className="text-sm text-accent">
          Paiement sécurisé via Chargily. Livraison immédiate après confirmation du paiement.
        </p>
      </div>
    </div>
  );
};

export default ProductInfo;
