import React, { useState } from "react";
import { Menu, X, ShoppingCart, User, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import NotificationsMenu from "../marketing/NotificationsMenu";

const ModernNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isLoggedIn, userId, handleSignOut } = useAuthState();
  const { data: settings } = useSiteSettings();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Contact", href: "/contact" },
  ];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchTerm = formData.get('search') as string;
    if (searchTerm.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={settings?.logo_url || "/lovable-uploads/d7990538-4e18-4b76-bb29-4e16e74bf512.png"}
              alt={settings?.logo_text || "Sat-shop"}
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-accent-600 to-accent-800 bg-clip-text text-transparent">
              {settings?.logo_text || "Sat-shop"}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => navigate(link.href)}
                className="text-foreground hover:text-accent-600 font-medium transition-colors duration-200 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-500 transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="relative">
                <Input
                  name="search"
                  placeholder="Rechercher un produit..."
                  className="pr-10 bg-background/50 border-border/50 focus:border-accent-300"
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </form>
            ) : (
              <Button
                variant="ghost"
                onClick={() => setIsSearchOpen(true)}
                className="w-full justify-start text-muted-foreground hover:text-foreground bg-background/50 border border-border/50"
              >
                <Search className="w-4 h-4 mr-2" />
                Rechercher...
              </Button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search - Mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </Button>

            {isLoggedIn ? (
              <>
                {/* Notifications */}
                {userId && <NotificationsMenu userId={userId} />}
                
                {/* Wishlist */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/wishlist')}
                  className="relative"
                >
                  <Heart className="w-5 h-5" />
                </Button>

                {/* Cart */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/cart')}
                  className="relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                </Button>

                {/* Profile */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/profile')}
                >
                  <User className="w-5 h-5" />
                </Button>

                {/* Logout */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="hidden md:flex"
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/?auth=login')}
                >
                  Connexion
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/?auth=register')}
                >
                  S'inscrire
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="lg:hidden py-4 border-t border-border/50">
            <form onSubmit={handleSearch}>
              <Input
                name="search"
                placeholder="Rechercher un produit..."
                className="bg-background/50 border-border/50 focus:border-accent-300"
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/50">
          <div className="container mx-auto px-4 py-6">
            <div className="space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    navigate(link.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-foreground hover:text-accent-600 font-medium transition-colors"
                >
                  {link.name}
                </button>
              ))}
              
              {isLoggedIn ? (
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-foreground hover:text-accent-600 font-medium transition-colors"
                  >
                    Mon Profil
                  </button>
                  <button
                    onClick={() => {
                      navigate('/wishlist');
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-foreground hover:text-accent-600 font-medium transition-colors"
                  >
                    Ma Liste de Souhaits
                  </button>
                  <button
                    onClick={() => {
                      navigate('/cart');
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-foreground hover:text-accent-600 font-medium transition-colors"
                  >
                    Mon Panier
                  </button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 pt-4 border-t border-border/50">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate('/?auth=login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    Connexion
                  </Button>
                  <Button
                    onClick={() => {
                      navigate('/?auth=register');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    S'inscrire
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ModernNavbar;