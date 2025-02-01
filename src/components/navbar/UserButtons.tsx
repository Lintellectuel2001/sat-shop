import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Shield, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserButtonsProps {
  onLogout: () => void;
}

const UserButtons = ({ onLogout }: UserButtonsProps) => {
  const { data: isAdmin } = useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: adminData } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .single();

      return !!adminData;
    },
  });

  return (
    <>
      <Link 
        to="/profile" 
        className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
      >
        <User className="w-5 h-5" />
        <span className="font-medium">Mon Profil</span>
      </Link>
      
      {isAdmin && (
        <Link 
          to="/admin" 
          className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
        >
          <Shield className="w-5 h-5" />
          <span className="font-medium">Accès Administrateur</span>
        </Link>
      )}

      <Link 
        to="/cart" 
        className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="font-medium">Panier</span>
      </Link>

      <button
        onClick={onLogout}
        className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Déconnexion</span>
      </button>
    </>
  );
};

export default UserButtons;