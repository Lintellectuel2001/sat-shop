import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/abe758f9-67c7-455d-a24a-0e6f3224a168.png" 
              alt="Sat-shop" 
              className="h-12 w-auto"
            />
            <span className="text-[#ea384c] font-bold text-2xl">SAT-SHOP</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">
              Accueil
            </Link>
            <Link to="/marketplace" className="nav-link">
              Services
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline">
              Se connecter
            </Button>
            <Button>
              S'inscrire
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;