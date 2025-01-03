import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useLoginHandler = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }
    
    if (!validateEmail(email)) {
      toast({
        title: "Format d'email invalide",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Mot de passe trop court",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log("Tentative de connexion avec:", { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        console.error("Erreur de connexion:", error);
        throw error;
      }

      console.log("Réponse de connexion:", data);

      if (data.user) {
        console.log("Utilisateur connecté:", data.user);
        
        // Check if user is admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', data.user.id)
          .single();

        if (adminError) {
          console.error("Erreur vérification admin:", adminError);
        }

        console.log("Statut admin:", adminData ? "Oui" : "Non");

        toast({
          title: "Connexion réussie",
          description: adminData ? "Bienvenue administrateur !" : "Vous êtes maintenant connecté.",
        });

        // Force a small delay to ensure the session is properly set
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        console.error("Pas de données utilisateur dans la réponse");
        throw new Error("Échec de la connexion");
      }
    } catch (error: any) {
      console.error("Erreur complète:", error);
      
      let errorMessage = "Une erreur est survenue lors de la connexion";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email ou mot de passe incorrect.";
      }
      
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading };
};