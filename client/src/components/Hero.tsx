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
import rossAvatar from "@/assets/ross-avatar.png";
import tomAvatar from "@/assets/tom-avatar.png";
import steveAvatar from "@/assets/steve-avatar.png";
import openaiLogo from "@/assets/openai-logo.png";
import anthropicLogo from "@/assets/anthropic-logo.png";
import pythonLogo from "@/assets/python-logo.png";
import dockerLogo from "@/assets/docker-logo.png";
import n8nLogo from "@/assets/n8n-logo.png";
import cursorLogo from "@/assets/cursor-logo.png";

interface HeroProps {
  onDiscoverClick: () => void;
  onContactClick: () => void;
}

const Hero = ({ onDiscoverClick, onContactClick }: HeroProps) => {
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
              <span className="block">Every independent operator deserves</span>
              <span className="gradient-text">enterprise-grade intelligence</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-inter mb-8 max-w-2xl">
              SWiM solves the data and workflow problems that off-the-shelf
              software can't — for independent retail, self-storage, and
              business coaching. AI isn't a feature we bolt on. It's the operating
              layer we build on.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={onDiscoverClick}
                className="bg-accent text-primary font-inter font-medium hover:bg-accent/90 transition-all"
                size="lg"
              >
                See How It Works
              </Button>
              <Button
                onClick={onContactClick}
                variant="outline"
                className="bg-transparent border border-white/20 text-white font-inter font-medium hover:border-accent hover:text-white hover:bg-accent/10 transition-all"
                size="lg"
              >
                Book a Free Demo
              </Button>
            </div>
            <div className="mt-12">
              {/* Mobile layout */}
              <div className="flex sm:hidden flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <img src={rossAvatar} alt="Ross" className="h-8 w-8 rounded-full border-2 border-primary object-cover" />
                    <img src={tomAvatar} alt="Tom" className="h-8 w-8 rounded-full border-2 border-primary object-cover" />
                    <img src={steveAvatar} alt="Steve" className="h-8 w-8 rounded-full border-2 border-primary object-cover" />
                  </div>
                  <div className="text-white/80 font-inter text-sm">
                    <span className="text-accent font-medium">3 Founders.</span> U.S.-Based. Lean by Design.
                  </div>
                </div>
                <div className="text-white/80 font-inter text-sm text-center">
                  <span className="text-accent font-medium">We show you it works</span> before you sign.
                </div>
              </div>
              
              {/* Desktop layout */}
              <div className="hidden sm:flex items-center gap-6">
                <div className="flex -space-x-2">
                  <img src={rossAvatar} alt="Ross" className="h-8 w-8 rounded-full border-2 border-primary object-cover" />
                  <img src={tomAvatar} alt="Tom" className="h-8 w-8 rounded-full border-2 border-primary object-cover" />
                  <img src={steveAvatar} alt="Steve" className="h-8 w-8 rounded-full border-2 border-primary object-cover" />
                </div>
                <div className="text-white/80 font-inter text-sm">
                  <span className="text-accent font-medium">3 Founders.</span> U.S.-Based. Lean by Design.
                </div>
                <div className="h-8 w-px bg-white/20"></div>
                <div className="text-white/80 font-inter text-sm">
                  <span className="text-accent font-medium">We show you it works</span> before you sign.
                </div>
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
                      AI as Your Operating Layer
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
            Built with
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="hover:scale-110 transition-transform duration-300">
              <img 
                src={openaiLogo} 
                alt="OpenAI - Advanced AI language models for natural language processing" 
                className="h-10 w-auto"
              />
            </div>
            <div className="hover:scale-110 transition-transform duration-300">
              <img 
                src={anthropicLogo} 
                alt="Anthropic - Claude AI for advanced conversational AI solutions" 
                className="h-6 w-auto"
              />
            </div>
            <div className="hover:scale-110 transition-transform duration-300">
              <img 
                src={pythonLogo} 
                alt="Python - High-level programming language for AI and data science" 
                className="h-10 w-auto"
              />
            </div>
            <div className="hover:scale-110 transition-transform duration-300">
              <img 
                src={dockerLogo} 
                alt="Docker - Containerization platform for scalable application deployment" 
                className="h-6 w-auto"
              />
            </div>
            <div className="hover:scale-110 transition-transform duration-300">
              <img 
                src={n8nLogo} 
                alt="n8n - Workflow automation platform for business process optimization" 
                className="h-20 w-auto"
              />
            </div>
            <div className="hover:scale-110 transition-transform duration-300">
              <img 
                src={cursorLogo} 
                alt="Cursor - AI-powered code editor for enhanced development productivity" 
                className="h-10 w-auto"
              />
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
