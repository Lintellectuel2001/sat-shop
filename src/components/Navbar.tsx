import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        console.log("Current session in Navbar:", session);
        
        if (mounted) {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error("Session check error in Navbar:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed in Navbar:", event, session);
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log("Logout successful");
      toast.success("Déconnexion réussie");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Erreur lors de la déconnexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="bg-white shadow-elegant">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-primary">
            Sat-shop
          </Link>
          
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="text-gray-600 hover:text-primary">
              Accueil
            </Link>
            <Link to="/marketplace" className="text-gray-600 hover:text-primary">
              Marketplace
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-primary">
              Contactez-nous
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            ) : user ? (
              <Button 
                variant="outline" 
                onClick={handleLogout}
                disabled={isLoading}
              >
                {isLoading ? "..." : "Se déconnecter"}
              </Button>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="outline">S'inscrire</Button>
                </Link>
                <Link to="/login">
                  <Button>Se connecter</Button>
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