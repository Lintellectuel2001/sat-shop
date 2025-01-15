import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, UserCog, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

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
            // Clear the session if there's an error
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

    // Check initial session
    checkSession();

    // Subscribe to auth changes
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
          // Handle any other events
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
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={settings?.logo_url || "/lovable-uploads/d7990538-4e18-4b76-bb29-4e16e74bf512.png"} 
              alt={settings?.logo_text || "Sat-shop"} 
              className="h-12 w-auto"
            />
            {settings?.logo_text && (
              <span className="text-lg font-semibold text-primary">
                {settings.logo_text}
              </span>
            )}
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="nav-link font-medium"
            >
              Accueil
            </Link>
            <Link 
              to="/marketplace" 
              className="nav-link font-medium"
            >
              Marketplace
            </Link>
            <Link 
              to="/contact" 
              className="nav-link font-medium"
            >
              Contactez-nous
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                  title="Gérer mon profil"
                >
                  <UserCog className="w-5 h-5" />
                  <span className="font-medium">Mon Profil</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Déconnexion</span>
                </button>
                <Link 
                  to="/cart" 
                  className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-medium">Panier</span>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Connexion</span>
                </Link>
                <Link 
                  to="/cart" 
                  className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-medium">Panier</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
