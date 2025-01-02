import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthError, Session, User, AuthChangeEvent } from "@supabase/supabase-js";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          throw error;
        }
        
        console.log("Current session state in Navbar:", session);
        
        if (mounted) {
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Auth error in Navbar:", error);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    }

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      console.log("Auth state changed in Navbar:", event, session);
      
      if (!mounted) return;
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate("/", { replace: true });
        return;
      }
      
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      
      // First clear the local state
      setUser(null);
      
      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // Check for both possible session not found error messages
        if (error.message.includes("session_not_found") || 
            error.message.includes("Session from session_id claim in JWT does not exist")) {
          console.log("Session already cleared");
          toast.success("Déconnexion réussie");
          navigate("/", { replace: true });
          return;
        }
        
        // For other errors, throw them to be caught below
        throw error;
      }
      
      console.log("Logout successful");
      toast.success("Déconnexion réussie");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, we want to clear the local state and redirect
      setUser(null);
      toast.success("Déconnexion réussie");
      navigate("/", { replace: true });
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
              <div className="flex items-center space-x-4">
                <Link to="/profile">
                  <Button variant="ghost">Mon Profil</Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  {isLoading ? "..." : "Se déconnecter"}
                </Button>
              </div>
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
}

export default Navbar;