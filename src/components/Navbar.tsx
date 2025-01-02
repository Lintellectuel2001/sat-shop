import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-elegant">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-primary">
            Sat-shop
          </Link>
          
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="text-gray-600 hover:text-primary">
              Accueil
            </Link>
            <Link to="/marketplace" className="text-gray-600 hover:text-primary">
              Marketplace
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-primary">
              Contactez-nous
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/register">
              <Button variant="outline">S'inscrire</Button>
            </Link>
            <Link to="/login">
              <Button>Se connecter</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;