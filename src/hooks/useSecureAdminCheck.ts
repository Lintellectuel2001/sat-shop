
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSecureAuthState } from './useSecureAuthState';

export const useSecureAdminCheck = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, userRole, validateSession, logSecurityEvent } = useSecureAuthState();

  useEffect(() => {
    let mounted = true;

    const checkSecureAdminStatus = async () => {
      try {
        setIsLoading(true);

        // First validate the session
        const sessionValid = await validateSession();
        if (!sessionValid) {
          if (mounted) {
            await logSecurityEvent({
              action: 'admin_access_denied',
              resource: 'admin_panel',
              details: { reason: 'invalid_session' },
              severity: 'high'
            });

            toast({
              variant: "destructive",
              title: "Accès refusé",
              description: "Session invalide. Veuillez vous reconnecter.",
            });
            navigate('/login');
          }
          return;
        }

        if (!isLoggedIn) {
          if (mounted) {
            await logSecurityEvent({
              action: 'admin_access_denied',
              resource: 'admin_panel',
              details: { reason: 'not_authenticated' },
              severity: 'medium'
            });

            toast({
              variant: "destructive",
              title: "Accès refusé",
              description: "Vous devez être connecté pour accéder à cette page",
            });
            navigate('/login');
          }
          return;
        }

        // Use the secure role check
        if (userRole !== 'admin') {
          if (mounted) {
            await logSecurityEvent({
              action: 'admin_access_denied',
              resource: 'admin_panel',
              details: { reason: 'insufficient_privileges', userRole },
              severity: 'high'
            });

            toast({
              variant: "destructive",
              title: "Accès refusé",
              description: "Vous n'avez pas les droits d'administration",
            });
            navigate('/');
          }
          return;
        }

        // Log successful admin access
        await logSecurityEvent({
          action: 'admin_access_granted',
          resource: 'admin_panel',
          severity: 'medium'
        });

        if (mounted) {
          setIsAdmin(true);
        }
      } catch (error: any) {
        if (mounted) {
          console.error('Error in secure admin check:', error);
          
          await logSecurityEvent({
            action: 'admin_check_error',
            resource: 'admin_panel',
            details: { error: error.message },
            severity: 'critical'
          });
          
          toast({
            variant: "destructive",
            title: "Erreur de sécurité",
            description: "Une erreur est survenue. Accès refusé par sécurité.",
          });
          navigate('/');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
          setSessionChecked(true);
        }
      }
    };

    checkSecureAdminStatus();

    return () => {
      mounted = false;
    };
  }, [navigate, toast, isLoggedIn, userRole, validateSession, logSecurityEvent]);

  return { isAdmin, isLoading, sessionChecked };
};
