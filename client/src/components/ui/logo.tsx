import React from "react";
import swimLogo from "../../assets/swim-logo-transparent.png";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <a href="#" className={`flex items-center ${className}`}>
      <img 
        src={swimLogo} 
        alt="SWiM Logo" 
        className="h-20 md:h-24 w-auto" // Increased height for better visibility
      />
    </a>
  );
};

export default Logo;
