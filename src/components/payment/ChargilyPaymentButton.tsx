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
        setIsLoading(false);
        return;
      }

      console.log("Initiating payment for:", { productId, productName, amount, customerEmail, customerName });

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

      console.log("Function response:", { data, error });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(`Erreur de fonction: ${error.message}`);
      }

      if (!data) {
        console.error("No data returned from function");
        throw new Error("Aucune réponse de la fonction de paiement");
      }

      if (!data.success) {
        console.error("Payment creation failed:", data.error);
        throw new Error(data.error || "Erreur lors de la création du paiement");
      }

      console.log("Payment created successfully:", data);

      // Rediriger vers l'interface de paiement Chargily
      if (data.checkout_url) {
        console.log("Redirecting to:", data.checkout_url);
        window.location.href = data.checkout_url;
      } else {
        console.error("No checkout_url in response:", data);
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