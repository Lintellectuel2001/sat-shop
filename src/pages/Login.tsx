import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === "SIGNED_IN" && session) {
        toast.success("Connexion réussie !");
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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