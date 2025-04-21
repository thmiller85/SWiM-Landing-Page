import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeIn } from "@/lib/animations";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  color: "accent" | "highlight";
  delay: number;
}

const ServiceCard = ({ icon, title, description, tags, color, delay }: ServiceCardProps) => {
  return (
    <motion.div 
      className="glass rounded-2xl p-8 card-hover"
      variants={fadeIn}
      custom={delay}
    >
      <div className={`w-16 h-16 rounded-2xl bg-${color}/10 flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-space font-bold mb-4">{title}</h3>
      <p className="text-white/70 font-inter mb-6">
        {description}
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag, index) => (
          <span key={index} className="text-xs px-3 py-1 rounded-full bg-secondary text-white/80">
            {tag}
          </span>
        ))}
      </div>
      <a href="#" className={`flex items-center text-${color} font-inter font-medium text-sm`}>
        Learn more
        <ArrowRight className="ml-1 h-4 w-4" />
      </a>
    </motion.div>
  );
};

export default ServiceCard;
