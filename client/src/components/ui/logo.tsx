import React from "react";
import { Link, useLocation } from "wouter";
import swimLogo from "../../assets/swim-logo-transparent.png";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  const [location] = useLocation();

  const handleLogoClick = (e: React.MouseEvent) => {
    // If we're already on the homepage, scroll to top instead of navigating
    if (location === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // For other pages, the Link component will handle navigation normally
  };

  return (
    <Link href="/" className={`flex items-center ${className}`} onClick={handleLogoClick}>
      <img 
        src={swimLogo} 
        alt="SWiM Logo" 
        className="h-24 md:h-32 w-auto" // Increased height for better visibility
      />
    </Link>
  );
};

export default Logo;
