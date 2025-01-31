import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const NavLinks = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

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
      
      <div className="relative flex items-center">
        {showSearch ? (
          <form onSubmit={handleSearch} className="flex items-center">
            <Input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 h-8 text-sm"
              autoFocus
              onBlur={() => {
                if (!searchQuery) {
                  setShowSearch(false);
                }
              }}
            />
          </form>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default NavLinks;