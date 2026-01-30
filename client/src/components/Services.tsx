import React, { forwardRef, useRef } from "react";
import { motion } from "framer-motion";
import ServiceCard from "./ui/service-card";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { ShoppingBag, Warehouse, Target } from "lucide-react";

interface Service {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  color: "accent" | "highlight";
  delay: number;
}

const Services = forwardRef<HTMLElement>((props, ref) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useIntersectionObserver(titleRef, { once: false, threshold: 0.1 });
  
  const services: Service[] = [
    {
      id: "retail",
      icon: <ShoppingBag className="text-3xl text-accent" />,
      title: "Retail Intelligence",
      description: "For wholesale brands selling through independent retailers. We unlock the sell-through data trapped across your retail channel — giving you real-time visibility into what's actually selling so you can make smarter inventory, production, and assortment decisions.",
      tags: ["Sell-Through Visibility", "Data Intelligence", "Multi-POS Integration"],
      color: "accent",
      delay: 0
    },
    {
      id: "self-storage",
      icon: <Warehouse className="text-3xl text-highlight" />,
      title: "Storage Operations AI",
      description: "For owner-operators running 1–5 self-storage facilities. We build pricing engines, competitor intel dashboards, and automated workflows that give you the same tools the REITs use — without the REIT budget.",
      tags: ["Dynamic Pricing", "Competitor Research", "Occupancy Optimization"],
      color: "highlight",
      delay: 0.2
    },
    {
      id: "eos-ecosystem",
      icon: <Target className="text-3xl text-accent" />,
      title: "EOS Implementer Growth",
      description: "Stop cold calling. We build AI-powered lead generation systems that deliver 10-15 qualified prospects monthly — so you close 1-2 new EOS clients and stay focused on delivery, not prospecting.",
      tags: ["Qualified Lead Generation", "Multi-Channel Campaigns", "Pipeline Growth"],
      color: "accent",
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
              Our SWiM Lanes
            </span>
            <h2 className="text-3xl md:text-5xl font-space font-bold mb-6">
              AI Solutions Built for Your Industry
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto font-inter text-lg">
              We don't do generic. Each SWiM Lane is purpose-built for operators who need
              enterprise-grade intelligence without enterprise complexity.
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
              id={service.id}
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
