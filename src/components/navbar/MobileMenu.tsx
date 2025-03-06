
import React from "react";
import { Link } from "react-router-dom";
import { X, ShoppingCart, User, UserCog, LogOut } from "lucide-react";
import NotificationsMenu from "../marketing/NotificationsMenu";

interface MobileMenuProps {
  isLoggedIn: boolean;
  userId: string | null;
  onLogout: () => void;
  onClose: () => void;
}

const MobileMenu = ({ isLoggedIn, userId, onLogout, onClose }: MobileMenuProps) => {
  return (
    <div className="mobile-menu animate-in fade-in zoom-in">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-end mb-6">
          <button 
            onClick={onClose}
            className="p-2 text-accent rounded-full hover:bg-muted transition-colors"
            aria-label="Fermer le menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col space-y-6">
          {/* Navigation links */}
          <div className="space-y-4">
            <Link 
              to="/" 
              className="block text-lg font-medium text-primary hover:text-accent transition-colors"
              onClick={onClose}
            >
              Accueil
            </Link>
            <Link 
              to="/marketplace" 
              className="block text-lg font-medium text-primary hover:text-accent transition-colors"
              onClick={onClose}
            >
              Marketplace
            </Link>
            <Link 
              to="/contact" 
              className="block text-lg font-medium text-primary hover:text-accent transition-colors"
              onClick={onClose}
            >
              Contactez-nous
            </Link>
          </div>

          <div className="h-px bg-muted/50 w-full my-2"></div>

          {/* User or auth actions */}
          <div className="space-y-4">
            {isLoggedIn ? (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center gap-3 text-primary hover:text-accent transition-colors"
                  onClick={onClose}
                >
                  <UserCog size={20} />
                  <span className="text-lg font-medium">Mon Profil</span>
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="flex items-center gap-3 text-primary hover:text-accent transition-colors w-full text-left"
                >
                  <LogOut size={20} />
                  <span className="text-lg font-medium">Déconnexion</span>
                </button>
                {userId && (
                  <div className="py-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-medium">Notifications</span>
                    </div>
                    <NotificationsMenu userId={userId} />
                  </div>
                )}
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center gap-3 text-primary hover:text-accent transition-colors"
                  onClick={onClose}
                >
                  <User size={20} />
                  <span className="text-lg font-medium">Connexion</span>
                </Link>
              </>
            )}

            <Link 
              to="/cart" 
              className="flex items-center gap-3 text-primary hover:text-accent transition-colors"
              onClick={onClose}
            >
              <ShoppingCart size={20} />
              <span className="text-lg font-medium">Panier</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
