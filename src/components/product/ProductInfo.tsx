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
      // Ajouter l'action dans cart_history
      await supabase
        .from('cart_history')
        .insert({
          action_type: 'purchase',
          product_id: name // On utilise le nom du produit comme identifiant
        });

      navigate('/cart', {
        state: {
          product: { name, price },
          paymentLink
        }
      });
    } catch (error) {
      console.error('Error recording purchase:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la commande"
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