import React, { useState } from "react";
import { UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
const AdminAccessButton = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleAdminLogin = async () => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez entrer votre email et mot de passe"
      });
      return;
    }
    setIsLoading(true);
    try {
      // Attempt to sign in
      const {
        data: authData,
        error: authError
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });
      if (authError) {
        throw authError;
      }
      if (!authData.user) {
        throw new Error("Échec de l'authentification");
      }

      // Check if user is admin
      const {
        data: adminData,
        error: adminError
      } = await supabase.from('admin_users').select('id').eq('id', authData.user.id).maybeSingle();
      if (adminError) {
        console.error('Error checking admin status:', adminError);
        await supabase.auth.signOut();
        throw new Error("Erreur lors de la vérification des droits d'administration");
      }
      if (!adminData) {
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
        description: "Bienvenue dans l'administration"
      });
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message || "Identifiants incorrects ou droits insuffisants"
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
  return <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-4 right-4 shadow-lg hover:shadow-xl transition-all duration-200 mx-0 rounded-3xl text-left font-normal px-[5px] text-sm">
          <UserCog className="h-4 w-4" />
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
          <Input type="email" placeholder="Email d'administrateur" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKeyDown} disabled={isLoading} />
          <Input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown} disabled={isLoading} />
          <Button onClick={handleAdminLogin} disabled={isLoading}>
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>;
};
export default AdminAccessButton;