import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, UserCog, LogOut, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial auth state and admin status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      
      if (session) {
        // Check if user is admin
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(!!adminUser);
      }
    };
    
    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsLoggedIn(!!session);
      
      if (session) {
        // Check if user is admin
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(!!adminUser);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate('/');
    } catch (error) {
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
              src="/lovable-uploads/d7990538-4e18-4b76-bb29-4e16e74bf512.png" 
              alt="Sat-shop" 
              className="h-12 w-auto"
            />
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
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                    title="Panel Administrateur"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Admin</span>
                  </Link>
                )}
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
                  to="/register" 
                  className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Inscription</span>
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