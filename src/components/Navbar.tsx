
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Logo from "./navbar/Logo";
import NavLinks from "./navbar/NavLinks";
import AuthButtons from "./navbar/AuthButtons";
import UserButtons from "./navbar/UserButtons";
import NotificationsMenu from "./marketing/NotificationsMenu";
import MobileMenu from "./navbar/MobileMenu";
import { Menu } from "lucide-react";

interface SiteSettings {
  logo_url: string;
  logo_text: string;
}

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

    const handleSignOut = async () => {
      try {
        await supabase.auth.signOut();
        if (mounted) {
          setIsLoggedIn(false);
          setUserId(null);
          navigate('/login');
          toast({
            title: "Session expirée",
            description: "Votre session a expiré. Veuillez vous reconnecter.",
          });
        }
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };

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

      console.log('Auth state changed:', event);

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
          setIsLoggedIn(!!session);
          setUserId(session?.user?.id || null);
          break;
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

  const toggleMobileMenu = () => {
    console.log("Toggling mobile menu", !isMobileMenuOpen);
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
          
          <div className="hidden md:block">
            <NavLinks />
          </div>

          <div className="hidden md:flex items-center gap-6">
            {isLoggedIn ? (
              <>
                {userId && <NotificationsMenu userId={userId} />}
                <UserButtons onLogout={handleLogout} />
              </>
            ) : (
              <AuthButtons />
            )}
          </div>

          <button 
            className="md:hidden p-2 text-accent rounded-full hover:bg-primary/5"
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <MobileMenu 
          isLoggedIn={isLoggedIn} 
          onLogout={handleLogout} 
          userId={userId}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
