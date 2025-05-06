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
                  className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3"
                  variants={pulseAnimation}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div 
                    className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="w-6 h-6 bg-accent rounded-full animate-pulse"></div>
                  </motion.div>
                </motion.div>
                <motion.p 
                  className="text-white/90 font-space font-medium mt-2"
                  variants={scaleIn}
                  custom={delay + 0.1}
                >
                  E-commerce Analytics
                </motion.p>
              </div>
            )}
            
            {image === 'finance' && (
              <div className="flex flex-col items-center">
                <motion.div 
                  className="flex space-x-2 mb-3"
                  animate={{ 
                    y: [0, -5, 0],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    repeatType: "mirror",
                    times: [0, 0.5, 1]
                  }}
                >
                  {[1, 2, 3, 4].map((_, i) => (
                    <motion.div 
                      key={i}
                      className="w-3 h-14 bg-emerald-400/80 rounded-t-sm"
                      initial={{ height: 6 }}
                      animate={{ 
                        height: [6, 14, 6 + i * 3, 10 + i * 2],
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </motion.div>
                <motion.p 
                  className="text-white/90 font-space font-medium mt-2"
                  variants={scaleIn}
                  custom={delay + 0.1}
                >
                  Financial Growth
                </motion.p>
              </div>
            )}
            
            {image === 'healthcare' && (
              <div className="flex flex-col items-center">
                <motion.div 
                  className="relative h-12 w-24 mb-3"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <motion.div 
                    className="absolute bg-purple-400/80 h-8 w-full rounded-md"
                    animate={{ 
                      y: [0, 2, 0],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatType: "mirror"
                    }}
                  />
                  <motion.div 
                    className="absolute top-4 left-0 right-0"
                    animate={{
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity
                    }}
                  >
                    <svg height="20" width="100%" className="text-purple-200">
                      <path 
                        d="M0,10 Q5,5 10,10 T20,10 T30,10 T40,10 T50,10 T60,10 T70,10 T80,10 T90,10 T100,10" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      />
                    </svg>
                  </motion.div>
                </motion.div>
                <motion.p 
                  className="text-white/90 font-space font-medium mt-2"
                  variants={scaleIn}
                  custom={delay + 0.1}
                >
                  Patient Monitoring
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
                  Predictive Analytics
                </motion.p>
              </div>
            )}
          </motion.div>
          
          {/* View case study button - only visible on hover with animation */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isHovered ? 0.85 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.button 
              className="px-5 py-3 rounded-full bg-accent/90 text-white font-medium flex items-center gap-2 hover:bg-accent transition-all shadow-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ 
                y: isHovered ? 0 : 20, 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.9
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 10,
                delay: isHovered ? 0.1 : 0 
              }}
            >
              <span>View Case Study</span>
              <ExternalLink size={16} />
            </motion.button>
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
            <motion.a 
              href="#" 
              className="flex items-center text-white/80 hover:text-accent transition-colors font-inter text-base sm:text-base font-medium group/link"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span>Read case study</span>
              <motion.span
                className="inline-block ml-1"
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="h-5 w-5 sm:h-5 sm:w-5 group-hover/link:text-accent" />
              </motion.span>
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CaseStudyCard;