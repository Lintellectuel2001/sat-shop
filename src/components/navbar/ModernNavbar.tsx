import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ShoppingCart, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import AuthButtons from "./AuthButtons";
import UserButtons from "./UserButtons";
import NotificationsMenu from "../marketing/NotificationsMenu";
import { ThemeToggle } from "../ui/theme-toggle";
import MobileMenu from "./MobileMenu";
import { useAuthState } from "@/hooks/useAuthState";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const ModernNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { isLoggedIn, userId, handleSignOut } = useAuthState();
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'glass-effect shadow-elegant backdrop-blur-2xl' 
          : 'bg-background/70 backdrop-blur-xl'
      }`}
    >
      <div className="container-modern">
        <div className="flex items-center justify-between h-20 px-4">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Logo 
              logoUrl={settings?.logo_url || "/lovable-uploads/d7990538-4e18-4b76-bb29-4e16e74bf512.png"}
              logoText={settings?.logo_text}
              altText={settings?.logo_text || "Sat-shop"}
            />
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLinks />
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <AnimatePresence>
              {searchOpen ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 300, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <Input
                    placeholder="Rechercher des produits..."
                    className="input-modern pr-10"
                    autoFocus
                    onBlur={() => setSearchOpen(false)}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchOpen(true)}
                  className="p-3 rounded-xl hover:bg-secondary/50 transition-colors duration-200"
                >
                  <Search className="w-5 h-5 text-foreground/70" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ThemeToggle />
            </motion.div>
            
            {isLoggedIn ? (
              <>
                {/* Cart Icon */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-3 rounded-xl hover:bg-secondary/50 transition-colors duration-200"
                >
                  <ShoppingCart className="w-5 h-5 text-foreground/70" />
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    3
                  </span>
                </motion.button>
                
                {/* Notifications */}
                {userId && (
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <NotificationsMenu userId={userId} />
                  </motion.div>
                )}
                
                {/* User Menu */}
                <motion.div whileHover={{ scale: 1.05 }}>
                  <UserButtons onLogout={handleSignOut} />
                </motion.div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <AuthButtons />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-3 text-foreground rounded-xl hover:bg-secondary/50 transition-colors duration-200"
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden border-t border-border/50 glass-effect"
          >
            <div className="container-modern p-6">
              {/* Mobile Search */}
              <div className="mb-6">
                <Input
                  placeholder="Rechercher des produits..."
                  className="input-modern"
                />
              </div>
              
              {/* Mobile Navigation */}
              <div className="space-y-4 mb-6">
                <NavLinks />
              </div>
              
              {/* Mobile Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-xl hover:bg-secondary/50 transition-colors duration-200"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </motion.button>
                  <ThemeToggle />
                </div>
                
                <div className="flex items-center gap-2">
                  {isLoggedIn ? (
                    <UserButtons onLogout={handleSignOut} />
                  ) : (
                    <AuthButtons />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default ModernNavbar;