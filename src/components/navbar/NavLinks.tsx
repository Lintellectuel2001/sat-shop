
import React from "react";
import { Link } from "react-router-dom";

const NavLinks = () => {
  return (
    <div className="flex items-center space-x-8">
      <Link 
        to="/" 
        className="text-accent hover:text-primary transition-colors font-medium"
      >
        Accueil
      </Link>
      <Link 
        to="/marketplace" 
        className="text-accent hover:text-primary transition-colors font-medium"
      >
        Boutique
      </Link>
      <Link 
        to="/orders" 
        className="text-accent hover:text-primary transition-colors font-medium"
      >
        Commandes
      </Link>
      <Link 
        to="/contact" 
        className="text-accent hover:text-primary transition-colors font-medium"
      >
        Contact
      </Link>
    </div>
  );
};

export default NavLinks;
