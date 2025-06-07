
import React, { useState } from "react";
import { UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const AdminAccessButton = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateInput = (email: string, password: string): string | null => {
    if (!email || !password) {
      return "Veuillez entrer votre email et mot de passe";
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Format d'email invalide";
    }
    
    // Enhanced password validation
    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    }
    
    return null;
  };

  const handleAdminLogin = async () => {
    const validationError = validateInput(email, password);
    if (validationError) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: validationError,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Secure authentication attempt
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Échec de l'authentification");
      }

      // Use the secure function to check admin status
      const { data: roleCheck, error: roleError } = await supabase
        .rpc('get_current_user_role');

      if (roleError) {
        console.error('Error checking admin role:', roleError);
        await supabase.auth.signOut();
        throw new Error("Erreur lors de la vérification des droits d'administration");
      }

      if (roleCheck !== 'admin') {
        await supabase.auth.signOut();
        throw new Error("Accès refusé : droits d'administration requis");
      }

      // Success - user is authenticated and is an admin
      setIsDialogOpen(false);
      setEmail("");
      setPassword("");
      navigate("/admin");
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'administration",
      });

    } catch (error: any) {
      console.error('Admin login error:', error);
      
      // Secure error handling without exposing sensitive information
      let errorMessage = "Une erreur est survenue lors de la connexion";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Identifiants incorrects";
      } else if (error.message?.includes('droits d'administration')) {
        errorMessage = "Accès refusé : droits d'administration requis";
      } else if (error.message?.includes('too_many_requests')) {
        errorMessage = "Trop de tentatives. Veuillez réessayer plus tard";
      }
      
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleAdminLogin();
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <UserCog className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accès Administrateur</DialogTitle>
          <DialogDescription>
            Connectez-vous avec vos identifiants d'administrateur
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Email d'administrateur"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoComplete="email"
          />
          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoComplete="current-password"
          />
          <Button 
            onClick={handleAdminLogin}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminAccessButton;
