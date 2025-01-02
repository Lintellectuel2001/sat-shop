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
          // If we get a refresh token error, clear state and redirect
          if (error.message.includes('refresh_token')) {
            if (mounted) {
              setUser(null);
              setIsLoading(false);
              navigate("/", { replace: true });
            }
            return;
          }
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
      
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        // Handle both sign out and token refresh events
        if (!session) {
          setUser(null);
          navigate("/", { replace: true });
          return;
        }
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
      
      // First check if we have a session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.warn("Session check error during logout:", sessionError);
        // If it's a refresh token error, just clear local state
        if (sessionError.message.includes('refresh_token')) {
          setUser(null);
          toast.success("Déconnexion réussie");
          navigate("/", { replace: true });
          return;
        }
      }
      
      // Clear local state first
      setUser(null);
      
      // Only attempt to sign out if we have a session
      if (session) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.warn("Sign out error:", error);
        }
      } else {
        console.log("No active session found during logout");
      }
      
      // Always show success and redirect
      toast.success("Déconnexion réussie");
      navigate("/", { replace: true });
      
    } catch (error) {
      console.warn("Unexpected logout error:", error);
      // Still redirect since we've cleared the local state
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