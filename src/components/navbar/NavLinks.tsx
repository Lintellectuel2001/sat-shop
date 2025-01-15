import React from "react";
import { Link } from "react-router-dom";

const NavLinks = () => {
  return (
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
  );
};

export default NavLinks;