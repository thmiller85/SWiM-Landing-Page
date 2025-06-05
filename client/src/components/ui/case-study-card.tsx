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
        return 'bg-gradient-to-br from-cyan-900/40 to-blue-800/30';
      case 'finance':
        return 'bg-emerald-900/30';
      case 'marketing':
        return 'bg-gradient-to-br from-rose-900/40 to-pink-800/30';
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
      case 'marketing':
        return 'rose-400';
      case 'manufacturing':
        return 'amber-400';
      default:
        return 'accent';
    }
  };

  return (
    <div className="pt-2 pb-2 overflow-visible">
      <motion.div 
        className="w-[calc(100vw-40px)] max-w-[400px] sm:w-[380px] md:w-[400px] h-[590px] glass rounded-2xl overflow-hidden relative group"
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
            className="text-center p-4 z-10 w-full h-full flex flex-col items-center justify-center"
            variants={floatingAnimation}
            initial="hidden"
            animate={isHovered ? { opacity: 0, y: -10, transition: { duration: 0.2 } } : "visible"}
          >
            {/* Visualization content based on case study type */}
            {image === 'e-commerce' && (
              <div className="flex flex-col items-center">
                <motion.div 
                  className="w-16 h-16 bg-accent/20 flex items-center justify-center mx-auto mb-3 rounded-md"
                  variants={pulseAnimation}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div 
                    className="w-12 h-12 bg-accent/30 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {/* Storage units icon */}
                    <motion.svg 
                      className="w-8 h-8 text-accent" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      animate={{ 
                        y: [0, -2, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3,
                        ease: "easeInOut"
                      }}
                    >
                      <path d="M4 4H20V20H4V4ZM4 8H20M4 12H20M4 16H20M8 8V20M12 8V20M16 8V20" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                  </motion.div>
                </motion.div>
                <motion.p 
                  className="text-white/90 font-space font-medium mt-2"
                  variants={scaleIn}
                  custom={delay + 0.1}
                >
                  Self-Storage Revenue
                </motion.p>
              </div>
            )}
            
            {image === 'finance' && (
              <div className="flex flex-col items-center">
                <motion.div 
                  className="w-16 h-16 bg-emerald-400/20 flex items-center justify-center mx-auto mb-3 rounded-md"
                  variants={pulseAnimation}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div 
                    className="w-12 h-12 bg-emerald-400/30 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {/* Document/Content icon */}
                    <motion.svg 
                      className="w-8 h-8 text-emerald-400" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      animate={{ 
                        y: [0, -2, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3,
                        ease: "easeInOut"
                      }}
                    >
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8M14 2L20 8M14 2V8H20M16 13H8M16 17H8M10 9H8" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                  </motion.div>
                </motion.div>
                <motion.p 
                  className="text-white/90 font-space font-medium mt-2"
                  variants={scaleIn}
                  custom={delay + 0.1}
                >
                  Retail Content
                </motion.p>
              </div>
            )}
            
            {image === 'marketing' && (
              <div className="flex flex-col items-center">
                <motion.div 
                  className="w-16 h-16 bg-rose-400/20 flex items-center justify-center mx-auto mb-3 rounded-md"
                  variants={pulseAnimation}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div 
                    className="w-12 h-12 bg-rose-400/30 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {/* Email/Marketing icon */}
                    <motion.svg 
                      className="w-8 h-8 text-rose-400" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      animate={{ 
                        y: [0, -2, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3,
                        ease: "easeInOut"
                      }}
                    >
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="L22 6L12 13L2 6" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                  </motion.div>
                </motion.div>
                <motion.p 
                  className="text-white/90 font-space font-medium mt-2"
                  variants={scaleIn}
                  custom={delay + 0.1}
                >
                  Lead Generation
                </motion.p>
              </div>
            )}
            
            {image === 'manufacturing' && (
              <div className="flex flex-col items-center">
                <motion.div 
                  className="flex items-end space-x-1 h-16 mb-3"
                  animate={{ rotate: [0, 1, 0, -1, 0] }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <motion.div 
                    className="w-4 h-10 bg-amber-400/80 rounded-t-sm"
                    animate={{ 
                      height: [10, 14, 10],
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatType: "mirror"
                    }}
                  />
                  <motion.div 
                    className="w-4 h-12 bg-amber-400/60 rounded-t-sm"
                    animate={{ 
                      height: [12, 8, 12],
                    }}
                    transition={{ 
                      duration: 2.5, 
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: 0.3
                    }}
                  />
                  <motion.div 
                    className="w-4 h-8 bg-amber-400/90 rounded-t-sm"
                    animate={{ 
                      height: [8, 16, 8],
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: 0.6
                    }}
                  />
                  <motion.div 
                    className="w-4 h-14 bg-amber-400/70 rounded-t-sm"
                    animate={{ 
                      height: [14, 10, 14],
                    }}
                    transition={{ 
                      duration: 2.3, 
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: 0.9
                    }}
                  />
                </motion.div>
                <motion.p 
                  className="text-white/90 font-space font-medium mt-2"
                  variants={scaleIn}
                  custom={delay + 0.1}
                >
                  Predictive Maintenance
                </motion.p>
              </div>
            )}
          </motion.div>
          
          {/* Illustrative scenario label - visible on hover */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isHovered ? 0.85 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="px-5 py-3 rounded-full bg-accent/20 border border-accent/50 text-white font-medium text-center shadow-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ 
                y: isHovered ? 0 : 20, 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.9
              }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 10,
                delay: isHovered ? 0.1 : 0 
              }}
            >
              <span className="text-sm">Illustrative Scenario</span>
            </motion.div>
          </motion.div>
        </div>
        
        <div className="p-5 sm:p-6 relative z-10 flex flex-col h-[390px]">
          <motion.div 
            className="flex items-center gap-2 mb-4 flex-wrap"
            variants={fadeIn}
            custom={delay + 0.2}
          >
            {categories.map((category, index) => (
              <motion.div 
                key={index} 
                className={`px-2 md:px-3 py-1 md:py-1.5 ${index % 2 === 0 ? 'bg-accent/20' : 'bg-highlight/20'} rounded-full`}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className={`${index % 2 === 0 ? 'text-accent' : 'text-highlight'} text-xs md:text-sm font-semibold`}>
                  {category}
                </span>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.h3 
            className="text-xl md:text-2xl font-space font-bold mb-3 line-clamp-2"
            variants={scaleIn}
            custom={delay + 0.3}
          >
            {title}
          </motion.h3>
          
          <motion.p 
            className="text-white/70 font-inter text-sm md:text-base mb-5 overflow-y-auto max-h-[140px] pr-2"
            variants={fadeIn}
            custom={delay + 0.4}
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(26, 140, 183, 0.3) transparent'
            }}
          >
            {description}
          </motion.p>
          
          <motion.div 
            className="flex items-center justify-between mt-auto"
            variants={fadeIn}
            custom={delay + 0.5}
          >
            <div>
              <p className="text-white/50 text-base font-inter font-medium">Results</p>
              <motion.p 
                className="text-accent font-space font-bold text-xl sm:text-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {results}
              </motion.p>
            </div>
            <motion.div 
              className="flex items-center text-white/60 font-inter text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span className="italic">Based on industry research</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CaseStudyCard;