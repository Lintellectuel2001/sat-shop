
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import NotificationsMenu from "../marketing/NotificationsMenu";
import ThemeToggle from "./ThemeToggle";

export default function UserButtons() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [wishlistItemsCount, setWishlistItemsCount] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkAuth();
    
    const fetchCounts = async () => {
      // Fetch cart count
      const { data: cartData } = await supabase
        .from('cart_items')
        .select('id', { count: 'exact' });
      
      setCartItemsCount(cartData?.length || 0);
      
      // Fetch wishlist count
      const { data: wishlistData } = await supabase
        .from('wishlist_items')
        .select('id', { count: 'exact' });
      
      setWishlistItemsCount(wishlistData?.length || 0);
    };
    
    if (isLoggedIn) {
      fetchCounts();
    }
  }, [isLoggedIn]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vous déconnecter",
      });
    } else {
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      setIsLoggedIn(false);
      navigate('/');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate('/cart')}
        className="relative"
        aria-label="Panier"
      >
        <ShoppingCart className="h-5 w-5" />
        {cartItemsCount > 0 && (
          <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 h-5 min-w-5 flex items-center justify-center bg-accent hover:bg-accent">
            {cartItemsCount}
          </Badge>
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate('/wishlist')}
        className="relative"
        aria-label="Liste de souhaits"
      >
        <Heart className="h-5 w-5" />
        {wishlistItemsCount > 0 && (
          <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 h-5 min-w-5 flex items-center justify-center bg-accent hover:bg-accent">
            {wishlistItemsCount}
          </Badge>
        )}
      </Button>
      
      {isLoggedIn && (
        <>
          <NotificationsMenu />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            aria-label="Profil"
          >
            <User className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            aria-label="Se déconnecter"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </>
      )}
    </div>
  );
}
