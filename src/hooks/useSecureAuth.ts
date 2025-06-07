
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthAttempt {
  timestamp: number;
  success: boolean;
  ip?: string;
}

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW = 5 * 60 * 1000; // 5 minutes

export const useSecureAuth = () => {
  const [authAttempts, setAuthAttempts] = useState<AuthAttempt[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEnd, setLockoutEnd] = useState<number | null>(null);
  const { toast } = useToast();

  // Enhanced security: Clean up old attempts periodically
  useEffect(() => {
    const stored = localStorage.getItem('auth_attempts');
    if (stored) {
      try {
        const attempts = JSON.parse(stored);
        // Filter out attempts older than 24 hours for cleanup
        const cleanAttempts = attempts.filter((attempt: AuthAttempt) => 
          Date.now() - attempt.timestamp < 24 * 60 * 60 * 1000
        );
        setAuthAttempts(cleanAttempts);
        localStorage.setItem('auth_attempts', JSON.stringify(cleanAttempts));
        checkLockoutStatus(cleanAttempts);
      } catch (error) {
        console.error('Error parsing stored auth attempts:', error);
        localStorage.removeItem('auth_attempts');
      }
    }
  }, []);

  // Enhanced lockout checking with IP consideration
  const checkLockoutStatus = useCallback((attempts: AuthAttempt[]) => {
    const now = Date.now();
    const recentAttempts = attempts.filter(
      attempt => now - attempt.timestamp < ATTEMPT_WINDOW
    );
    
    const recentFailures = recentAttempts.filter(attempt => !attempt.success);
    
    if (recentFailures.length >= MAX_ATTEMPTS) {
      const lastFailure = Math.max(...recentFailures.map(a => a.timestamp));
      const lockEnd = lastFailure + LOCKOUT_DURATION;
      
      if (now < lockEnd) {
        setIsLocked(true);
        setLockoutEnd(lockEnd);
        return true;
      }
    }
    
    setIsLocked(false);
    setLockoutEnd(null);
    return false;
  }, []);

  // Enhanced attempt recording with security logging
  const recordAttempt = useCallback(async (success: boolean, email?: string) => {
    const attempt: AuthAttempt = {
      timestamp: Date.now(),
      success
    };

    const updatedAttempts = [...authAttempts, attempt];
    setAuthAttempts(updatedAttempts);
    localStorage.setItem('auth_attempts', JSON.stringify(updatedAttempts));

    // Log security events for failed attempts
    if (!success && email) {
      try {
        await supabase.rpc('log_security_event', {
          p_action: 'failed_login_attempt',
          p_resource: 'authentication',
          p_details: { email: email.toLowerCase(), timestamp: new Date().toISOString() },
          p_severity: 'medium'
        });
      } catch (error) {
        console.error('Failed to log security event:', error);
      }
    }

    if (!success) {
      checkLockoutStatus(updatedAttempts);
    } else {
      // Clear failed attempts on successful login
      const successfulAttempts = updatedAttempts.filter(a => a.success);
      setAuthAttempts(successfulAttempts);
      localStorage.setItem('auth_attempts', JSON.stringify(successfulAttempts));
      setIsLocked(false);
      setLockoutEnd(null);
    }
  }, [authAttempts, checkLockoutStatus]);

  // Enhanced secure login with comprehensive validation
  const secureLogin = useCallback(async (email: string, password: string) => {
    if (isLocked) {
      const remainingTime = lockoutEnd ? Math.ceil((lockoutEnd - Date.now()) / 1000 / 60) : 0;
      toast({
        variant: "destructive",
        title: "Compte temporairement verrouillé",
        description: `Trop de tentatives échouées. Réessayez dans ${remainingTime} minutes.`,
      });
      return { success: false, error: "Account locked" };
    }

    // Enhanced input validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Format d'email invalide" };
    }

    if (password.length < 8) {
      toast({
        variant: "destructive",
        title: "Mot de passe faible",
        description: "Le mot de passe doit contenir au moins 8 caractères",
      });
      return { success: false, error: "Password too weak" };
    }

    // Check password complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const complexityScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
    
    if (complexityScore < 2) {
      toast({
        variant: "destructive",
        title: "Mot de passe trop simple",
        description: "Le mot de passe doit contenir au moins 2 types de caractères (majuscules, minuscules, chiffres, caractères spéciaux)",
      });
      return { success: false, error: "Password too simple" };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        await recordAttempt(false, email);
        
        // Enhanced error handling
        let errorMessage = "Erreur de connexion";
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Identifiants incorrects";
        } else if (error.message.includes('too_many_requests')) {
          errorMessage = "Trop de tentatives. Veuillez réessayer plus tard";
        } else if (error.message.includes('email_not_confirmed')) {
          errorMessage = "Veuillez confirmer votre email avant de vous connecter";
        }
        
        return { success: false, error: errorMessage };
      }

      await recordAttempt(true, email);
      
      // Log successful login
      try {
        await supabase.rpc('log_security_event', {
          p_action: 'successful_login',
          p_resource: 'authentication',
          p_details: { email: email.toLowerCase(), timestamp: new Date().toISOString() },
          p_severity: 'low'
        });
      } catch (error) {
        console.error('Failed to log security event:', error);
      }
      
      return { success: true, data };
    } catch (error: any) {
      await recordAttempt(false, email);
      return { success: false, error: error.message };
    }
  }, [isLocked, lockoutEnd, recordAttempt, toast]);

  const getRemainingLockoutTime = useCallback(() => {
    if (!isLocked || !lockoutEnd) return 0;
    return Math.max(0, Math.ceil((lockoutEnd - Date.now()) / 1000 / 60));
  }, [isLocked, lockoutEnd]);

  return {
    secureLogin,
    isLocked,
    getRemainingLockoutTime,
    recordAttempt
  };
};
