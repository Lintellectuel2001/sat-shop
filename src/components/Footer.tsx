import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background py-16 px-4 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Sat-shop</h2>
            <nav className="space-y-4">
              <h3 className="font-semibold mb-4 text-foreground">Products</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/marketplace" className="hover:text-accent transition-colors">Marketplace</Link></li>
                <li><Link to="/" className="hover:text-accent transition-colors">Shop</Link></li>
              </ul>
            </nav>
          </div>

          <div className="col-span-1">
            <nav className="space-y-4">
              <h3 className="font-semibold mb-4 text-foreground">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/" className="hover:text-accent transition-colors">À propos de nous</Link></li>
                <li><Link to="/" className="hover:text-accent transition-colors">Contact</Link></li>
              </ul>
            </nav>
          </div>

          <div className="col-span-1">
            <nav className="space-y-4">
              <h3 className="font-semibold mb-4 text-foreground">Soutien</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/" className="hover:text-accent transition-colors">Centre d'aide</Link></li>
                <li><Link to="/" className="hover:text-accent transition-colors">Politique de confidentialité</Link></li>
              </ul>
            </nav>
          </div>

          <div className="col-span-1">
            <div className="space-y-4">
              <h3 className="font-semibold mb-4 text-foreground">Entrer en contact</h3>
              <p className="text-muted-foreground mb-4">
                Pour toute demande de renseignements, contactez-nous au
                <a href="mailto:mehalli.rabie@gmail.com" className="text-accent hover:text-accent/80 block mt-2 transition-colors">
                  mehalli.rabie@gmail.com
                </a>
              </p>
              <div className="flex gap-4">
                <Link to="/" className="text-accent hover:text-accent/80 transition-colors">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link to="/" className="text-accent hover:text-accent/80 transition-colors">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link to="/" className="text-accent hover:text-accent/80 transition-colors">
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link to="/" className="text-accent hover:text-accent/80 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;