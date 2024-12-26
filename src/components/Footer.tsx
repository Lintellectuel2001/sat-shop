import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white py-16 px-4 border-t">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h2 className="text-2xl font-bold mb-6">Sat-shop</h2>
            <nav className="space-y-4">
              <h3 className="font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-accent">
                <li><Link to="/marketplace">Marketplace</Link></li>
                <li><Link to="/">Shop</Link></li>
              </ul>
            </nav>
          </div>

          <div className="col-span-1">
            <nav className="space-y-4">
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-accent">
                <li><Link to="/">About Us</Link></li>
                <li><Link to="/">Contact</Link></li>
              </ul>
            </nav>
          </div>

          <div className="col-span-1">
            <nav className="space-y-4">
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-accent">
                <li><Link to="/">Help Center</Link></li>
                <li><Link to="/">Privacy Policy</Link></li>
              </ul>
            </nav>
          </div>

          <div className="col-span-1">
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Get in touch</h3>
              <p className="text-accent mb-4">
                For any inquiries, reach us at
                <a href="mailto:contact@ezshop.com" className="text-primary block mt-2">
                  contact@ezshop.com
                </a>
              </p>
              <div className="flex gap-4">
                <Link to="/" className="text-accent hover:text-primary">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link to="/" className="text-accent hover:text-primary">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link to="/" className="text-accent hover:text-primary">
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link to="/" className="text-accent hover:text-primary">
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