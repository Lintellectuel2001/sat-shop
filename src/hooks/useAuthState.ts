
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAuthState = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setIsLoggedIn(false);
      setUserId(null);
      navigate('/');
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
  };

  useEffect(() => {
    let mounted = true;

    const checkAuthStatus = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          if (mounted) {
            setIsLoggedIn(false);
            setUserId(null);
            if (error.message.includes('refresh_token_not_found')) {
              await handleSignOut();
            }
          }
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
          toast({
            title: "Erreur de session",
            description: "Une erreur est survenue lors de la vérification de votre session",
            variant: "destructive",
          });
        }
      }
    };

    checkAuthStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      switch (event) {
        case 'SIGNED_IN':
          setIsLoggedIn(true);
          setUserId(session?.user?.id || null);
          break;
        case 'SIGNED_OUT':
          setIsLoggedIn(false);
          setUserId(null);
          navigate('/');
          break;
        case 'TOKEN_REFRESHED':
        case 'USER_UPDATED':
          setIsLoggedIn(!!session);
          setUserId(session?.user?.id || null);
          break;
        default:
          const { error: authError } = await supabase.auth.getSession();
          if (authError?.message?.includes('refresh_token_not_found')) {
            await handleSignOut();
          } else {
            setIsLoggedIn(!!session);
            setUserId(session?.user?.id || null);
          }
          break;
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { isLoggedIn, userId, handleSignOut };
};
