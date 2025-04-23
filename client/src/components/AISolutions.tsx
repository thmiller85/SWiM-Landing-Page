import React, { forwardRef, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Brain, 
  LineChart 
} from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { fadeIn, slideIn } from "@/lib/animations";

const AISolutions = forwardRef<HTMLElement>((props, ref) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const isContentInView = useIntersectionObserver(contentRef, { once: false, threshold: 0.1 });
  
  return (
    <section ref={ref} id="ai-solutions" className="py-24 relative overflow-hidden bg-secondary/30">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-highlight/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            animate={isContentInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <span className="font-inter text-sm uppercase tracking-widest text-accent mb-3 inline-block">
              AI Solutions
            </span>
            <h2 className="text-3xl md:text-5xl font-space font-bold mb-6">
              Elevate Your Business with Advanced AI Technology
            </h2>
            <p className="text-white/70 font-inter text-lg mb-8">
              Our AI solutions are designed to transform your business operations, 
              automate complex tasks, and deliver insights that drive strategic decision-making.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-space font-medium mb-2">Natural Language Processing</h3>
                  <p className="text-white/70 font-inter">
                    Implement advanced NLP models to analyze customer feedback, generate content, and streamline communication.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-highlight/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Brain className="text-highlight" />
                </div>
                <div>
                  <h3 className="text-xl font-space font-medium mb-2">Machine Learning Models</h3>
                  <p className="text-white/70 font-inter">
                    Build custom ML models that continuously learn from your data to improve performance and accuracy over time.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <LineChart className="text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-space font-medium mb-2">Predictive Analytics</h3>
                  <p className="text-white/70 font-inter">
                    Anticipate market trends and customer behavior with predictive models that inform your strategic decision-making.
                  </p>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline"
              className="mt-10 bg-transparent border border-accent text-accent hover:bg-accent hover:text-primary transition-all duration-300"
            >
              Explore All AI Solutions
            </Button>
          </motion.div>
          
          <motion.div
            className="relative"
            initial="hidden"
            animate={isContentInView ? "visible" : "hidden"}
            variants={slideIn("right")}
          >
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-highlight rounded-2xl blur opacity-20"></div>
              <div className="glass p-1 rounded-2xl relative">
                <div className="aspect-video w-full bg-primary/50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-block p-4 rounded-xl bg-accent/10 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center">
                        <Brain className="w-8 h-8 text-accent" />
                      </div>
                    </div>
                    <p className="text-white/80 font-space">AI visualization interface</p>
                  </div>
                </div>
                
                {/* Interactive overlay elements */}
                <div className="absolute top-1/4 left-1/4 h-16 w-16">
                  <div className="absolute h-16 w-16 rounded-full border-2 border-accent/50 animate-pulse"></div>
                  <div className="absolute h-4 w-4 rounded-full bg-accent top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                
                <div className="absolute bottom-1/3 right-1/4 h-12 w-12">
                  <div className="absolute h-12 w-12 rounded-full border-2 border-highlight/50 animate-pulse"></div>
                  <div className="absolute h-3 w-3 rounded-full bg-highlight top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                
                {/* Interactive data tooltip */}
                <div className="absolute -bottom-8 -right-8 glass p-4 rounded-xl min-w-[200px] animate-float-alt" style={{ animationDelay: "0.7s" }}>
                  <div className="flex flex-col mb-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <p className="text-white/90 font-space text-sm font-medium">Predictive Accuracy</p>
                    </div>
                    <p className="text-accent font-space font-bold text-lg">96.8%</p>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-[96.8%] bg-gradient-to-r from-accent to-highlight"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-8 -right-8 glass p-4 rounded-xl animate-float" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-highlight/20 flex items-center justify-center">
                  <LineChart className="text-highlight text-sm" />
                </div>
                <div>
                  <p className="text-white/90 font-space text-sm font-medium">Performance</p>
                  <p className="text-white/70 font-inter text-xs">+28% increase</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 glass p-4 rounded-xl animate-float-gentle" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <div className="text-accent text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-white/90 font-space text-sm font-medium">Time Saved</p>
                  <p className="text-white/70 font-inter text-xs">68 hours/month</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

AISolutions.displayName = "AISolutions";

export default AISolutions;
