
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecurityEvent {
  action: string;
  resource: string;
  details?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export const useSecureAuthState = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user');
  const [sessionExpired, setSessionExpired] = useState(false);
  const { toast } = useToast();

  // Security event logging function
  const logSecurityEvent = useCallback(async (event: SecurityEvent) => {
    try {
      await supabase.rpc('log_security_event', {
        p_action: event.action,
        p_resource: event.resource,
        p_details: event.details ? JSON.stringify(event.details) : null,
        p_severity: event.severity || 'medium'
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, []);

  // Secure sign out with proper cleanup
  const handleSecureSignOut = useCallback(async (reason?: string) => {
    try {
      await logSecurityEvent({
        action: 'logout',
        resource: 'authentication',
        details: { reason: reason || 'user_initiated' },
        severity: 'low'
      });

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setIsLoggedIn(false);
      setUserId(null);
      setUserRole('user');
      setSessionExpired(false);
      
      // Only navigate if we're in a Router context
      try {
        window.location.href = '/';
      } catch (error) {
        console.log('Navigation failed, user will need to manually refresh');
      }
      
      toast({
        title: "Déconnexion réussie",
        description: reason === 'session_expired' ? "Votre session a expiré" : "À bientôt !",
      });
    } catch (error: any) {
      console.error('Secure logout error:', error);
      
      await logSecurityEvent({
        action: 'logout_failed',
        resource: 'authentication',
        details: { error: error.message },
        severity: 'high'
      });
      
      toast({
        title: "Erreur lors de la déconnexion",
        description: "Veuillez réessayer",
        variant: "destructive",
      });
    }
  }, [toast, logSecurityEvent]);

  // Enhanced session validation
  const validateSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session validation error:', error);
        
        await logSecurityEvent({
          action: 'session_validation_failed',
          resource: 'authentication',
          details: { error: error.message },
          severity: 'high'
        });

        if (error.message.includes('refresh_token_not_found') || 
            error.message.includes('invalid_grant')) {
          setSessionExpired(true);
          await handleSecureSignOut('session_expired');
          return false;
        }
        
        setIsLoggedIn(false);
        setUserId(null);
        setUserRole('user');
        return false;
      }

      if (!session) {
        setIsLoggedIn(false);
        setUserId(null);
        setUserRole('user');
        return false;
      }

      // Check if session is close to expiring (within 5 minutes)
      const expiresAt = session.expires_at;
      if (expiresAt && (expiresAt * 1000 - Date.now()) < 300000) {
        try {
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            await handleSecureSignOut('session_refresh_failed');
            return false;
          }
        } catch (refreshError) {
          await handleSecureSignOut('session_refresh_failed');
          return false;
        }
      }

      // Get user role securely
      try {
        const { data: roleData, error: roleError } = await supabase.rpc('get_current_user_role');
        if (roleError) {
          console.error('Role check error:', roleError);
          setUserRole('user');
        } else {
          setUserRole(roleData as 'admin' | 'user');
        }
      } catch (roleError) {
        console.error('Role check failed:', roleError);
        setUserRole('user');
      }

      setIsLoggedIn(true);
      setUserId(session.user.id);
      return true;
    } catch (error: any) {
      console.error('Session validation failed:', error);
      
      await logSecurityEvent({
        action: 'session_validation_error',
        resource: 'authentication',
        details: { error: error.message },
        severity: 'critical'
      });
      
      setIsLoggedIn(false);
      setUserId(null);
      setUserRole('user');
      return false;
    }
  }, [handleSecureSignOut, logSecurityEvent]);

  useEffect(() => {
    let mounted = true;
    let sessionCheckInterval: NodeJS.Timeout;

    const initializeAuth = async () => {
      await validateSession();
      
      // Set up periodic session validation (every 5 minutes)
      sessionCheckInterval = setInterval(() => {
        if (mounted) {
          validateSession();
        }
      }, 300000);
    };

    initializeAuth();

    // Enhanced auth state change handler
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      await logSecurityEvent({
        action: `auth_${event}`,
        resource: 'authentication',
        details: { userId: session?.user?.id },
        severity: event === 'SIGNED_OUT' ? 'low' : 'medium'
      });

      switch (event) {
        case 'SIGNED_IN':
          if (session) {
            setIsLoggedIn(true);
            setUserId(session.user.id);
            setSessionExpired(false);
            await validateSession();
          }
          break;
        case 'SIGNED_OUT':
          setIsLoggedIn(false);
          setUserId(null);
          setUserRole('user');
          setSessionExpired(false);
          break;
        case 'TOKEN_REFRESHED':
          if (session) {
            setIsLoggedIn(true);
            setUserId(session.user.id);
          }
          break;
        default:
          await validateSession();
          break;
      }
    });

    return () => {
      mounted = false;
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
      }
      subscription.unsubscribe();
    };
  }, [validateSession, logSecurityEvent]);

  return { 
    isLoggedIn, 
    userId, 
    userRole,
    sessionExpired,
    handleSecureSignOut,
    validateSession,
    logSecurityEvent
  };
};
