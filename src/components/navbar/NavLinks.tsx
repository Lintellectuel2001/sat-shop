
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavLinks = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link 
        to="/" 
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive('/') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        Accueil
      </Link>
      <Link 
        to="/marketplace" 
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive('/marketplace') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        Boutique
      </Link>
      <Link 
        to="/order-tracking" 
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive('/order-tracking') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        Suivi commande
      </Link>
      <Link 
        to="/contact" 
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive('/contact') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        Contact
      </Link>
    </nav>
  );
};

export default NavLinks;
