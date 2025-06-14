
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProductHeader from "./ProductHeader";
import ProductDescription from "./ProductDescription";
import ProductFeatures from "./ProductFeatures";
import GuestOrderForm, { GuestOrderInfo } from "@/components/orders/GuestOrderForm";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "@/hooks/useAuthState";

interface ProductInfoProps {
  id: string;
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
  id,
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
  const { isLoggedIn, userId } = useAuthState();
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const handleAuthenticatedOrder = async () => {
    if (!userId) return;

    setIsProcessingOrder(true);
    try {
      // Créer la commande pour un utilisateur connecté
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: userId,
          product_id: id,
          product_name: name,
          amount: price,
          status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Enregistrer dans l'historique du panier
      await supabase
        .from('cart_history')
        .insert([{
          user_id: userId,
          product_id: id,
          action_type: 'purchase'
        }]);

      // Créer le paiement
      await processPayment(order.id);
      
    } catch (error) {
      console.error('Erreur lors de la commande authentifiée:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement de la commande"
      });
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const handleGuestOrder = async (guestInfo: GuestOrderInfo) => {
    setIsProcessingOrder(true);
    try {
      // Créer la commande pour un invité
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          product_id: id,
          product_name: name,
          amount: price,
          status: 'pending',
          customer_name: guestInfo.name,
          guest_email: guestInfo.email,
          guest_phone: guestInfo.phone,
          guest_address: guestInfo.address
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Enregistrer dans l'historique du panier
      await supabase
        .from('cart_history')
        .insert([{
          product_id: id,
          action_type: 'purchase'
        }]);

      setShowGuestForm(false);
      
      // Créer le paiement
      await processPayment(order.id);
      
    } catch (error) {
      console.error('Erreur lors de la commande invité:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement de la commande"
      });
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const processPayment = async (orderId: string) => {
    try {
      // Créer paiement via Chargily
      const { data: payment, error } = await supabase.functions.invoke('create-chargily-payment', {
        body: {
          amount: price.replace(/[^0-9]/g, ''),
          name: "Customer",
          productName: name,
          orderId: orderId
        }
      });

      if (error) throw error;

      if (payment && payment.checkout_url) {
        // Envoyer notification par email
        supabase.functions.invoke('send-order-notification', {
          body: {
            productName: name,
            productPrice: price,
            orderId: orderId
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
      console.error('Erreur lors du paiement:', error);
      toast({
        variant: "destructive",
        title: "Erreur de paiement",
        description: "Impossible de créer le paiement"
      });
    }
  };

  const handleOrder = () => {
    if (isLoggedIn) {
      handleAuthenticatedOrder();
    } else {
      setShowGuestForm(true);
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
        disabled={isProcessingOrder}
        className="w-full lg:w-auto text-lg py-6 bg-primary hover:bg-primary/90"
      >
        {isProcessingOrder ? "Traitement..." : "Commander Maintenant"}
      </Button>

      <div className="bg-muted p-4 rounded-lg mt-8">
        <h3 className="font-semibold mb-2">Paiement sécurisé</h3>
        <p className="text-sm text-accent">
          Paiement sécurisé via Chargily. Livraison immédiate après confirmation du paiement.
          {!isLoggedIn && " Vous pouvez commander sans créer de compte."}
        </p>
      </div>

      <Dialog open={showGuestForm} onOpenChange={setShowGuestForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finaliser votre commande</DialogTitle>
          </DialogHeader>
          <GuestOrderForm
            productName={name}
            productPrice={price}
            onSubmit={handleGuestOrder}
            isLoading={isProcessingOrder}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductInfo;
