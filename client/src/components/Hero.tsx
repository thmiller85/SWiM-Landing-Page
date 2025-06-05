import { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import ParticleBackground from "./ParticleBackground";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import {
  fadeIn,
  slideUp,
  floatingAnimation,
  pulseAnimation,
} from "@/lib/animations";
import n8nAgentImage from "@assets/n8n_agent.png";

interface HeroProps {
  onDiscoverClick: () => void;
}

const Hero = ({ onDiscoverClick }: HeroProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, {
    once: false,
    threshold: 0.1,
  });

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-56 pb-12"
      id="hero"
    >
      <ParticleBackground />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center"
        >
          <motion.div
            className="lg:col-span-3"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-space font-bold leading-tight mb-6">
              <span className="block">Transform your business with</span>
              <span className="gradient-text">AI-Powered  Solutions</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-inter mb-8 max-w-2xl">
              SWiM helps B2B companies leverage artificial intelligence to
              automate workflows, optimize marketing strategies, and create
              cutting-edge SaaS solutions that drive results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={onDiscoverClick}
                className="bg-accent text-primary font-inter font-medium hover:bg-accent/90 transition-all"
                size="lg"
              >
                Discover Our Solutions
              </Button>
              {/* <Button
                variant="outline"
                className="bg-transparent border border-white/20 text-white font-inter font-medium hover:border-accent hover:text-white hover:bg-accent/10 transition-all"
                size="lg"
              >
                <Play size={18} className="mr-2" /> Watch Our Process
              </Button> */}
            </div>
            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full border-2 border-primary bg-white/20"></div>
                <div className="h-8 w-8 rounded-full border-2 border-primary bg-white/20"></div>
                <div className="h-8 w-8 rounded-full border-2 border-primary bg-white/20"></div>
              </div>
              <div className="text-white/80 font-inter text-sm">
                <span className="text-white font-medium">500+</span> satisfied
                clients
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div className="text-white/80 font-inter text-sm">
                <span className="text-accent font-medium">4.9/5</span> average
                rating
              </div>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-2 relative"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={slideUp}
          >
            <motion.div
              className="relative"
              variants={floatingAnimation}
              initial="hidden"
              animate="visible"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-highlight rounded-2xl blur opacity-30"></div>
              <div className="glass rounded-2xl relative overflow-hidden">
                <div className="w-full bg-[#222222] rounded-2xl flex items-center justify-center overflow-hidden p-0">
                  <video 
                    src="/assets/agent_automation.mp4" 
                    autoPlay 
                    loop 
                    muted
                    playsInline
                    className="w-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 glass">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                    <p className="text-sm font-inter text-white/90">
                      Unleash Scalable Intelligence
                    </p>
                  </div>
                </div>
              </div>
              <motion.div
                className="absolute -bottom-8 -right-8 w-24 h-24 bg-highlight/10 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 0.8, 0.6],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              ></motion.div>
              <motion.div
                className="absolute -top-8 -left-8 w-32 h-32 bg-accent/10 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 0.9, 0.6],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              ></motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Trusted by logos */}
        <motion.div
          className="mt-24"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p className="text-center text-white/60 font-inter text-sm uppercase tracking-widest mb-8">
            Trusted by industry leaders
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            <div className="text-white/40 hover:text-white/80 transition-all">
              <p className="font-space font-bold text-lg">ACME Corp</p>
            </div>
            <div className="text-white/40 hover:text-white/80 transition-all">
              <p className="font-space font-bold text-lg">TechGiant</p>
            </div>
            <div className="text-white/40 hover:text-white/80 transition-all">
              <p className="font-space font-bold text-lg">FutureSoft</p>
            </div>
            <div className="text-white/40 hover:text-white/80 transition-all">
              <p className="font-space font-bold text-lg">InnovateX</p>
            </div>
            <div className="text-white/40 hover:text-white/80 transition-all">
              <p className="font-space font-bold text-lg">DataFlow</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="relative mt-12 flex flex-col items-center">
        <p className="text-white/60 font-inter text-xs mb-2">
          Scroll to explore
        </p>
        <div className="h-12 w-6 border border-white/20 rounded-full flex justify-center">
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
