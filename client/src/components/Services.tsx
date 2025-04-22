import React, { forwardRef, useRef } from "react";
import { motion } from "framer-motion";
import ServiceCard from "./ui/service-card";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { ChartScatter, Repeat2, Code, LineChart, Brain, ShieldCheck } from "lucide-react";

const Services = forwardRef<HTMLElement>((props, ref) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useIntersectionObserver(titleRef, { once: false, threshold: 0.1 });
  
  const services = [
    {
      icon: <ChartScatter className="text-3xl text-accent" />,
      title: "AI-Powered Marketing",
      description: "Leverage machine learning algorithms to optimize your marketing campaigns, predict customer behavior, and increase ROI.",
      tags: ["Predictive ChartScatter", "Customer Segmentation", "Content Optimization"],
      color: "accent",
      delay: 0
    },
    {
      icon: <Repeat2 className="text-3xl text-highlight" />,
      title: "Workflow Automation",
      description: "Streamline your operations with intelligent automation systems that reduce manual tasks and optimize resource allocation.",
      tags: ["Process Optimization", "Task Automation", "Efficiency Analysis"],
      color: "highlight",
      delay: 0.2
    },
    {
      icon: <Code className="text-3xl text-accent" />,
      title: "B2B SaaS Development",
      description: "Create custom software solutions that integrate AI capabilities to solve specific business challenges and drive growth.",
      tags: ["Custom Software", "API Integration", "Scalable Solutions"],
      color: "accent",
      delay: 0.4
    },
    {
      icon: <LineChart className="text-3xl text-highlight" />,
      title: "Data Intelligence",
      description: "Transform raw data into actionable insights through advanced analytics, visualization, and predictive modeling.",
      tags: ["Business Intelligence", "Data Visualization", "Predictive Models"],
      color: "highlight",
      delay: 0
    },
    {
      icon: <Brain className="text-3xl text-accent" />,
      title: "AI Strategy Consulting",
      description: "Develop a comprehensive AI roadmap tailored to your business goals, technical infrastructure, and market positioning.",
      tags: ["Technology Assessment", "Implementation Planning", "ROI Analysis"],
      color: "accent",
      delay: 0.2
    },
    {
      icon: <ShieldCheck className="text-3xl text-highlight" />,
      title: "AI Security & Ethics",
      description: "Ensure your AI implementations are secure, compliant with regulations, and aligned with ethical business practices.",
      tags: ["Risk Assessment", "Compliance", "Ethical AI"],
      color: "highlight",
      delay: 0.4
    }
  ];

  return (
    <section ref={ref} id="services" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div ref={titleRef} className="text-center mb-16">
          <motion.div
            initial="hidden"
            animate={isTitleInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <span className="font-inter text-sm uppercase tracking-widest text-accent mb-3 inline-block">
              Our Core Services
            </span>
            <h2 className="text-3xl md:text-5xl font-space font-bold mb-6">
              Comprehensive AI Solutions for Modern Businesses
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto font-inter text-lg">
              We integrate cutting-edge AI technologies into every aspect of your business operations,
              from marketing to workflow automation.
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-full"
          variants={staggerContainer}
          initial="hidden"
          animate={isTitleInView ? "visible" : "hidden"}
        >
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              tags={service.tags}
              color={service.color as "accent" | "highlight"}
              delay={service.delay}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
});

Services.displayName = "Services";

export default Services;
