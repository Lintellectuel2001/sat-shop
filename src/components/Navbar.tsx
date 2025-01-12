import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import CartHistory from "./CartHistory";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          setIsLoggedIn(false);
          if (error.message.includes('refresh_token_not_found')) {
            await supabase.auth.signOut();
          }
          return;
        }

        if (mounted) {
          setIsLoggedIn(!!session);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setIsLoggedIn(false);
      }
    };

    checkSession();

    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, 'Session:', !!session);

      switch (event) {
        case 'SIGNED_IN':
          setIsLoggedIn(true);
          break;
        case 'SIGNED_OUT':
          setIsLoggedIn(false);
          navigate('/');
          break;
        case 'TOKEN_REFRESHED':
        case 'USER_UPDATED':
          setIsLoggedIn(!!session);
          break;
        case 'INITIAL_SESSION':
          setIsLoggedIn(!!session);
          break;
        default:
          console.log('Unhandled auth event:', event);
          setIsLoggedIn(!!session);
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [mounted, navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow">
      <Link to="/" className="text-lg font-bold">MyApp</Link>
      <div className="flex items-center">
        <Link to="/cart" className="mr-4">
          <CartHistory />
        </Link>
        {isLoggedIn ? (
          <>
            <Button onClick={handleLogout}>Logout</Button>
            <Link to="/profile" className="ml-4">
              <User className="h-6 w-6" />
            </Link>
          </>
        ) : (
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;