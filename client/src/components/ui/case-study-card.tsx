import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeIn } from "@/lib/animations";

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

  return (
    <motion.div 
      className="w-[350px] glass rounded-2xl overflow-hidden card-hover"
      variants={fadeIn}
      custom={delay}
    >
      <div className={`w-full h-[200px] ${getBgColor()} flex items-center justify-center`}>
        <div className="text-center p-4">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
            <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center">
              <div className="w-6 h-6 bg-accent rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-white/90 font-space font-medium">{image} visualization</p>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          {categories.map((category, index) => (
            <div key={index} className={`px-3 py-1 ${index % 2 === 0 ? 'bg-accent/20' : 'bg-highlight/20'} rounded-full`}>
              <span className={`${index % 2 === 0 ? 'text-accent' : 'text-highlight'} text-xs font-medium`}>
                {category}
              </span>
            </div>
          ))}
        </div>
        <h3 className="text-xl font-space font-bold mb-2">{title}</h3>
        <p className="text-white/70 font-inter text-sm mb-4">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/50 text-xs font-inter">Results</p>
            <p className="text-accent font-space font-bold">{results}</p>
          </div>
          <a href="#" className="flex items-center text-white/70 hover:text-accent transition-colors font-inter text-sm">
            Read case study
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default CaseStudyCard;
