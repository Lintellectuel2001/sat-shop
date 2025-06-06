
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeEmail, authRateLimiter } from '@/utils/securityValidation';
import { useSecureAuthState } from '@/hooks/useSecureAuthState';

interface SecureLoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

const SecureLoginForm: React.FC<SecureLoginFormProps> = ({ onSuccess, redirectTo = "/" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logSecurityEvent } = useSecureAuthState();

  const checkRateLimit = useCallback(() => {
    const clientId = `${navigator.userAgent}_${window.location.hostname}`;
    
    if (!authRateLimiter.isAllowed(clientId)) {
      const remainingTime = Math.ceil(authRateLimiter.getRemainingTime(clientId) / 1000 / 60);
      setIsLocked(true);
      
      toast({
        variant: "destructive",
        title: "Trop de tentatives",
        description: `Veuillez réessayer dans ${remainingTime} minutes.`,
      });
      
      return false;
    }
    
    return true;
  }, [toast]);

  const handleSecureLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkRateLimit()) {
      return;
    }

    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez entrer votre email et mot de passe",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Mot de passe trop court",
        description: "Le mot de passe doit contenir au moins 6 caractères",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const sanitizedEmail = sanitizeEmail(email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: password,
      });

      if (error) {
        await logSecurityEvent({
          action: 'login_failed',
          resource: 'authentication',
          details: { 
            email: sanitizedEmail,
            error: error.message,
            userAgent: navigator.userAgent
          },
          severity: 'medium'
        });

        throw error;
      }

      if (!data.user) {
        throw new Error("Échec de l'authentification");
      }

      await logSecurityEvent({
        action: 'login_success',
        resource: 'authentication',
        details: { 
          email: sanitizedEmail,
          userAgent: navigator.userAgent
        },
        severity: 'low'
      });

      toast({
        title: "Connexion réussie",
        description: "Bienvenue !",
      });

      setEmail("");
      setPassword("");
      setIsLocked(false);

      if (onSuccess) {
        onSuccess();
      } else {
        navigate(redirectTo);
      }

    } catch (error: any) {
      console.error('Secure login error:', error);
      
      let errorMessage = "Identifiants incorrects";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Email ou mot de passe incorrect";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Veuillez confirmer votre email avant de vous connecter";
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = "Trop de tentatives. Veuillez réessayer plus tard";
        setIsLocked(true);
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
    if (e.key === "Enter" && !isLoading && !isLocked) {
      handleSecureLogin(e as any);
    }
  };

  return (
    <form onSubmit={handleSecureLogin} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-primary">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="votre@email.com"
          disabled={isLoading || isLocked}
          required
          autoComplete="email"
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
          onKeyDown={handleKeyDown}
          placeholder="••••••••"
          disabled={isLoading || isLocked}
          required
          minLength={6}
          autoComplete="current-password"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-accent hover:bg-accent/90 text-white"
        disabled={isLoading || isLocked}
      >
        {isLoading ? "Connexion..." : isLocked ? "Bloqué" : "Se connecter"}
      </Button>
    </form>
  );
};

export default SecureLoginForm;
