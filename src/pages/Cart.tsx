import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { paymentLink, downloadInfo } = location.state || {};

  useEffect(() => {
    if (paymentLink) {
      toast({
        title: "Redirection vers le paiement",
        description: "Vous allez être redirigé vers la page de paiement...",
      });
      // Redirection vers le lien de paiement
      window.location.href = paymentLink;
    } else {
      navigate('/marketplace');
    }
  }, [paymentLink, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-32">
        <h1 className="text-2xl font-bold mb-4">Redirection vers le paiement...</h1>
        <p>Veuillez patienter pendant que nous vous redirigeons vers la page de paiement.</p>
      </div>
    </div>
  );
};

export default Cart;