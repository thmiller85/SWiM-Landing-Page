import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  color: "accent" | "highlight";
  delay: number;
  id: string;
}

const ServiceCard = ({ icon, title, description, tags, color, delay, id }: ServiceCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [_, setLocation] = useLocation();
  
  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 100,
        delay: delay * 0.2
      }
    }
  };
  
  // Content animation variants with staggered children
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: delay * 0.2 + 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", damping: 20, stiffness: 90 }
    }
  };

  const handleCardClick = () => {
    setLocation(`/services/${id}`);
  };
  
  return (
    <div ref={ref} className="h-full">
      <motion.div 
        className="glass rounded-2xl p-8 h-full flex flex-col relative group overflow-hidden cursor-pointer"
        variants={cardVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        whileHover={{ y: -10, transition: { duration: 0.3, ease: "easeOut" } }}
        onClick={handleCardClick}
      >
        {/* Animated background gradient */}
        <div 
          className={`absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${
            color === "accent" 
              ? "bg-gradient-to-r from-accent to-highlight" 
              : "bg-gradient-to-r from-highlight to-accent"
          }`}
        />
        
        <motion.div 
          variants={contentVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col h-full"
        >
          {/* Icon section */}
          <motion.div 
            variants={itemVariants}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative ${
              color === "accent" ? "bg-accent/10" : "bg-highlight/10"
            }`}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            {icon}
          </motion.div>
          
          {/* Title */}
          <motion.h3 
            variants={itemVariants}
            className="text-xl font-space font-bold mb-4"
          >
            {title}
          </motion.h3>
          
          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-white/70 font-inter mb-6 flex-grow"
          >
            {description}
          </motion.p>
          
          {/* Tags */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap gap-2 mb-6"
          >
            {tags.map((tag, index) => (
              <motion.span 
                key={index}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }} 
                className={`text-xs px-3 py-1 rounded-full bg-secondary text-white/80 transition-colors duration-300 ${
                  color === "accent" ? "hover:bg-accent/20" : "hover:bg-highlight/20"
                }`}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
          
          {/* Learn more link */}
          <motion.div 
            variants={itemVariants}
            className="mt-auto"
          >
            <div 
              className={`flex items-center font-inter font-medium text-sm ${
                color === "accent" ? "text-accent" : "text-highlight"
              } cursor-pointer hover:translate-x-1 transition-transform duration-200`}
            >
              <span>Learn more</span>
              <div className="inline-block ml-1">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ServiceCard;