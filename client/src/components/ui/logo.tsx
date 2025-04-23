import React from "react";
import swimLogo from "../../assets/swim-logo-new.png";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <a href="#" className={`flex items-center ${className}`}>
      <img 
        src={swimLogo} 
        alt="SWiM Logo" 
        className="h-16 md:h-20 w-auto" // Increased height for better visibility
      />
    </a>
  );
};

export default Logo;
