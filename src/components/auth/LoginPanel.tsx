import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

const LoginPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { redirectTo, paymentLink } = location.state || {};

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        toast({
          title: "Connexion réussie",
          description: "Vous allez être redirigé...",
        });
        
        if (redirectTo && paymentLink) {
          // Si on vient d'une page produit, rediriger vers le lien de paiement
          window.location.href = paymentLink;
        } else {
          // Sinon, rediriger vers la page d'accueil
          navigate('/');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, redirectTo, paymentLink]);

  return (
    <div className="min-h-screen bg-background pt-32">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-elegant">
          <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#8B5CF6',
                    brandAccent: '#7C3AED',
                  },
                },
              },
            }}
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPanel;