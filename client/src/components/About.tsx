import React, { forwardRef, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Play } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { fadeIn, slideIn } from "@/lib/animations";

const About = forwardRef<HTMLElement>((props, ref) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const isContentInView = useIntersectionObserver(contentRef, { once: false, threshold: 0.1 });
  
  return (
    <section ref={ref} id="about" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            animate={isContentInView ? "visible" : "hidden"}
            variants={slideIn("left")}
          >
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-highlight rounded-2xl blur opacity-20"></div>
              <div className="glass rounded-2xl p-1 relative">
                <div className="aspect-video w-full bg-primary/50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-block p-4 rounded-xl bg-accent/10 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <div className="w-6 h-6 bg-accent rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-white/80 font-space">SWiM team</p>
                  </div>
                </div>
                
                {/* Team stats overlay */}
                <div className="absolute bottom-6 right-6 glass p-4 rounded-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-accent font-space font-bold text-xl">Founder-Led</p>
                      <p className="text-white/70 font-inter text-xs">Delivery</p>
                    </div>
                    <div className="text-center">
                      <p className="text-highlight font-space font-bold text-xl">Lean</p>
                      <p className="text-white/70 font-inter text-xs">By Design</p>
                    </div>
                    <div className="text-center">
                      <p className="text-accent font-space font-bold text-xl">U.S.-Based</p>
                      <p className="text-white/70 font-inter text-xs">Team</p>
                    </div>
                    <div className="text-center">
                      <p className="text-highlight font-space font-bold text-xl">Cross-Industry</p>
                      <p className="text-white/70 font-inter text-xs">Experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Video preview */}
            <motion.div 
              className="mt-8 glass rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                    <Play className="text-accent" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-accent/50 animate-pulse"></div>
                </div>
                <div>
                  <h4 className="text-lg font-space font-medium mb-1">Watch our approach</h4>
                  <p className="text-white/70 font-inter text-sm">See how we implement AI solutions for our clients</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate={isContentInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <span className="font-inter text-sm uppercase tracking-widest text-accent mb-3 inline-block">
              About SWiM
            </span>
            <h2 className="text-3xl md:text-5xl font-space font-bold mb-6">
              AI Innovation with a Human Touch
            </h2>
            <p className="text-white/70 font-inter text-lg mb-6">
              At SWiM, we're a team of AI specialists, sales and marketing experts, technical engineers, and strategists
              united by a passion for transforming businesses through technology.
            </p>
            <p className="text-white/70 font-inter text-lg mb-8">
              We believe that the most powerful AI solutions are those that enhance human capabilities
              rather than replace them. That's why we work closely with your team to develop
              AI systems that augment your existing processes and empower your people.
            </p>
            
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                  <Check className="text-accent text-sm" />
                </div>
                <p className="text-white font-inter">AI integration experts</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                  <Check className="text-accent text-sm" />
                </div>
                <p className="text-white font-inter">Transparent, results-driven approach</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                  <Check className="text-accent text-sm" />
                </div>
                <p className="text-white font-inter">Ongoing support and optimization</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                  <Check className="text-accent text-sm" />
                </div>
                <p className="text-white font-inter">Ethical AI development practices</p>
              </div>
            </div>
            
            <Link href="/team">
              <Button 
                variant="outline"
                className="bg-transparent border border-accent text-accent hover:bg-accent hover:text-primary transition-all duration-300"
              >
                Meet Our Team
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

About.displayName = "About";

export default About;
