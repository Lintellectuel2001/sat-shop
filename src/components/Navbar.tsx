import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
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
        
        if (mounted) {
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.info("Auth state changed in Navbar:", event, session);
        console.info("Current session state in Navbar:", session);

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
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
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

      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

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
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-primary">
            Sat-shop
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="text-primary hover:text-accent transition-colors">
              Accueil
            </Link>
            <Link to="/marketplace" className="text-primary hover:text-accent transition-colors">
              Marketplace
            </Link>
            <Link to="/contact" className="text-primary hover:text-accent transition-colors">
              Contactez-nous
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/profile" 
                  className="text-primary hover:text-accent transition-colors"
                >
                  Mon Profil
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="text-primary hover:text-accent transition-colors disabled:opacity-50"
                >
                  {isLoading ? "..." : "Déconnexion"}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-primary hover:text-accent transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-accent text-white px-4 py-2 rounded hover:bg-accent/90 transition-colors"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}