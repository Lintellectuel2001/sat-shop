
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
import SecureLoginForm from "@/components/auth/SecureLoginForm";
import { useSecureAuthState } from "@/hooks/useSecureAuthState";
import { adminRateLimiter } from '@/utils/securityValidation';

const SecureAdminAccessButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole, logSecurityEvent } = useSecureAuthState();

  const handleAdminAccess = async () => {
    // Check rate limiting for admin access attempts
    const clientId = `admin_${navigator.userAgent}_${window.location.hostname}`;
    
    if (!adminRateLimiter.isAllowed(clientId)) {
      const remainingTime = Math.ceil(adminRateLimiter.getRemainingTime(clientId) / 1000 / 60);
      setIsLocked(true);
      
      await logSecurityEvent({
        action: 'admin_access_rate_limited',
        resource: 'admin_panel',
        details: { userAgent: navigator.userAgent },
        severity: 'high'
      });
      
      toast({
        variant: "destructive",
        title: "Accès temporairement bloqué",
        description: `Trop de tentatives. Réessayez dans ${remainingTime} minutes.`,
      });
      return;
    }

    setIsDialogOpen(true);
  };

  const handleLoginSuccess = async () => {
    setIsDialogOpen(false);
    
    // Verify admin role after successful login
    if (userRole === 'admin') {
      navigate("/admin");
      
      toast({
        title: "Accès autorisé",
        description: "Bienvenue dans l'administration",
      });
    } else {
      await logSecurityEvent({
        action: 'admin_access_denied_after_login',
        resource: 'admin_panel',
        details: { userRole },
        severity: 'high'
      });
      
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Droits d'administration requis",
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={handleAdminAccess}
          disabled={isLocked}
          className="fixed bottom-4 right-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <UserCog className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accès Administrateur Sécurisé</DialogTitle>
          <DialogDescription>
            Connectez-vous avec vos identifiants d'administrateur. Cet accès est surveillé et journalisé.
          </DialogDescription>
        </DialogHeader>
        <SecureLoginForm
          onSuccess={handleLoginSuccess}
          redirectTo="/admin"
        />
      </DialogContent>
    </Dialog>
  );
};

export default SecureAdminAccessButton;
