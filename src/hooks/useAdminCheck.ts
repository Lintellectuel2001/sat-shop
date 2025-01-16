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
        
        if (sessionError || !session) {
          if (mounted) {
            setIsAdmin(false);
            setIsLoading(false);
            setSessionChecked(true);
            if (sessionError?.message.includes('refresh_token_not_found')) {
              await supabase.auth.signOut();
              toast({
                variant: "destructive",
                title: "Session expirée",
                description: "Votre session a expiré. Veuillez vous reconnecter.",
              });
            } else {
              toast({
                variant: "destructive",
                title: "Erreur",
                description: "Vous devez être connecté pour accéder à cette page",
              });
            }
            navigate('/login');
          }
          return;
        }

        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();

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
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Une erreur est survenue lors de la vérification des droits",
          });
          navigate('/');
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