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
      title: "Self-Storage Revenue Optimization",
      description: "Our approach: Develop competitor research and unit price recommendation engines to identify gaps in pricing structure, delivering real-time recommendations that could potentially increase revenue by 15-25% while maintaining high occupancy rates.",
      categories: ["Real Estate", "SaaS", "Data Analytics"],
      results: "Potential: 15-25% Revenue Increase",
      delay: 0
    },
    {
      image: "finance",
      title: "Retail Content Automation",
      description: "Our solution: Automate SEO-optimized content generation for website blogs and social media postings to drive internet traffic and increase organic sales, potentially reducing content creation time by 80-95%.",
      categories: ["Retail", "E-commerce", "Automation"],
      results: "Potential: 80-95% Time Savings",
      delay: 0.2
    },
    {
      image: "marketing",
      title: "AI-Powered Lead Generation",
      description: "Our expertise: Develop intelligent cold email outreach systems that personalize messages at scale, identify high-quality prospects, and optimize send times to potentially increase response rates by 60-85%.",
      categories: ["Sales", "Marketing Automation", "AI"],
      results: "Potential: 60-85% Higher Response Rates",
      delay: 0.4
    },
    {
      image: "advertising",
      title: "Digital Ad Spend Optimization",
      description: "Our solution: Build AI-driven campaign optimization platforms that analyze performance data across channels, automatically adjust bidding strategies, and reallocate budgets to maximize ROI with potential to reduce ad waste by 40-60%.",
      categories: ["Digital Marketing", "AI Optimization", "PPC"],
      results: "Potential: 40-60% Less Ad Waste",
      delay: 0.6
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
              Proof of Concept Scenarios
            </span>
            <h2 className="text-3xl md:text-5xl font-space font-bold mb-6">
              Potential Impact Scenarios
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto font-inter text-lg">
              Based on our team's expertise and industry research, here are illustrative examples 
              of what our AI solutions can achieve across diverse sectors.
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
            <em>The scenarios above are illustrative examples based on our team's expertise and industry research. 
            Results may vary based on specific business contexts and implementation factors.</em>
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
            Ready to explore what AI can do for your business?
          </p>
          <Button 
            className="bg-accent hover:bg-accent/90 text-black font-inter font-semibold text-lg px-8 py-6 shadow-glow transition-all"
            style={{ 
              textShadow: "0 0 5px rgba(0,240,255,0.3)",
              boxShadow: "0 0 20px rgba(0,240,255,0.5)"
            }}
          >
            Discuss Your Potential
          </Button>
        </motion.div>
      </div>
    </section>
  );
});

CaseStudies.displayName = "CaseStudies";

export default CaseStudies;
