import React, { forwardRef, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ArrowRight as ArrowForward } from "lucide-react";
import CaseStudyCard from "./ui/case-study-card";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { fadeIn, staggerContainer } from "@/lib/animations";

interface CaseStudiesProps {
  onContactClick: () => void;
}

const CaseStudies = forwardRef<HTMLElement, CaseStudiesProps>(({ onContactClick }, ref) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useIntersectionObserver(titleRef, { once: false, threshold: 0.1 });
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  
  const caseStudies = [
    {
      image: "e-commerce",
      title: "Self-Storage Pricing Engine",
      description: "An AI overlay for Storable Easy that optimizes street rates, automates rent increases, and deploys AuroraBot to handle tenant inquiries — giving independent operators the same intelligence tools REITs use.",
      categories: ["Self-Storage", "Pricing AI", "Automation"],
      results: "≥4% Revenue Lift Target",
      delay: 0,
      isRealProject: true,
      link: "/storage"
    },
    {
      image: "finance",
      title: "Retail Sell-Through Intelligence",
      description: "Real-time sell-through visibility system for an apparel brand with 25 independent boutiques. Automated data collection across multiple POS systems, intelligent normalization of inconsistent product data, and network-wide analytics — eliminating 5 days of manual reporting per cycle.",
      categories: ["Retail", "Data Intelligence", "Multi-POS"],
      results: "25-Door Real-Time Visibility",
      delay: 0.2,
      isRealProject: true,
      link: "/retail"
    },
    {
      image: "marketing",
      title: "Business Coach Lead System",
      description: "Multi-channel lead generation system for business coaches and consultants. AI targets your ideal client profile across LinkedIn, Google, and Meta — pre-qualifying prospects before they ever book a call.",
      categories: ["Coaching", "Lead Generation", "Multi-Channel AI"],
      results: "15+ Qualified Leads Monthly",
      delay: 0.4,
      link: "/business-coaching"
    }
  ];

  const getCardWidth = () => {
    // Get card width based on screen size
    if (typeof window === 'undefined') return 424; // Default fallback
    
    const width = window.innerWidth;
    if (width < 640) {
      // Small screens - use a width that adapts to the screen size
      const cardWidth = Math.min(Math.max(width * 0.9, 300), 400); // At least 90% of screen width but min 300px, max 400px
      return cardWidth + 24; // Add gap
    }
    if (width < 768) return 380 + 24; // Medium screens (380px card + 24px gap)
    return 400 + 24; // Large screens (400px card + 24px gap)
  };
  
  // Calculate the left padding to center the first card on small screens
  const getInitialOffset = () => {
    if (typeof window === 'undefined') return 0;
    
    // Only add extra padding on mobile screens
    const width = window.innerWidth;
    if (width < 640) {
      // Calculate the responsive card width to match our CSS
      const cardWidth = Math.min(width - 40, 400); 
      
      // Calculate centered offset (screen width - card width) / 2
      const centerOffset = Math.max(0, (width - cardWidth) / 2);
      
      // Account for existing container padding
      const containerPadding = 0; // We're using px-0 on the container for small screens now
      return Math.max(0, centerOffset - containerPadding);
    }
    return 0;
  };

  const handlePrev = () => {
    if (sliderRef.current) {
      const slideWidth = getCardWidth();
      const newIndex = Math.max(activeSlide - 1, 0);
      
      // Calculate position for smooth scrolling
      const scrollPos = (newIndex === 0) 
        ? getInitialOffset() 
        : slideWidth * newIndex;
      
      sliderRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
      setActiveSlide(newIndex);
    }
  };

  const handleNext = () => {
    if (sliderRef.current) {
      const slideWidth = getCardWidth();
      const newIndex = Math.min(activeSlide + 1, caseStudies.length - 1);
      
      // Calculate position for smooth scrolling
      const scrollPos = slideWidth * newIndex;
      
      sliderRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
      setActiveSlide(newIndex);
    }
  };

  return (
    <section ref={ref} id="case-studies" className="py-24 relative overflow-hidden bg-secondary/30">
      <div className="container mx-auto px-0 sm:px-6 md:px-12 relative z-10">
        <div ref={titleRef} className="text-center mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <span className="font-inter text-sm uppercase tracking-widest text-accent mb-3 inline-block">
              What We Build
            </span>
            <h2 className="text-3xl md:text-5xl font-space font-bold mb-6">
              Real Problems We Solve
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto font-inter text-lg">
              Each solution starts with a proof of concept you can see working before you commit.
              Here's what that looks like across our three verticals.
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
            <div 
              className="flex gap-6 min-w-max px-4 sm:px-0 justify-center md:justify-start"
              style={{ paddingLeft: `${getInitialOffset()}px`, paddingRight: '16px' }}>
              {caseStudies.map((study, index) => (
                <CaseStudyCard
                  key={index}
                  image={study.image}
                  title={study.title}
                  description={study.description}
                  categories={study.categories}
                  results={study.results}
                  delay={study.delay}
                  isRealProject={study.isRealProject}
                  link={study.link}
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
                      const slideWidth = getCardWidth(); // Use our responsive width function
                      sliderRef.current.scrollTo({ 
                        left: (slideWidth * index) + (index === 0 ? getInitialOffset() : 0), 
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
        
        {/* Disclaimer */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p className="text-white/50 font-inter text-sm max-w-3xl mx-auto">
            <em>Each scenario reflects the type of proof of concept we build for clients.
            We show you it works before you sign.</em>
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p className="mb-6 text-white/70 font-inter">
            Ready to see what we'd build for you?
          </p>
          <Button 
            className="bg-accent hover:bg-accent/90 text-black font-inter font-semibold text-lg px-8 py-6 shadow-glow transition-all"
            style={{ 
              textShadow: "0 0 5px rgba(0,240,255,0.3)",
              boxShadow: "0 0 20px rgba(0,240,255,0.5)"
            }}
            onClick={onContactClick}
          >
            Book a Free Demo
          </Button>
        </motion.div>
      </div>
    </section>
  );
});

CaseStudies.displayName = "CaseStudies";

export default CaseStudies;
