import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/useAuth';

interface OrderButtonProps {
  paymentLink: string;
  downloadInfo?: any;
}

const OrderButton = ({ paymentLink, downloadInfo }: OrderButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleOrder = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter ou vous inscrire pour commander",
      });
      navigate('/login', { 
        state: { 
          redirectTo: window.location.pathname,
          paymentLink,
          downloadInfo
        } 
      });
      return;
    }

    // Si l'utilisateur est connecté, rediriger vers le lien de paiement
    window.location.href = paymentLink;
  };

  return (
    <Button 
      onClick={handleOrder}
      className="w-full lg:w-auto text-lg py-6 bg-primary hover:bg-primary/90"
    >
      Commander Maintenant
    </Button>
  );
};

export default OrderButton;