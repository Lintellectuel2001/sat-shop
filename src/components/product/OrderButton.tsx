import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
        title: "Inscription requise",
        description: "Veuillez vous inscrire pour commander",
      });
      navigate('/register', { 
        state: { 
          redirectTo: '/cart',
          paymentLink,
          downloadInfo
        } 
      });
      return;
    }

    // Si l'utilisateur est connecté, rediriger vers le panier
    navigate('/cart', {
      state: {
        paymentLink,
        downloadInfo
      }
    });
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