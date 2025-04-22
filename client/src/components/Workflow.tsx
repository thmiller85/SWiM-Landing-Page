import React, { forwardRef, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search, Lightbulb, Code, Rocket, CheckCircle } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { fadeIn, slideIn, pulseAnimation, floatingAnimation } from "@/lib/animations";

const Workflow = forwardRef<HTMLElement>((props, ref) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useIntersectionObserver(titleRef, { once: false, threshold: 0.1 });
  
  const stepsRef = useRef<HTMLDivElement>(null);
  const areStepsInView = useIntersectionObserver(stepsRef, { once: false, threshold: 0.1 });
  
  // Track which step is being hovered
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  
  const steps = [
    {
      number: "01",
      title: "Discovery & Analysis",
      description: "We begin by deeply understanding your business, identifying key challenges, and defining clear objectives for AI implementation.",
      checkpoints: ["Business needs assessment", "Data infrastructure audit", "ROI potential analysis"],
      icon: <Search className="text-primary" />,
      color: "accent",
      alignRight: true
    },
    {
      number: "02",
      title: "Strategy & Solution Design",
      description: "We develop a comprehensive strategy and custom solution architecture tailored to your specific business requirements.",
      checkpoints: ["Custom AI model selection", "Technology stack planning", "Implementation roadmap"],
      icon: <Lightbulb className="text-primary" />,
      color: "highlight",
      alignRight: false
    },
    {
      number: "03",
      title: "Development & Integration",
      description: "Our engineering team builds, tests, and integrates the AI solution into your existing systems with minimal disruption to operations.",
      checkpoints: ["Agile development process", "Rigorous quality testing", "Seamless system integration"],
      icon: <Code className="text-primary" />,
      color: "accent",
      alignRight: true
    },
    {
      number: "04",
      title: "Deployment & Optimization",
      description: "We launch your solution and continuously monitor, maintain, and improve its performance to ensure maximum ROI over time.",
      checkpoints: ["Smooth production deployment", "Performance monitoring", "Continuous model improvement"],
      icon: <Rocket className="text-primary" />,
      color: "highlight",
      alignRight: false
    }
  ];

  return (
    <section ref={ref} id="workflow" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div ref={titleRef} className="text-center mb-16">
          <motion.div
            initial="hidden"
            animate={isTitleInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <span className="font-inter text-sm uppercase tracking-widest text-accent mb-3 inline-block">
              Our Approach
            </span>
            <h2 className="text-3xl md:text-5xl font-space font-bold mb-6">
              How We Implement AI Solutions
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto font-inter text-lg">
              Our proven implementation methodology ensures smooth integration, minimal disruption, 
              and maximum value from your AI investment.
            </p>
          </motion.div>
        </div>

        {/* Workflow steps */}
        <div ref={stepsRef} className="relative">
          {/* Animated connecting line */}
          <motion.div 
            className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block overflow-hidden"
            initial={{ height: "0%" }}
            animate={{ height: areStepsInView ? "100%" : "0%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-accent via-highlight to-accent"
              animate={{ 
                backgroundPosition: ["0% 0%", "0% 100%"],
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                repeatType: "reverse", 
                ease: "linear" 
              }}
            />
          </motion.div>
          
          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center`}
                initial="hidden"
                animate={areStepsInView ? "visible" : "hidden"}
                variants={fadeIn}
                custom={index * 0.2}
                onHoverStart={() => setHoveredStep(index)}
                onHoverEnd={() => setHoveredStep(null)}
              >
                <motion.div 
                  className={`${step.alignRight ? 'md:text-right md:order-1' : 'md:order-2 md:text-left'}`}
                  initial={{ opacity: 0, x: step.alignRight ? -50 : 50 }}
                  animate={{ 
                    opacity: areStepsInView ? 1 : 0, 
                    x: areStepsInView ? 0 : (step.alignRight ? -50 : 50),
                    transition: { 
                      delay: index * 0.3,
                      duration: 0.8,
                      ease: "easeOut"
                    }
                  }}
                >
                  <motion.div 
                    className={`inline-block mb-4 text-${step.color === 'accent' ? 'accent' : 'highlight'} font-space text-7xl font-bold`}
                    initial={{ opacity: 0.2 }}
                    animate={{ 
                      opacity: hoveredStep === index ? 0.6 : 0.2,
                      scale: hoveredStep === index ? 1.05 : 1,
                      transition: { duration: 0.4 }
                    }}
                  >
                    {step.number}
                  </motion.div>
                  
                  <motion.h3 
                    className="text-2xl font-space font-bold mb-4"
                    whileHover={{ 
                      x: step.alignRight ? -5 : 5,
                      color: step.color === 'accent' ? '#00F0FF' : '#FF2E63',
                      transition: { duration: 0.3 }
                    }}
                  >
                    {step.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-white/70 font-inter mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: areStepsInView ? 1 : 0,
                      transition: { delay: index * 0.3 + 0.2, duration: 0.8 }
                    }}
                  >
                    {step.description}
                  </motion.p>
                  
                  <motion.ul 
                    className="text-white/70 font-inter space-y-2"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: index * 0.3 + 0.3,
                        },
                      },
                    }}
                    initial="hidden"
                    animate={areStepsInView ? "visible" : "hidden"}
                  >
                    {step.checkpoints.map((checkpoint, i) => (
                      <motion.li 
                        key={i} 
                        className={`flex items-center ${step.alignRight ? 'md:justify-end' : ''} gap-2`}
                        variants={{
                          hidden: { opacity: 0, x: step.alignRight ? 20 : -20 },
                          visible: { 
                            opacity: 1, 
                            x: 0,
                            transition: { duration: 0.5 }
                          }
                        }}
                        whileHover={{ 
                          x: step.alignRight ? -5 : 5,
                          color: 'white',
                          transition: { duration: 0.2 }
                        }}
                      >
                        {!step.alignRight && (
                          <motion.div
                            animate={{ 
                              scale: hoveredStep === index ? [1, 1.2, 1] : 1,
                              transition: { 
                                repeat: hoveredStep === index ? Infinity : 0,
                                duration: 1.5
                              }
                            }}
                          >
                            <CheckCircle className={`text-${step.color === 'accent' ? 'accent' : 'highlight'} text-sm`} />
                          </motion.div>
                        )}
                        <span>{checkpoint}</span>
                        {step.alignRight && (
                          <motion.div
                            animate={{ 
                              scale: hoveredStep === index ? [1, 1.2, 1] : 1,
                              transition: { 
                                repeat: hoveredStep === index ? Infinity : 0,
                                duration: 1.5
                              }
                            }}
                          >
                            <CheckCircle className={`text-${step.color === 'accent' ? 'accent' : 'highlight'} text-sm`} />
                          </motion.div>
                        )}
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
                
                <div className={`${step.alignRight ? 'md:order-2' : 'md:order-1'} relative`}>
                  <motion.div 
                    variants={slideIn(step.alignRight ? "right" : "left")}
                    custom={index * 0.3}
                    whileHover={{ 
                      y: -10,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                  >
                    <motion.div 
                      className="absolute -inset-0.5 bg-gradient-to-r from-accent to-highlight rounded-2xl blur"
                      animate={{ 
                        opacity: hoveredStep === index ? 0.4 : 0.2,
                        backgroundPosition: hoveredStep === index ? ['0% 0%', '100% 100%'] : '0% 0%',
                      }}
                      transition={{ duration: 3, ease: "linear" }}
                    />
                    <motion.div 
                      className="glass rounded-2xl p-1 relative"
                      animate={{ 
                        boxShadow: hoveredStep === index ? 
                          '0 0 25px rgba(0, 240, 255, 0.3)' : 
                          '0 0 0 rgba(0, 240, 255, 0)'
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="aspect-video w-full bg-primary/50 rounded-xl flex items-center justify-center overflow-hidden">
                        <motion.div 
                          className="text-center"
                          variants={floatingAnimation}
                          initial="hidden"
                          animate="visible"
                        >
                          <motion.div 
                            className="inline-block p-4 rounded-xl bg-accent/10 mb-4"
                            variants={pulseAnimation}
                            initial="hidden"
                            animate="visible"
                          >
                            <motion.div 
                              className={`w-16 h-16 rounded-xl bg-${step.color}/20 flex items-center justify-center`}
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <motion.div
                                animate={{ 
                                  rotate: hoveredStep === index ? 360 : 0,
                                  transition: { duration: 3, ease: "linear" }
                                }}
                              >
                                {step.icon}
                              </motion.div>
                            </motion.div>
                          </motion.div>
                          <p className="text-white/80 font-space">{step.title}</p>
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>

                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

Workflow.displayName = "Workflow";

export default Workflow;
