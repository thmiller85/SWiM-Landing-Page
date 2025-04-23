import React from "react";
import swimLogo from "../../assets/swim-logo.jpg";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <a href="#" className={`flex items-center ${className}`}>
      <img 
        src={swimLogo} 
        alt="SWiM Logo" 
        className="h-10 w-auto" 
      />
    </a>
  );
};

export default Logo;
