import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkAndRedirect() {
      try {
        console.log("Checking session state...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          throw error;
        }
        
        console.log("Current session state:", session);
        
        if (session?.user && mounted) {
          console.log("Active session found, redirecting to home");
          toast({
            title: "Succès",
            description: "Vous êtes déjà connecté"
          });
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Auth error:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Erreur lors de la vérification de la session"
        });
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    checkAndRedirect();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      console.log("Auth state changed:", event, session);
      
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session) {
        console.log("Sign in detected, redirecting to home");
        toast({
          title: "Succès",
          description: "Connexion réussie !"
        });
        navigate("/", { replace: true });
      }

      if (event === 'SIGNED_OUT') {
        console.log("User signed out");
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Connexion</h1>
          <p className="text-gray-500">
            Connectez-vous à votre compte ou créez-en un nouveau
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#2563eb',
                  brandAccent: '#1d4ed8',
                }
              }
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: "Adresse e-mail",
                password_label: "Mot de passe",
                button_label: "Se connecter",
                loading_button_label: "Connexion en cours...",
                email_input_placeholder: "Votre adresse e-mail",
                password_input_placeholder: "Votre mot de passe",
              },
              sign_up: {
                email_label: "Adresse e-mail",
                password_label: "Mot de passe",
                button_label: "S'inscrire",
                loading_button_label: "Inscription en cours...",
                email_input_placeholder: "Votre adresse e-mail",
                password_input_placeholder: "Choisissez un mot de passe",
              },
            }
          }}
          providers={[]}
        />
      </div>
    </div>
  );
}