
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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) {
            setIsAdmin(false);
            setIsLoading(false);
            setSessionChecked(true);
            
            // Si l'erreur est liée au refresh token, déconnectez l'utilisateur
            if (sessionError.message?.includes('refresh_token_not_found')) {
              await supabase.auth.signOut();
              toast({
                variant: "destructive",
                title: "Session expirée",
                description: "Votre session a expiré. Veuillez vous reconnecter.",
              });
              navigate('/login');
            } else {
              toast({
                variant: "destructive",
                title: "Erreur de session",
                description: "Une erreur est survenue lors de la vérification de votre session",
              });
              navigate('/login');
            }
          }
          return;
        }

        if (!session) {
          if (mounted) {
            setIsAdmin(false);
            setIsLoading(false);
            setSessionChecked(true);
            toast({
              variant: "destructive",
              title: "Accès refusé",
              description: "Vous devez être connecté pour accéder à cette page",
            });
            navigate('/login');
          }
          return;
        }

        // Add console.log to debug user session info
        console.log('User session:', session.user);

        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();
        
        // Add console.log to debug admin check
        console.log('Admin check result:', { adminData, adminError });

        if (mounted) {
          if (adminError) {
            console.error('Error checking admin status:', adminError);
            setIsAdmin(false);
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Une erreur est survenue lors de la vérification des droits",
            });
            navigate('/');
          } else if (!adminData) {
            setIsAdmin(false);
            toast({
              variant: "destructive",
              title: "Accès refusé",
              description: "Vous n'avez pas les droits d'administration",
            });
            navigate('/');
          } else {
            setIsAdmin(true);
          }
          setIsLoading(false);
          setSessionChecked(true);
        }
      } catch (error) {
        if (mounted) {
          console.error('Error in checkAdminStatus:', error);
          setIsAdmin(false);
          setIsLoading(false);
          setSessionChecked(true);
          
          // En cas d'erreur imprévue, on déconnecte l'utilisateur par sécurité
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Erreur de session",
            description: "Une erreur est survenue. Veuillez vous reconnecter.",
          });
          navigate('/login');
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
