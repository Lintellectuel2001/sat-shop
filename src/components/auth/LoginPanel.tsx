
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateEmail, validatePassword } from "@/utils/validation";

const LoginPanel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous errors
    setEmailError("");
    setPasswordError("");
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Veuillez entrer une adresse email valide");
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive",
      });
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
      toast({
        title: "Mot de passe invalide",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Normalize the email (trim and lowercase)
      const normalizedEmail = email.toLowerCase().trim();
      console.log("Attempting login with:", normalizedEmail);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        console.error("Login error details:", error);
        
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          setPasswordError("Mot de passe incorrect");
          toast({
            title: "Identifiants incorrects",
            description: "Le mot de passe est incorrect. Veuillez vérifier vos informations.",
            variant: "destructive",
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email non confirmé",
            description: "Veuillez confirmer votre email avant de vous connecter",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erreur de connexion",
            description: error.message || "Une erreur est survenue lors de la connexion",
            variant: "destructive",
          });
        }
      } else if (data?.user) {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Erreur de connexion",
        description: "Une erreur inattendue est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-secondary pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-md">
        <div className="bg-white rounded-2xl shadow-elegant p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Connexion</h1>
            <p className="text-primary/60">
              Connectez-vous à votre compte Sat-shop
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-primary">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className={`w-full ${emailError ? "border-red-500" : ""}`}
                required
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-primary">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full ${passwordError ? "border-red-500" : ""}`}
                required
                minLength={6}
              />
              {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-white"
              disabled={loading}
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>

            <div className="text-center text-sm text-primary/60">
              Pas encore de compte ?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-accent hover:text-accent/80 transition-colors"
              >
                S'inscrire
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPanel;
