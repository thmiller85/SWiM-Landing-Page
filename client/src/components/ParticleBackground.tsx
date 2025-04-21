import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const particles: Particle[] = [];
    const particleCount = 40;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 20 + 10,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
    
    particlesRef.current = particles;
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="particles absolute top-0 left-0 w-full h-full overflow-hidden z-0"
    >
      {particlesRef.current.map(particle => (
        <motion.div
          key={particle.id}
          className="particle absolute bg-accent/50 rounded-full"
          initial={{ 
            x: `${particle.x}%`, 
            y: `${particle.y}%`, 
            width: `${particle.size}px`, 
            height: `${particle.size}px`,
            opacity: particle.opacity
          }}
          animate={{ 
            y: [`${particle.y}%`, `${particle.y - 10}%`, `${particle.y}%`]
          }}
          transition={{
            duration: particle.speed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
