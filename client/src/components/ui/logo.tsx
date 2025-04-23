import React from "react";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <a href="#" className={`flex items-center ${className}`}>
      <img 
        src="/images/swim-logo.jpg" 
        alt="SWiM Logo" 
        className="h-10 w-auto" 
      />
    </a>
  );
};

export default Logo;
