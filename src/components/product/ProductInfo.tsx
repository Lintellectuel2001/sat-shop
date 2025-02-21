
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import ProductHeader from "./ProductHeader";
import ProductDescription from "./ProductDescription";
import ProductFeatures from "./ProductFeatures";
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    try {
      setLoading(true);
      
      // Extraire uniquement les chiffres du prix
      const numericAmount = price.replace(/[^0-9]/g, '');
      if (!numericAmount) {
        throw new Error('Invalid price format');
      }

      console.log("Processing payment for amount:", numericAmount);

      // Créer le paiement via la fonction Edge
      const { data: payment, error } = await supabase.functions.invoke(
        'create-chargily-payment',
        {
          body: {
            amount: numericAmount,
            name: "Customer",
            productName: name
          }
        }
      );

      if (error) throw error;

      console.log("Payment response:", payment);

      if (payment && payment.checkout_url) {
        // Enregistrer la tentative d'achat
        await supabase
          .from('cart_history')
          .insert([{
            action_type: 'purchase',
            product_id: name
          }]);

        // Rediriger vers la page de paiement Chargily
        window.location.href = payment.checkout_url;
      } else {
        throw new Error('URL de paiement non reçue');
      }

    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement de la commande. Veuillez réessayer."
      });
    } finally {
      setLoading(false);
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
        disabled={loading}
      >
        {loading ? 'Traitement en cours...' : 'Commander Maintenant'}
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
