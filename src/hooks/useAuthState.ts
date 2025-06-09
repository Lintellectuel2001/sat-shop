
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useAuthState = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleSignOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setIsLoggedIn(false);
      setUserId(null);
      
      // Secure navigation without fallback
      navigate('/', { replace: true });
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error);
      toast({
        title: "Erreur lors de la déconnexion",
        description: "Veuillez réessayer",
        variant: "destructive",
      });
    }
  }, [navigate]);

  const handleSessionError = useCallback(async (error: any) => {
    console.error('Session error:', error);
    
    // Handle specific session errors securely
    if (error.message?.includes('refresh_token_not_found') || 
        error.message?.includes('invalid_token') ||
        error.message?.includes('token_expired')) {
      
      // Force logout on token issues
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUserId(null);
      
      toast({
        title: "Session expirée",
        description: "Votre session a expiré. Veuillez vous reconnecter.",
        variant: "destructive",
      });
      
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    let mounted = true;

    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          await handleSessionError(error);
          return;
        }

        if (mounted) {
          setIsLoggedIn(!!session);
          setUserId(session?.user?.id || null);
        }
      } catch (error: any) {
        console.error('Session check error:', error);
        if (mounted) {
          setIsLoggedIn(false);
          setUserId(null);
          await handleSessionError(error);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuthStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state change:', event);

      switch (event) {
        case 'SIGNED_IN':
          setIsLoggedIn(true);
          setUserId(session?.user?.id || null);
          setIsLoading(false);
          break;
        case 'SIGNED_OUT':
          setIsLoggedIn(false);
          setUserId(null);
          setIsLoading(false);
          navigate('/', { replace: true });
          break;
        case 'TOKEN_REFRESHED':
          setIsLoggedIn(!!session);
          setUserId(session?.user?.id || null);
          setIsLoading(false);
          break;
        case 'USER_UPDATED':
          setIsLoggedIn(!!session);
          setUserId(session?.user?.id || null);
          setIsLoading(false);
          break;
        default:
          // Handle any authentication errors
          try {
            const { error: authError } = await supabase.auth.getSession();
            if (authError) {
              await handleSessionError(authError);
            } else {
              setIsLoggedIn(!!session);
              setUserId(session?.user?.id || null);
            }
          } catch (error) {
            await handleSessionError(error);
          }
          setIsLoading(false);
          break;
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleSessionError, navigate]);

  return { isLoggedIn, userId, handleSignOut, isLoading };
};
