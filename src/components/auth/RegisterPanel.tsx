
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const RegisterPanel = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    // Stricter email validation that matches Supabase's requirements
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Mot de passe trop court",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Normalize the email (trim and lowercase)
      const normalizedEmail = email.toLowerCase().trim();
      console.log("Attempting registration with:", normalizedEmail);
      
      // First, create the auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        console.error("Registration error:", signUpError);
        
        if (signUpError.message.includes("User already registered")) {
          toast({
            title: "Utilisateur déjà inscrit",
            description: "Un compte avec cet email existe déjà. Veuillez vous connecter.",
            variant: "destructive",
          });
        } else if (signUpError.message.includes("email_address_invalid")) {
          toast({
            title: "Email invalide",
            description: "L'adresse email n'est pas valide. Veuillez utiliser une adresse email valide.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erreur d'inscription",
            description: signUpError.message || "Une erreur est survenue lors de l'inscription",
            variant: "destructive",
          });
        }
        return;
      }

      if (authData.user) {
        // Then create the profile with the same ID as the auth user
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              full_name: fullName,
              email: normalizedEmail,
              phone,
              address,
            }
          ]);

        if (profileError) {
          console.error("Profile creation error:", profileError);
          toast({
            title: "Erreur de profil",
            description: "Votre compte a été créé mais nous n'avons pas pu créer votre profil.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Inscription réussie",
            description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
            variant: "success",
          });
          
          // Automatically navigate to login page after successful registration
          navigate("/login");
        }
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Erreur lors de l'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription",
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
            <h1 className="text-3xl font-bold text-primary mb-2">Inscription</h1>
            <p className="text-primary/60">
              Créez votre compte Sat-shop
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-primary">
                Nom complet
              </label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full"
                required
              />
            </div>

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
                className="w-full"
                required
              />
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
                className="w-full"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-primary">
                Téléphone (optionnel)
              </label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+33 6 12 34 56 78"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium text-primary">
                Adresse (optionnel)
              </label>
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 rue Example, Ville"
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-white"
              disabled={loading}
            >
              {loading ? "Inscription en cours..." : "S'inscrire"}
            </Button>

            <div className="text-center text-sm text-primary/60">
              Déjà un compte ?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-accent hover:text-accent/80 transition-colors"
              >
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPanel;
