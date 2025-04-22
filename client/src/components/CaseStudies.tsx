import React, { forwardRef, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ArrowRight as ArrowForward } from "lucide-react";
import CaseStudyCard from "./ui/case-study-card";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { fadeIn, staggerContainer } from "@/lib/animations";

const CaseStudies = forwardRef<HTMLElement>((props, ref) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useIntersectionObserver(titleRef, { once: false, threshold: 0.1 });
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  
  const caseStudies = [
    {
      image: "e-commerce",
      title: "GlobalShop Revenue Boost",
      description: "Implemented personalized recommendation engine that increased conversion rates by 32% and average order value by 18%.",
      categories: ["E-commerce", "AI Marketing"],
      results: "+41% Revenue",
      delay: 0
    },
    {
      image: "finance",
      title: "FinTech Process Optimization",
      description: "Automated document processing and compliance verification, reducing processing time from days to minutes.",
      categories: ["Finance", "Automation"],
      results: "93% Time Savings",
      delay: 0.2
    },
    {
      image: "healthcare",
      title: "MedTech Patient Analytics",
      description: "Developed predictive analytics platform that improved patient scheduling efficiency and reduced no-show rates.",
      categories: ["Healthcare", "SaaS Solution"],
      results: "$2.4M Annual Savings",
      delay: 0.4
    },
    {
      image: "manufacturing",
      title: "IndusTech Predictive Maintenance",
      description: "Implemented machine learning system to predict equipment failures before they occur, minimizing downtime.",
      categories: ["Manufacturing", "Predictive AI"],
      results: "64% Less Downtime",
      delay: 0.6
    }
  ];

  const handlePrev = () => {
    if (sliderRef.current) {
      const slideWidth = 350 + 24; // Card width + gap
      sliderRef.current.scrollBy({ left: -slideWidth, behavior: 'smooth' });
      setActiveSlide(prev => Math.max(prev - 1, 0));
    }
  };

  const handleNext = () => {
    if (sliderRef.current) {
      const slideWidth = 350 + 24; // Card width + gap
      sliderRef.current.scrollBy({ left: slideWidth, behavior: 'smooth' });
      setActiveSlide(prev => Math.min(prev + 1, caseStudies.length - 1));
    }
  };

  return (
    <section ref={ref} id="case-studies" className="py-24 relative overflow-hidden bg-secondary/30">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div ref={titleRef} className="text-center mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <span className="font-inter text-sm uppercase tracking-widest text-accent mb-3 inline-block">
              Success Stories
            </span>
            <h2 className="text-3xl md:text-5xl font-space font-bold mb-6">
              Real Results for Real Businesses
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto font-inter text-lg">
              See how our AI solutions have transformed operations and driven growth
              for companies across diverse industries.
            </p>
          </motion.div>
        </div>

        {/* Case studies slider */}
        <div className="relative">
          <motion.div 
            ref={sliderRef}
            className="overflow-x-auto scrollbar-hide pb-8 no-scrollbar"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex gap-6 min-w-max">
              {caseStudies.map((study, index) => (
                <CaseStudyCard 
                  key={index}
                  image={study.image}
                  title={study.title}
                  description={study.description}
                  categories={study.categories}
                  results={study.results}
                  delay={study.delay}
                />
              ))}
            </div>
          </motion.div>
          
          {/* Slider controls */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button 
              variant="secondary" 
              size="icon" 
              className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white/70 hover:text-accent hover:bg-secondary/70"
              onClick={handlePrev}
            >
              <ArrowLeft />
            </Button>
            <div className="flex gap-2">
              {caseStudies.map((_, index) => (
                <button 
                  key={index}
                  className={`w-3 h-3 rounded-full ${index === activeSlide ? 'bg-accent' : 'bg-white/20 hover:bg-white/40'} transition-all`}
                  onClick={() => {
                    if (sliderRef.current) {
                      const slideWidth = 350 + 24; // Card width + gap
                      sliderRef.current.scrollTo({ 
                        left: slideWidth * index, 
                        behavior: 'smooth' 
                      });
                      setActiveSlide(index);
                    }
                  }}
                ></button>
              ))}
            </div>
            <Button 
              variant="secondary" 
              size="icon" 
              className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white/70 hover:text-accent hover:bg-secondary/70"
              onClick={handleNext}
            >
              <ArrowRight />
            </Button>
          </div>
        </div>
        
        {/* CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p className="mb-6 text-white/70 font-inter">
            Ready to see what AI can do for your business?
          </p>
          <Button 
            className="bg-accent hover:bg-accent/90 text-black font-inter font-semibold text-lg px-8 py-6 shadow-glow transition-all"
            style={{ 
              textShadow: "0 0 5px rgba(0,240,255,0.3)",
              boxShadow: "0 0 20px rgba(0,240,255,0.5)"
            }}
          >
            Schedule a Strategy Session
          </Button>
        </motion.div>
      </div>
    </section>
  );
});

CaseStudies.displayName = "CaseStudies";

export default CaseStudies;
