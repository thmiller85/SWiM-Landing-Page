import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { fadeIn, scaleIn, floatingAnimation, pulseAnimation } from "@/lib/animations";

interface CaseStudyCardProps {
  image: string;
  title: string;
  description: string;
  categories: string[];
  results: string;
  delay: number;
}

const CaseStudyCard = ({ 
  image, 
  title, 
  description, 
  categories, 
  results,
  delay
}: CaseStudyCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Use background colors based on the image type
  const getBgColor = () => {
    switch (image) {
      case 'e-commerce':
        return 'bg-blue-900/30';
      case 'finance':
        return 'bg-emerald-900/30';
      case 'healthcare':
        return 'bg-purple-900/30';
      case 'manufacturing':
        return 'bg-amber-900/30';
      default:
        return 'bg-gray-900/30';
    }
  };
  
  // Get accent color based on image type
  const getAccentColor = () => {
    switch (image) {
      case 'e-commerce':
        return 'accent';
      case 'finance':
        return 'emerald-400';
      case 'healthcare':
        return 'purple-400';
      case 'manufacturing':
        return 'amber-400';
      default:
        return 'accent';
    }
  };

  return (
    <motion.div 
      className="w-[350px] glass rounded-2xl overflow-hidden relative group"
      variants={fadeIn}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        y: -10,
        transition: { duration: 0.4, ease: "easeOut" }
      }}
    >
      {/* Animated background glow on hover */}
      <motion.div 
        className="absolute -inset-0.5 bg-gradient-to-tr from-accent to-highlight rounded-2xl blur opacity-0 group-hover:opacity-20 transition-all duration-700 z-0"
        animate={{
          backgroundPosition: isHovered ? ['0% 0%', '100% 100%'] : '0% 0%',
        }}
        transition={{ duration: 3, ease: "linear" }}
      />
      
      <div className={`w-full h-[200px] ${getBgColor()} flex items-center justify-center relative overflow-hidden z-10`}>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"
          animate={{ 
            opacity: isHovered ? 0.7 : 0.4
          }}
          transition={{ duration: 0.3 }}
        />
        
        <motion.div 
          className="text-center p-4 z-10"
          variants={floatingAnimation}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className={`w-16 h-16 rounded-full bg-${getAccentColor()}/20 flex items-center justify-center mx-auto mb-3`}
            variants={pulseAnimation}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className={`w-10 h-10 rounded-full bg-${getAccentColor()}/30 flex items-center justify-center`}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className={`w-6 h-6 bg-${getAccentColor()} rounded-full animate-pulse`}></div>
            </motion.div>
          </motion.div>
          <motion.p 
            className="text-white/90 font-space font-medium"
            variants={scaleIn}
            custom={delay + 0.1}
          >
            {image} visualization
          </motion.p>
        </motion.div>
        
        {/* View case study overlay that appears on hover */}
        <motion.div 
          className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.button 
            className="px-4 py-2 rounded-full bg-accent/30 text-white font-medium flex items-center space-x-2 hover:bg-accent/50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View Case Study</span>
            <ExternalLink size={14} />
          </motion.button>
        </motion.div>
      </div>
      
      <div className="p-6 relative z-10">
        <motion.div 
          className="flex items-center gap-2 mb-4 flex-wrap"
          variants={fadeIn}
          custom={delay + 0.2}
        >
          {categories.map((category, index) => (
            <motion.div 
              key={index} 
              className={`px-3 py-1 ${index % 2 === 0 ? 'bg-accent/20' : 'bg-highlight/20'} rounded-full`}
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className={`${index % 2 === 0 ? 'text-accent' : 'text-highlight'} text-xs font-medium`}>
                {category}
              </span>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.h3 
          className="text-xl font-space font-bold mb-2"
          variants={scaleIn}
          custom={delay + 0.3}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="text-white/70 font-inter text-sm mb-4"
          variants={fadeIn}
          custom={delay + 0.4}
        >
          {description}
        </motion.p>
        
        <motion.div 
          className="flex items-center justify-between"
          variants={fadeIn}
          custom={delay + 0.5}
        >
          <div>
            <p className="text-white/50 text-xs font-inter">Results</p>
            <motion.p 
              className="text-accent font-space font-bold"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {results}
            </motion.p>
          </div>
          <motion.a 
            href="#" 
            className="flex items-center text-white/70 hover:text-accent transition-colors font-inter text-sm group/link"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span>Read case study</span>
            <motion.span
              className="inline-block ml-1"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="h-4 w-4 group-hover/link:text-accent" />
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CaseStudyCard;
