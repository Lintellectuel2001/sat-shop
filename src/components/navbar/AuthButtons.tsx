import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";

const AuthButtons = () => {
  return (
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
  );
};

export default AuthButtons;