
import { Link, useLocation } from 'react-router-dom';

const NavLinks = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const linkClass = (path: string) => 
    `nav-link ${isActive(path) ? 'text-accent-600' : ''}`;

  return (
    <div className="flex items-center space-x-1">
      <Link to="/" className={linkClass('/')}>
        Accueil
      </Link>
      <Link to="/marketplace" className={linkClass('/marketplace')}>
        Marketplace
      </Link>
      <Link to="/cod" className={linkClass('/cod')}>
        Livraison
      </Link>
      <Link to="/contact" className={linkClass('/contact')}>
        Contact
      </Link>
    </div>
  );
};

export default NavLinks;
