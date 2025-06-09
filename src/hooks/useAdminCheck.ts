
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAdminCheck = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkAdminStatus = async () => {
      try {
        // First verify user is authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (!session?.user) {
          if (mounted) {
            setIsAdmin(false);
            setIsLoading(false);
            setSessionChecked(true);
            toast({
              variant: "destructive",
              title: "Accès refusé",
              description: "Vous devez être connecté pour accéder à cette page",
            });
            navigate('/login', { replace: true });
          }
          return;
        }

        // Use the new secure function to check admin status
        const { data: adminCheck, error: adminError } = await supabase
          .rpc('get_current_user_role');

        if (adminError) {
          console.error('Error checking admin status:', adminError);
          throw adminError;
        }

        const isUserAdmin = adminCheck === 'admin';

        if (mounted) {
          if (isUserAdmin) {
            setIsAdmin(true);
            console.log('Admin access granted for user:', session.user.id);
          } else {
            setIsAdmin(false);
            toast({
              variant: "destructive",
              title: "Accès refusé",
              description: "Vous n'avez pas les droits d'administration",
            });
            navigate('/', { replace: true });
          }
          setIsLoading(false);
          setSessionChecked(true);
        }
      } catch (error: any) {
        console.error('Error in admin check:', error);
        
        if (mounted) {
          setIsAdmin(false);
          setIsLoading(false);
          setSessionChecked(true);
          
          // Handle specific errors securely
          if (error.message?.includes('refresh_token_not_found') || 
              error.message?.includes('invalid_token')) {
            await supabase.auth.signOut();
            toast({
              variant: "destructive",
              title: "Session expirée",
              description: "Votre session a expiré. Veuillez vous reconnecter.",
            });
            navigate('/login', { replace: true });
          } else {
            toast({
              variant: "destructive",
              title: "Erreur de vérification",
              description: "Une erreur est survenue lors de la vérification des droits",
            });
            navigate('/', { replace: true });
          }
        }
      }
    };

    checkAdminStatus();

    return () => {
      mounted = false;
    };
  }, [navigate, toast]);

  return { isAdmin, isLoading, sessionChecked };
};
