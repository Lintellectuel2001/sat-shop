
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthAttempt {
  timestamp: number;
  success: boolean;
}

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW = 5 * 60 * 1000; // 5 minutes

export const useSecureAuth = () => {
  const [authAttempts, setAuthAttempts] = useState<AuthAttempt[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEnd, setLockoutEnd] = useState<number | null>(null);
  const { toast } = useToast();

  // Load attempts from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('auth_attempts');
    if (stored) {
      try {
        const attempts = JSON.parse(stored);
        setAuthAttempts(attempts);
        checkLockoutStatus(attempts);
      } catch (error) {
        console.error('Error parsing stored auth attempts:', error);
        localStorage.removeItem('auth_attempts');
      }
    }
  }, []);

  // Check if user is currently locked out
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

  // Record an authentication attempt
  const recordAttempt = useCallback((success: boolean) => {
    const attempt: AuthAttempt = {
      timestamp: Date.now(),
      success
    };

    const updatedAttempts = [...authAttempts, attempt];
    setAuthAttempts(updatedAttempts);
    localStorage.setItem('auth_attempts', JSON.stringify(updatedAttempts));

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

  // Secure login function with rate limiting
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

    // Validate password strength
    if (password.length < 8) {
      toast({
        variant: "destructive",
        title: "Mot de passe faible",
        description: "Le mot de passe doit contenir au moins 8 caractères",
      });
      return { success: false, error: "Password too weak" };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        recordAttempt(false);
        return { success: false, error: error.message };
      }

      recordAttempt(true);
      return { success: true, data };
    } catch (error: any) {
      recordAttempt(false);
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
