
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
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);

        if (!session) {
          // Clear any stale session data
          await supabase.auth.signOut();
        }
      } catch (error) {
        console.error('Session check error:', error);
        setIsLoggedIn(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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
          if (!session) {
            setIsLoggedIn(false);
            // Clear session on any unhandled auth events if no session exists
            await supabase.auth.signOut();
          }
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
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
