import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  logoUrl: string;
  logoText?: string;
  altText: string;
}

const Logo = ({ logoUrl, logoText, altText }: LogoProps) => {
  return (
    <Link to="/" className="flex items-center gap-3">
      <img 
        src={logoUrl}
        alt={altText}
        className="h-12 w-auto hover-lift animate-glow transition-all duration-500 hover:scale-110"
        style={{ 
          filter: 'drop-shadow(0 5px 15px rgba(99, 102, 241, 0.3))',
          transformStyle: 'preserve-3d'
        }}
      />
      {logoText && (
        <span className="text-lg font-semibold text-primary">
          {logoText}
        </span>
      )}
    </Link>
  );
};

export default Logo;