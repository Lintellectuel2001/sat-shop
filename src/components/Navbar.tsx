import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

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
            <span className="text-black font-bold text-2xl">Sat-shop</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/marketplace?category=iptv" 
              className="nav-link hover:text-[#ea384c] transition-colors font-medium"
            >
              IPTV
            </Link>
            <Link 
              to="/marketplace?category=sharing" 
              className="nav-link hover:text-[#ea384c] transition-colors font-medium"
            >
              SHARING
            </Link>
            <Link 
              to="/marketplace?category=vod" 
              className="nav-link hover:text-[#ea384c] transition-colors font-medium"
            >
              VOD
            </Link>
          </div>

          <Link 
            to="/cart" 
            className="flex items-center gap-2 text-[#ea384c] hover:text-[#ea384c]/80 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="font-medium">Panier</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;