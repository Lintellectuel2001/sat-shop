
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
}

const ProductInfo = ({ 
  name, 
  price, 
  rating, 
  reviews, 
  description, 
  features, 
  downloadInfo,
}: ProductInfoProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleOrder = async () => {
    try {
      // Record the purchase attempt
      const { error: cartError } = await supabase
        .from('cart_history')
        .insert([{
          action_type: 'purchase',
          product_id: name
        }]);

      if (cartError) throw cartError;

      // Create payment using the Edge Function
      const { data: payment, error } = await supabase.functions.invoke('create-chargily-payment', {
        body: {
          amount: price.replace(/[^0-9]/g, ''), // Remove any non-numeric characters
          name: "Customer", // This should be replaced with actual customer name
          productName: name
        }
      });

      if (error) throw error;

      // If payment creation is successful, proceed with the order
      if (payment && payment.checkout_url) {
        window.location.href = payment.checkout_url;
      } else {
        throw new Error('Payment URL not received');
      }

      // Send notification email in the background
      supabase.functions.invoke('send-order-notification', {
        body: {
          productName: name,
          productPrice: price,
        },
      }).catch((error) => {
        console.error('Error sending notification:', error);
      });

    } catch (error) {
      console.error('Error processing order:', error);
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
