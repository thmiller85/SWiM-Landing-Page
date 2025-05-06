import React from "react";
import { Link } from "wouter";
import swimLogo from "../../assets/swim-logo-transparent.png";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <img 
        src={swimLogo} 
        alt="SWiM Logo" 
        className="h-24 md:h-32 w-auto" // Increased height for better visibility
      />
    </Link>
  );
};

export default Logo;
