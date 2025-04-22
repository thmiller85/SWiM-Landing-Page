import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: "accent" | "highlight" | "white";
}

const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Set initial dimensions
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }
    
    // Generate particles
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const particleCount = 60; // Increased count for more visual impact
      
      const colorOptions: Array<"accent" | "highlight" | "white"> = ["accent", "highlight", "white"];
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 15 + 10, // Slightly adjusted speed range
          opacity: Math.random() * 0.5 + 0.2,
          color: colorOptions[Math.floor(Math.random() * 3)]
        });
      }
      
      setParticles(newParticles);
    };
    
    generateParticles();
    
    // Update dimensions on resize
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Function to determine particle color class
  const getParticleColorClass = (color: "accent" | "highlight" | "white") => {
    switch (color) {
      case "accent":
        return "bg-accent/40";
      case "highlight":
        return "bg-highlight/30";
      case "white":
        return "bg-white/20";
      default:
        return "bg-accent/40";
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="particles absolute top-0 left-0 w-full h-full overflow-hidden z-0"
    >
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className={`particle absolute ${getParticleColorClass(particle.color)} rounded-full backdrop-blur-sm`}
          initial={{ 
            x: `${particle.x}%`, 
            y: `${particle.y}%`, 
            width: `${particle.size}px`, 
            height: `${particle.size}px`,
            opacity: particle.opacity
          }}
          animate={{ 
            y: [`${particle.y}%`, `${particle.y - 15}%`, `${particle.y}%`],
            x: [`${particle.x}%`, `${particle.x + (Math.random() > 0.5 ? 5 : -5)}%`, `${particle.x}%`],
            opacity: [particle.opacity, particle.opacity + 0.2, particle.opacity]
          }}
          transition={{
            duration: particle.speed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
            y: { duration: particle.speed },
            x: { duration: particle.speed * 1.3 }
          }}
          whileHover={{
            scale: 2,
            opacity: 0.8,
            transition: { duration: 0.3 }
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
