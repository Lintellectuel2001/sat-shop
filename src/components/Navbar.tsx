import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Logo from "./navbar/Logo";
import NavLinks from "./navbar/NavLinks";
import AuthButtons from "./navbar/AuthButtons";
import UserButtons from "./navbar/UserButtons";

interface SiteSettings {
  logo_url: string;
  logo_text: string;
}

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching site settings:', error);
        return {
          logo_url: "/lovable-uploads/d7990538-4e18-4b76-bb29-4e16e74bf512.png",
          logo_text: "Sat-shop"
        };
      }
      return data as SiteSettings;
    },
  });

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          if (mounted) {
            setIsLoggedIn(false);
            await supabase.auth.signOut();
            if (error.message.includes('refresh_token_not_found')) {
              toast({
                title: "Session expirée",
                description: "Votre session a expiré. Veuillez vous reconnecter.",
                variant: "destructive",
              });
              navigate('/login');
            } else {
              toast({
                title: "Erreur de session",
                description: "Une erreur est survenue lors de la vérification de votre session",
                variant: "destructive",
              });
            }
          }
          return;
        }

        if (mounted) {
          setIsLoggedIn(!!session);
        }
      } catch (error: any) {
        console.error('Session check error:', error);
        if (mounted) {
          setIsLoggedIn(false);
          toast({
            title: "Erreur de session",
            description: "Une erreur est survenue lors de la vérification de votre session",
            variant: "destructive",
          });
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state changed:', event);

      switch (event) {
        case 'SIGNED_IN':
          setIsLoggedIn(true);
          break;
        case 'SIGNED_OUT':
          setIsLoggedIn(false);
          navigate('/');
          break;
        case 'TOKEN_REFRESHED':
          setIsLoggedIn(!!session);
          break;
        case 'USER_UPDATED':
          setIsLoggedIn(!!session);
          break;
        default:
          setIsLoggedIn(!!session);
          break;
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate('/');
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error);
      toast({
        title: "Erreur lors de la déconnexion",
        description: "Veuillez réessayer",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-20 px-4">
          <Logo 
            logoUrl={settings?.logo_url || "/lovable-uploads/d7990538-4e18-4b76-bb29-4e16e74bf512.png"}
            logoText={settings?.logo_text}
            altText={settings?.logo_text || "Sat-shop"}
          />
          
          <NavLinks />

          <div className="flex items-center gap-6">
            {isLoggedIn ? (
              <UserButtons onLogout={handleLogout} />
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;