import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  color: "accent" | "highlight";
  delay: number;
}

const ServiceCard = ({ icon, title, description, tags, color, delay }: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  
  // Use effect to trigger initial animation
  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.5, delay: delay * 0.2 } });
  }, [controls, delay]);
  
  return (
    <div className="relative">
      <motion.div 
        className="glass rounded-2xl p-8 relative overflow-hidden transition-transform duration-300 ease-out"
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        style={{ 
          transform: isHovered ? 'translateY(-10px)' : 'translateY(0px)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background gradient */}
        <div 
          className={`absolute -inset-0.5 rounded-2xl blur opacity-0 transition-opacity duration-700 ${
            isHovered ? 'opacity-20' : 'opacity-0'
          } ${
            color === "accent" 
              ? "bg-gradient-to-r from-accent to-highlight" 
              : "bg-gradient-to-r from-highlight to-accent"
          }`}
        />
        
        {/* Icon section */}
        <div 
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative ${
            color === "accent" ? "bg-accent/10" : "bg-highlight/10"
          }`}
        >
          {icon}
        </div>
        
        {/* Content */}
        <div className="space-y-4 relative z-10">
          <h3 className="text-xl font-space font-bold mb-4">{title}</h3>
          
          <p className="text-white/70 font-inter mb-6">{description}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className={`text-xs px-3 py-1 rounded-full bg-secondary text-white/80 transition-colors duration-300 ${
                  color === "accent" ? "hover:bg-accent/20" : "hover:bg-highlight/20"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
          
          <a 
            href="#" 
            className={`flex items-center font-inter font-medium text-sm relative ${
              color === "accent" ? "text-accent" : "text-highlight"
            }`}
          >
            <span>Learn more</span>
            <div 
              className="inline-block ml-1 transition-transform duration-200"
              style={{ transform: isHovered ? 'translateX(5px)' : 'translateX(0px)' }}
            >
              <ArrowRight className="h-4 w-4" />
            </div>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default ServiceCard;
