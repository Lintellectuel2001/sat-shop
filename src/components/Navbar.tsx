
import React, { useState } from "react";
import { Menu } from "lucide-react";
import Logo from "./navbar/Logo";
import NavLinks from "./navbar/NavLinks";
import AuthButtons from "./navbar/AuthButtons";
import UserButtons from "./navbar/UserButtons";
import NotificationsMenu from "./marketing/NotificationsMenu";
import MobileMenu from "./navbar/MobileMenu";
import { useAuthState } from "@/hooks/useAuthState";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, userId, handleSignOut, isLoading } = useAuthState();
  const { data: settings } = useSiteSettings();

  const toggleMobileMenu = () => {
    console.log("Toggling mobile menu", !isMobileMenuOpen);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-20 px-4">
          <Logo 
            logoUrl={settings?.logo_url || "/lovable-uploads/d7990538-4e18-4b76-bb29-4e16e74bf512.png"}
            logoText={settings?.logo_text}
            altText={settings?.logo_text || "Sat-shop"}
          />
          
          <div className="hidden md:block">
            <NavLinks />
          </div>

          <div className="hidden md:flex items-center gap-6">
            {!isLoading && (
              <>
                {isLoggedIn ? (
                  <>
                    {userId && <NotificationsMenu userId={userId} />}
                    <UserButtons onLogout={handleSignOut} />
                  </>
                ) : (
                  <AuthButtons />
                )}
              </>
            )}
          </div>

          <button 
            className="md:hidden p-2 text-accent rounded-full hover:bg-primary/5"
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      <MobileMenu 
        isLoggedIn={isLoggedIn} 
        onLogout={handleSignOut} 
        userId={userId}
        onClose={() => setIsMobileMenuOpen(false)}
        isOpen={isMobileMenuOpen}
      />
    </nav>
  );
};

export default Navbar;
