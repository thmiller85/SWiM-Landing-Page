import React, { forwardRef, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Lightbulb, Code, Rocket, CheckCircle } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { fadeIn, slideIn } from "@/lib/animations";

const Workflow = forwardRef<HTMLElement>((props, ref) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useIntersectionObserver(titleRef, { once: false, threshold: 0.1 });
  
  const stepsRef = useRef<HTMLDivElement>(null);
  const areStepsInView = useIntersectionObserver(stepsRef, { once: false, threshold: 0.1 });
  
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
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-highlight to-accent hidden md:block"></div>
          
          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center`}
                initial="hidden"
                animate={areStepsInView ? "visible" : "hidden"}
                variants={fadeIn}
                custom={index * 0.2}
              >
                <div className={`${step.alignRight ? 'md:text-right md:order-1' : 'md:order-2 md:text-left'}`}>
                  <div className={`inline-block mb-4 text-${step.color === 'accent' ? 'accent' : 'highlight'} font-space text-7xl font-bold opacity-20`}>
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-space font-bold mb-4">{step.title}</h3>
                  <p className="text-white/70 font-inter mb-4">
                    {step.description}
                  </p>
                  <ul className="text-white/70 font-inter space-y-2">
                    {step.checkpoints.map((checkpoint, i) => (
                      <li key={i} className={`flex items-center ${step.alignRight ? 'md:justify-end' : ''} gap-2`}>
                        {!step.alignRight && <CheckCircle className={`text-${step.color === 'accent' ? 'accent' : 'highlight'} text-sm`} />}
                        <span>{checkpoint}</span>
                        {step.alignRight && <CheckCircle className={`text-${step.color === 'accent' ? 'accent' : 'highlight'} text-sm`} />}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${step.alignRight ? 'md:order-2' : 'md:order-1'} relative`}>
                  <motion.div 
                    variants={slideIn(step.alignRight ? "right" : "left")}
                    custom={index * 0.3}
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-highlight rounded-2xl blur opacity-20"></div>
                    <div className="glass rounded-2xl p-1 relative">
                      <div className="aspect-video w-full bg-primary/50 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="inline-block p-4 rounded-xl bg-accent/10 mb-4">
                            <div className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center">
                              {index % 2 === 0 ? (
                                <Search className="w-8 h-8 text-accent" />
                              ) : (
                                <Lightbulb className="w-8 h-8 text-highlight" />
                              )}
                            </div>
                          </div>
                          <p className="text-white/80 font-space">{step.title}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Timeline marker for md screens */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className={`w-12 h-12 rounded-full bg-${step.color === 'accent' ? 'accent' : 'highlight'} flex items-center justify-center z-10`}>
                      {step.icon}
                    </div>
                  </div>
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
