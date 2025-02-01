import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, UserCog, LogOut, Shield } from "lucide-react";

interface UserButtonsProps {
  onLogout: () => void;
}

const UserButtons = ({ onLogout }: UserButtonsProps) => {
  return (
    <>
      <Link 
        to="/profile" 
        className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
        title="Gérer mon profil"
      >
        <UserCog className="w-5 h-5" />
        <span className="font-medium">Mon Profil</span>
      </Link>
      <Link 
        to="/admin" 
        className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
        title="Accès Administrateur"
      >
        <Shield className="w-5 h-5" />
        <span className="font-medium">Admin</span>
      </Link>
      <button
        onClick={onLogout}
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
  );
};

export default UserButtons;