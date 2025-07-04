import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CreditCard } from 'lucide-react';

interface ChargilyPaymentButtonProps {
  productId: string;
  productName: string;
  amount: number;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  className?: string;
  children?: React.ReactNode;
}

const ChargilyPaymentButton: React.FC<ChargilyPaymentButtonProps> = ({
  productId,
  productName,
  amount,
  customerEmail = "",
  customerName = "",
  customerPhone = "",
  className = "",
  children
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Validation des données requises
      if (!customerEmail || !customerName) {
        toast({
          variant: "destructive",
          title: "Informations manquantes",
          description: "Veuillez fournir votre nom et email pour continuer.",
        });
        return;
      }

      console.log("Initiating payment for:", { productId, productName, amount });

      // Appeler la fonction Edge pour créer le paiement
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          productId,
          productName,
          amount,
          customerEmail,
          customerName,
          customerPhone,
        },
      });

      if (error) {
        console.error("Payment creation error:", error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || "Erreur lors de la création du paiement");
      }

      console.log("Payment created successfully:", data);

      // Rediriger vers l'interface de paiement Chargily
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error("URL de paiement non reçue");
      }

    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        variant: "destructive",
        title: "Erreur de paiement",
        description: error.message || "Impossible d'initier le paiement. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Traitement...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {children || `Payer ${amount} DZD`}
        </>
      )}
    </Button>
  );
};

export default ChargilyPaymentButton;