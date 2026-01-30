import React, { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeIn, slideIn, staggerContainer } from "@/lib/animations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Pain points data
const painPoints = [
  {
    icon: "😫",
    title: "The Networking Nightmare",
    description: "Another Chamber event. Another stack of business cards. Zero qualified leads.",
  },
  {
    icon: "📞",
    title: "Cold Calling Hell",
    description: "100 calls, 3 conversations, 0 appointments. Your expertise deserves better.",
  },
  {
    icon: "⏰",
    title: "The Time Trap",
    description: "20+ hours weekly on business development instead of serving clients.",
  },
  {
    icon: "💸",
    title: "Revenue Rollercoaster",
    description: "Feast or famine cycles. No predictable pipeline. Constant stress.",
  },
  {
    icon: "🎯",
    title: "Wrong-Fit Clients",
    description: "Taking anyone who says yes instead of ideal clients who value EOS.",
  },
];

// Solutions data
const solutions = [
  {
    icon: "🎯",
    title: "Laser-Targeted Campaigns",
    description: "AI identifies your ideal clients: 10-250 employee companies ready for EOS. No more spray and pray.",
  },
  {
    icon: "🚀",
    title: "Multi-Channel Presence",
    description: "LinkedIn, Google, Meta — we're everywhere your prospects are. Competitors only use one channel.",
  },
  {
    icon: "🤖",
    title: "AI as the Operating Layer",
    description: "AI isn't a feature we bolted on — it powers every decision, every message, every optimization. Enterprise-grade intelligence, finally accessible.",
  },
  {
    icon: "📊",
    title: "Pre-Qualification System",
    description: "Only book calls with businesses that need and can afford EOS. No more tire kickers.",
  },
  {
    icon: "📈",
    title: "Conversion Optimization",
    description: "Landing pages that convert at 15%+. Industry average is 2%. That's 7X more leads from the same spend.",
  },
  {
    icon: "⚡",
    title: "Speed to Lead",
    description: "Automated follow-up within 5 minutes. Studies show this increases conversion by 900%.",
  },
];

// Before/After transformation data
const beforeItems = [
  "20+ hours/week prospecting",
  "Cold calling & networking",
  "Unpredictable pipeline",
  "Chasing unqualified leads",
  "$0-50K months randomly",
  "Constant revenue stress",
];

const afterItems = [
  "2 hours/week on sales",
  "Qualified leads call YOU",
  "Predictable pipeline flow",
  "Pre-qualified, eager prospects",
  "Consistent $50-100K months",
  "Focus on client delivery",
];

// Timeline data
const timelineItems = [
  {
    number: "1",
    title: "Week 1-2: Strategic Setup",
    description: "AI analyzes your ideal client profile, builds custom landing pages, launches targeted campaigns across LinkedIn, Google, and Meta.",
  },
  {
    number: "2",
    title: "Week 3-4: First Leads Arrive",
    description: "Qualified prospects start booking discovery calls. You're having 3-5 meaningful conversations with businesses ready for EOS.",
  },
  {
    number: "3",
    title: "Week 5-8: Pipeline Building",
    description: "10-15 qualified leads monthly. Your calendar fills with quality prospects. First new client typically closes here.",
  },
  {
    number: "4",
    title: "Week 9-12: Momentum",
    description: "System fully optimized. Predictable flow of 15-20 leads monthly. 2-3 new clients closed. ROI proven.",
  },
];

// Trust strip items
const trustItems = [
  "AI-native architecture — not bolted-on features",
  "Built by operators who've solved these problems firsthand",
  "Founder-led delivery, U.S. based team",
];

const EosLandingPage: React.FC = () => {
  const [_, setLocation] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCtaClick = () => {
    setLocation("/");
    setTimeout(() => {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        const headerOffset = 120;
        const elementPosition = contactSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="bg-primary min-h-screen overflow-x-hidden">
      <div className="gradient-bg">
        {/* Navigation */}
        <Navbar
          onServicesClick={() => setLocation("/")}
          onAISolutionsClick={() => setLocation("/")}
          onWorkflowClick={() => setLocation("/")}
          onCaseStudiesClick={() => setLocation("/")}
          onAboutClick={() => setLocation("/")}
          onContactClick={() => setLocation("/")}
        />

        {/* Hero Section — Two-column: text left, pain points right */}
        <section className="pt-56 pb-16 relative">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <Link
              href="/"
              className="inline-flex items-center text-sm mb-8 text-accent/60 hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              {/* Left column — Hero text */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <span className="font-inter text-sm uppercase tracking-widest text-accent mb-4 block">
                  The Problem We Solve
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-[48px] font-space font-bold mb-6 leading-tight">
                  Stop Cold Calling.{" "}
                  <span className="gradient-text">
                    Start Closing 1-2 New EOS Clients Monthly.
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-white/[0.85] font-inter mb-8">
                  You're brilliant at implementing EOS. But spending 20+ hours a week on business development is killing your productivity and passion.
                </p>
                <Button
                  className="bg-accent hover:bg-accent/90 text-white"
                  size="lg"
                  onClick={handleCtaClick}
                >
                  Book Your Proof Session
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>

              {/* Right column — Pain Points card */}
              <motion.div
                className="glass rounded-2xl p-8 md:p-10"
                initial="hidden"
                animate="visible"
                variants={slideIn("right")}
              >
                <h3 className="text-2xl font-space font-semibold mb-6">Sound Familiar?</h3>
                <ul className="space-y-5">
                  {painPoints.map((point, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-4 p-4 bg-accent/10 border-l-4 border-highlight rounded-lg hover:bg-accent/[0.15] hover:translate-x-1 transition-all duration-300"
                    >
                      <span className="text-2xl flex-shrink-0">{point.icon}</span>
                      <div>
                        <div className="font-inter font-semibold mb-1">{point.title}</div>
                        <div className="text-white/75 font-inter text-sm leading-relaxed">{point.description}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Transformation Section */}
        <section className="py-20 relative bg-gradient-to-br from-[#0A3A5A] to-[#1A8CB7]">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-space font-bold mb-12 text-center">
                Your Business Development Transformation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 max-w-5xl mx-auto items-center">
                {/* Before */}
                <motion.div
                  className="glass rounded-2xl p-8 border border-dashed border-white/20"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="text-xl font-space font-bold mb-6 text-white/60">Before SWiM AI</h3>
                  <div className="space-y-4">
                    {beforeItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <span className="text-white/70 font-inter">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Arrow */}
                <div className="flex justify-center items-center py-4 md:py-0">
                  <motion.div
                    className="text-accent"
                    animate={{ x: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-12 h-12 md:rotate-0 rotate-90" />
                  </motion.div>
                </div>

                {/* After */}
                <motion.div
                  className="glass rounded-2xl p-8 border border-highlight/30 hover:shadow-[0_0_30px_rgba(75,203,242,0.15)] transition-shadow duration-500"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="text-xl font-space font-bold mb-6 text-highlight">After SWiM AI</h3>
                  <div className="space-y-4">
                    {afterItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-highlight flex-shrink-0" />
                        <span className="text-white/80 font-inter">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="py-20 relative bg-[#002348]">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <div className="text-center mb-12">
                <motion.h2
                  className="text-3xl md:text-4xl font-space font-bold mb-5"
                  variants={fadeIn}
                >
                  We Solve the Pain Others Accept
                </motion.h2>
                <motion.p
                  className="text-xl text-white/75 font-inter max-w-2xl mx-auto"
                  variants={fadeIn}
                >
                  Other tools give you dashboards. We give you qualified leads. Here's how.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {solutions.map((solution, index) => (
                  <motion.div
                    key={index}
                    className="glass rounded-2xl p-8 border border-accent/20 hover:-translate-y-2.5 hover:border-accent hover:shadow-xl transition-all duration-300"
                    variants={fadeIn}
                  >
                    <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-r from-accent to-highlight flex items-center justify-center mb-5 text-[28px] shadow-[0_0_20px_rgba(26,140,183,0.3)]">
                      {solution.icon}
                    </div>
                    <h3 className="text-xl font-space font-semibold mb-4">{solution.title}</h3>
                    <p className="text-white/80 font-inter leading-relaxed">{solution.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 relative bg-[#00111F]">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-space font-bold mb-5">
                  Your First 90 Days
                </h2>
                <p className="text-xl text-white/75 font-inter">
                  From struggling to thriving in 12 weeks
                </p>
              </div>

              <div className="max-w-[800px] mx-auto space-y-10">
                {timelineItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex gap-8 items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-highlight flex items-center justify-center flex-shrink-0 text-[#00111F] font-bold shadow-[0_0_20px_rgba(26,140,183,0.3)]">
                      {item.number}
                    </div>
                    <div className="flex-1 glass rounded-2xl p-6 border border-accent/20 hover:border-accent hover:shadow-lg transition-all duration-300">
                      <h3 className="text-xl font-space font-semibold mb-2">{item.title}</h3>
                      <p className="text-white/80 font-inter leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="py-10 border-y border-accent/20 relative bg-[#00111F]">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
              {trustItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-highlight text-lg">✓</span>
                  <span className="text-white/90 font-inter">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="py-20 relative bg-[#002348]">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="rounded-2xl bg-gradient-to-r from-[#0A3A5A] to-[#1A8CB7] p-8 md:p-16 text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-[42px] font-space font-bold mb-5 leading-tight">
                Stop Struggling. Start Scaling.
              </h2>
              <p className="text-white/80 font-inter max-w-2xl mx-auto mb-8 text-xl">
                SWiM AI intelligently targets ideal EOS clients — giving you predictable pipeline and back your life.
              </p>
              <Button
                size="lg"
                className="bg-highlight hover:bg-highlight/90 text-[#00111F] font-bold hover:-translate-y-0.5 transition-all duration-300"
                onClick={handleCtaClick}
              >
                See It Work | Free Proof Session
              </Button>
              <p className="text-white/60 font-inter text-sm mt-6">
                🔒 See it work before you sign | No Setup Fees | Cancel Anytime
              </p>
            </div>
          </div>
        </section>

        {/* EOS Disclaimer + Footer */}
        <div className="text-center py-4 border-t border-accent/20">
          <p className="text-white/70 font-inter text-sm">
            © {new Date().getFullYear()} SWiM AI - Enterprise-Grade Lead Intelligence for EOS Implementers
          </p>
          <p className="text-white/50 font-inter text-xs mt-2">
            Not affiliated with EOS Worldwide.
          </p>
        </div>

        <Footer
          onServicesClick={() => setLocation("/")}
          onAboutClick={() => setLocation("/")}
          onContactClick={() => setLocation("/")}
        />
      </div>
    </div>
  );
};

export default EosLandingPage;
