import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeIn, scaleIn, pulseAnimation } from "@/lib/animations";

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
  
  // Main card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: delay * 0.2,
      }
    },
    hover: {
      y: -10,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };
  
  // Content animations
  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        delay: delay * 0.2 + 0.2
      }
    }
  };
  
  return (
    <motion.div 
      className="glass rounded-2xl p-8 relative group overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: false, amount: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div 
        className={`absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${
          color === "accent" 
            ? "bg-gradient-to-r from-accent to-highlight" 
            : "bg-gradient-to-r from-highlight to-accent"
        }`}
      />
      
      <div 
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative ${
          color === "accent" ? "bg-accent/10" : "bg-highlight/10"
        }`}
      >
        <div
          className="absolute inset-0 rounded-2xl"
        />
        {icon}
      </div>
      
      <motion.div
        variants={contentVariants}
        className="space-y-4"
      >
        <h3 className="text-xl font-space font-bold mb-4">
          {title}
        </h3>
        
        <p className="text-white/70 font-inter mb-6">
          {description}
        </p>
        
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
          className={`flex items-center font-inter font-medium text-sm relative overflow-hidden ${
            color === "accent" ? "text-accent" : "text-highlight"
          }`}
        >
          <span>Learn more</span>
          <div className="inline-block ml-1">
            <ArrowRight className="h-4 w-4" />
          </div>
        </a>
      </motion.div>
    </motion.div>
  );
};

export default ServiceCard;
