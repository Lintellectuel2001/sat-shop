
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateEmail } from "@/utils/validation";

export const useRegister = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { toast } = useToast();

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
          // Show success dialog instead of automatically navigating
          setShowSuccessDialog(true);
          
          toast({
            title: "Inscription réussie",
            description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
            variant: "default",
          });
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

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    phone,
    setPhone,
    address,
    setAddress,
    loading,
    showSuccessDialog,
    setShowSuccessDialog,
    handleRegister
  };
};
