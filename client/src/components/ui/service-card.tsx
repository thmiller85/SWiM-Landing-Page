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
  
  return (
    <motion.div 
      className="glass rounded-2xl p-8 relative group overflow-hidden"
      variants={fadeIn}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        y: -10,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      {/* Animated background gradient */}
      <motion.div 
        className={`absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${
          color === "accent" 
            ? "bg-gradient-to-r from-accent to-highlight" 
            : "bg-gradient-to-r from-highlight to-accent"
        }`}
        animate={{
          backgroundPosition: isHovered ? ['0% 0%', '100% 100%'] : '0% 0%',
        }}
        transition={{
          duration: 3,
          ease: "linear",
        }}
      />
      
      <motion.div 
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative ${
          color === "accent" ? "bg-accent/10" : "bg-highlight/10"
        }`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          variants={pulseAnimation}
          initial="hidden"
          animate="visible"
          className="absolute inset-0 rounded-2xl"
        />
        {icon}
      </motion.div>
      
      <motion.h3 
        className="text-xl font-space font-bold mb-4"
        variants={scaleIn}
        custom={delay + 0.1}
      >
        {title}
      </motion.h3>
      
      <motion.p 
        className="text-white/70 font-inter mb-6"
        variants={fadeIn}
        custom={delay + 0.2}
      >
        {description}
      </motion.p>
      
      <motion.div 
        className="flex flex-wrap gap-2 mb-6"
        variants={fadeIn}
        custom={delay + 0.3}
      >
        {tags.map((tag, index) => (
          <motion.span 
            key={index} 
            className={`text-xs px-3 py-1 rounded-full bg-secondary text-white/80 transition-colors duration-300 ${
              color === "accent" ? "hover:bg-accent/20" : "hover:bg-highlight/20"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>
      
      <motion.a 
        href="#" 
        className={`flex items-center font-inter font-medium text-sm relative group overflow-hidden ${
          color === "accent" ? "text-accent" : "text-highlight"
        }`}
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <span>Learn more</span>
        <motion.div
          className="inline-block ml-1"
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowRight className="h-4 w-4" />
        </motion.div>
      </motion.a>
    </motion.div>
  );
};

export default ServiceCard;
