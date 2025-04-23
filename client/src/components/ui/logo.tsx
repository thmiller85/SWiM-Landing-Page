import React from "react";
import swimLogoPath from "../../assets/swim-logo.svg";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <a href="#" className={`flex items-center ${className}`}>
      <img 
        src={swimLogoPath} 
        alt="SWiM Logo" 
        className="h-12 w-auto" 
      />
    </a>
  );
};

export default Logo;
