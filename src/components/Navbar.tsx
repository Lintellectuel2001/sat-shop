import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, UserCog, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CartHistoryItem {
  id: string;
  action_type: string;
  product_id: string;
  created_at: string;
}

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartHistory, setCartHistory] = useState<CartHistoryItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      if (session) {
        fetchCartHistory();
      }
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        fetchCartHistory();
      } else {
        setCartHistory([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCartHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('cart_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setCartHistory(data || []);
    } catch (error) {
      console.error('Error fetching cart history:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Erreur lors de la déconnexion",
        description: "Veuillez réessayer",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Link 
                      to="/cart" 
                      className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span className="font-medium">Panier</span>
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <h3 className="font-semibold mb-2">Historique récent</h3>
                    <ScrollArea className="h-[200px]">
                      {cartHistory.length > 0 ? (
                        <div className="space-y-2">
                          {cartHistory.map((item) => (
                            <div key={item.id} className="text-sm border-b pb-2">
                              <p className="font-medium">{item.action_type}</p>
                              <p className="text-muted-foreground text-xs">
                                {formatDate(item.created_at)}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Aucun historique disponible
                        </p>
                      )}
                    </ScrollArea>
                  </HoverCardContent>
                </HoverCard>
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