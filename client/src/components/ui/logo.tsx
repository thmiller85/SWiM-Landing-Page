import React from "react";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <a href="#" className={`flex items-center space-x-2 ${className}`}>
      <div className="relative h-10 w-10 rounded-full bg-gradient-to-r from-accent to-highlight flex items-center justify-center">
        <span className="font-space font-bold text-xl">S</span>
      </div>
      <span className="text-2xl font-space font-bold text-white">SWiM</span>
    </a>
  );
};

export default Logo;
