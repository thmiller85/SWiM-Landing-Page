import React, { useEffect } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeIn, slideIn } from "@/lib/animations";
import { SERVICES } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ServicePageProps {
  id: string;
}

// This will be expanded with more detailed content for each service
interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  longDescription: string[];
  benefits: string[];
  features: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  process: {
    step: number;
    title: string;
    description: string;
  }[];
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
  faqs: {
    question: string;
    answer: string;
  }[];
  color: "accent" | "highlight";
  externalUrl?: string;
}

// Vertical-specific service details
const serviceDetails: Record<string, ServiceDetail> = {
  "retail": {
    id: "retail",
    title: "Retail Intelligence",
    description: "Real-time sell-through visibility and operational intelligence for brands selling through independent retail partners.",
    longDescription: [
      "Here's a reality most wholesale brands don't talk about: once your product lands on a boutique's floor, it disappears into a black box. You know what retailers order. You know what gets shipped. But what's actually selling at the store level? That's the blind spot.",
      "SWiM solves this. We build automated data collection across your retail channel — regardless of POS system — and transform scattered, inconsistent reports into real-time visibility. The result: you make inventory, production, and assortment decisions based on actual sell-through, not guesswork."
    ],
    benefits: [
      "Real-time visibility into what's actually selling across all retail doors",
      "Automated data collection from any POS system — no retailer lift required",
      "Intelligent normalization that handles inconsistent naming, formats, and schedules",
      "Network-wide analytics with privacy-first retailer benchmarking",
      "Foundation for AI-powered trend detection and demand forecasting"
    ],
    features: [
      {
        title: "Multi-POS Data Collection",
        description: "Automated integrations with Shopify, Lightspeed, Clover, Square, and more. Flexible templates for manual submission. We meet retailers where they are — no portal logins, no extra work.",
        icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center"><svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg></div>
      },
      {
        title: "Intelligent Data Normalization",
        description: "AI-powered processing that resolves color variations, size conventions, naming inconsistencies, and format differences. Validates against your master catalog and routes exceptions to managed review — never blocks the pipeline.",
        icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center"><svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></div>
      },
      {
        title: "Network Visibility Dashboard",
        description: "Real-time analytics across your entire retail network. Top-performing products, trending colors, sell-through vs. orders, regional benchmarking — answers to the questions that drive better decisions.",
        icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center"><svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
      },
      {
        title: "Privacy-First Architecture",
        description: "Each retailer's data stays isolated. They see only their own performance plus anonymized network benchmarks. You see the full picture. No retailer can identify another's specific performance — trust built into the architecture.",
        icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center"><svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
      }
    ],
    process: [
      {
        step: 1,
        title: "Retail Channel Audit",
        description: "We map your retail partner landscape, understand POS systems in use, review your product master catalog, and identify the highest-value data collection opportunities."
      },
      {
        step: 2,
        title: "Build Your Proof of Concept",
        description: "We create a working prototype with 3-5 of your retail partners — collecting real data, normalizing it, and delivering a dashboard you can see. You validate the value before committing."
      },
      {
        step: 3,
        title: "Deploy Across Network",
        description: "Once validated, we scale to your full retail partner base — building automated integrations, onboarding retailers with white-glove support, and ensuring data quality across every door."
      },
      {
        step: 4,
        title: "Optimize & Expand",
        description: "We monitor data quality, add new partners as you grow, and layer on AI capabilities — automated trend detection, demand forecasting, and personalized retailer recommendations."
      }
    ],
    cta: {
      title: "See Your Retail Channel \u2014 In Real Time",
      description: "We'll build a working sell-through intelligence prototype using data from a handful of your retail partners. You see the visibility before you commit. That's the SWiM difference.",
      buttonText: "Book Your Free Demo"
    },
    faqs: [
      {
        question: "What POS systems do you integrate with?",
        answer: "We support Shopify, Lightspeed, Clover, Square, and most major retail POS platforms. For less common systems or retailers who prefer it, we provide standardized spreadsheet templates. The key: we meet retailers where they are."
      },
      {
        question: "How do you get retailers to actually submit their data?",
        answer: "Two ways. First, we make it frictionless — automated integrations where possible, simple templates where not. Second, we create a value exchange. Retailers get network benchmarking and AI-powered insights they couldn't generate on their own. It's not data extraction — it's a genuine partnership."
      },
      {
        question: "How quickly can we see a working prototype?",
        answer: "Most retail intelligence proofs of concept are built and validated within 4-6 weeks using 3-5 of your retail partners. We show you real data, real dashboards, real insights — before you commit to anything."
      }
    ],
    color: "accent"
  },
  "self-storage": {
    id: "self-storage",
    title: "Storage Operations AI",
    description: "The big REITs have data science teams. You have SWiM. An AI overlay for Storable Easy that optimizes pricing, automates rent increases, and handles tenant inquiries \u2014 no system switch required.",
    longDescription: [
      "If you're pricing units by gut feel, you're leaving $500\u2013$2,000 a month on the table. If you're spending 10\u201315 hours a week fielding tenant calls and texts, that's time you're not growing. And if you're afraid to raise rents because you might lose tenants \u2014 you're losing revenue every single month.",
      "SWiM Storage plugs into Storable Easy, ingests your facility data nightly, and puts AI to work across three areas: optimizing your street rates based on real market signals, scheduling rent increases with churn-risk modeling so you raise at the right time, and deploying AuroraBot to handle tenant inquiries via chat and SMS around the clock."
    ],
    benefits: [
      "\u22654% Revenue Lift",
      "70% Fewer Support Calls",
      "Works with Storable Easy",
      "No System Switch Required",
      "See It Work Before You Sign"
    ],
    features: [
      {
        title: "Daily Rate Recommendations",
        description: "AI analyzes occupancy, seasonality, competitor rates, and demand signals to recommend optimal street rates every day. One-click approve or override \u2014 you're always in control.",
        icon: <div className="w-12 h-12 rounded-lg bg-highlight/20 flex items-center justify-center"><svg className="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
      },
      {
        title: "Automated Rent Increase Scheduling",
        description: "A survival analysis model predicts churn risk for every tenant and schedules raises at the optimal time. Maximize revenue without losing occupancy.",
        icon: <div className="w-12 h-12 rounded-lg bg-highlight/20 flex items-center justify-center"><svg className="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg></div>
      },
      {
        title: "AuroraBot Tenant Communications",
        description: "AI-powered chat and SMS that handles quotes, reservations, payment links, and directions. 70% of routine tenant inquiries resolved automatically \u2014 while you sleep.",
        icon: <div className="w-12 h-12 rounded-lg bg-highlight/20 flex items-center justify-center"><svg className="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg></div>
      },
      {
        title: "Competitor Rate Engine",
        description: "Automated daily scanning of competitor pricing across your market. Identifies gaps and opportunities in your rate structure so you never underprice \u2014 or overprice \u2014 a unit.",
        icon: <div className="w-12 h-12 rounded-lg bg-highlight/20 flex items-center justify-center"><svg className="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
      },
      {
        title: "Revenue Intelligence Dashboard",
        description: "RevPAR, lift %, churn graphs, and pricing decision logs in a single view. Updated in real time so you always know where you stand.",
        icon: <div className="w-12 h-12 rounded-lg bg-highlight/20 flex items-center justify-center"><svg className="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
      }
    ],
    process: [
      {
        step: 1,
        title: "Connect Your Data",
        description: "CSV upload from Storable Easy \u2014 API integration coming. We ingest your facility data nightly so the AI always has fresh numbers."
      },
      {
        step: 2,
        title: "30-Day Parallel Run",
        description: "AI suggests rates alongside your current pricing. You see the projected lift before anything changes. No risk, full visibility."
      },
      {
        step: 3,
        title: "Go Live",
        description: "Enable automated rate recommendations, rent increase scheduling, and AuroraBot tenant communications with one click."
      },
      {
        step: 4,
        title: "Monitor & Optimize",
        description: "We track pricing performance, refine models as your market shifts, and deliver monthly impact reports so you always know the ROI."
      }
    ],
    cta: {
      title: "Join the Founding Members",
      description: "We're onboarding 15 founding facilities with priority access, lifetime pricing, and white-glove setup. See it work with your data before you commit.",
      buttonText: "Claim Your Spot"
    },
    faqs: [
      {
        question: "Do I need to switch off Storable Easy?",
        answer: "No. SWiM is an overlay \u2014 it connects to Easy via CSV export (API coming). Nothing changes about your existing setup."
      },
      {
        question: "What if the AI recommends a bad rate?",
        answer: "Every recommendation has a rate-change cap and requires your approval. You're always in control. The AI suggests \u2014 you decide."
      },
      {
        question: "Can this work with just one facility?",
        answer: "Yes. We're built for owner-operators running 1\u20135 facilities. The system delivers value starting with a single site and scales as you grow."
      },
      {
        question: "What is AuroraBot?",
        answer: "Our AI assistant that handles tenant inquiries via chat and SMS \u2014 quotes, reservations, payment links, directions. It responds in seconds, 24/7, so you don't have to."
      }
    ],
    color: "highlight",
    externalUrl: "https://swimstorage.com"
  },
  "eos-ecosystem": {
    id: "eos-ecosystem",
    title: "Coaching Practice Growth",
    description: "AI-powered lead generation and pipeline management for active business coaches and consultants.",
    longDescription: [
      "As a business coach, your time is best spent with clients \u2014 not chasing leads. But inconsistent pipeline flow is the number one growth constraint most coaches face.",
      "SWiM builds AI-powered outreach and pipeline systems that keep your funnel full while you focus on delivery. From personalized cold outreach to automated nurture sequences, we turn lead generation into a system that runs without you."
    ],
    benefits: [
      "AI-powered cold outreach that personalizes messages at scale",
      "Automated nurture sequences that warm leads without manual effort",
      "Pipeline dashboard connected to your CRM for real-time visibility",
      "Send-time optimization that maximizes open and response rates",
      "Qualified lead flow that lets you focus on delivery, not prospecting"
    ],
    features: [
      {
        title: "AI Cold Outreach",
        description: "Personalized outreach messages generated at scale using AI that understands your coaching methodology, client pain points, and decision-maker profiles.",
        icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center"><svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
      },
      {
        title: "Automated Nurture Sequences",
        description: "Multi-touch email and LinkedIn sequences that warm prospects over time without manual follow-up.",
        icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center"><svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></div>
      },
      {
        title: "Pipeline Analytics Dashboard",
        description: "Real-time visibility into your full pipeline \u2014 from first touch to closed deal \u2014 connected to your CRM.",
        icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center"><svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
      },
      {
        title: "Send-Time Optimization",
        description: "Machine learning that identifies the optimal send windows for your specific audience to maximize engagement.",
        icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center"><svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
      }
    ],
    process: [
      {
        step: 1,
        title: "ICP & Messaging Workshop",
        description: "We define your ideal client profile, key messaging angles, and outreach strategy tailored to your coaching prospects."
      },
      {
        step: 2,
        title: "Outreach System Prototype",
        description: "We build and test an AI-powered outreach system using real prospect data, optimizing for response rates."
      },
      {
        step: 3,
        title: "Full System Deployment",
        description: "Once validated, we deploy the complete pipeline \u2014 outreach, nurture, CRM integration, and analytics dashboard."
      },
      {
        step: 4,
        title: "Optimize & Scale",
        description: "We monitor performance, A/B test messaging, refine targeting, and scale volume as your pipeline grows."
      }
    ],
    cta: {
      title: "See It Work Before You Sign",
      description: "We'll build a working outreach prototype targeting your ideal coaching prospects \u2014 before you commit to anything. That's the SWiM difference.",
      buttonText: "Book Your Free Demo"
    },
    faqs: [
      {
        question: "How does AI personalization work without sounding robotic?",
        answer: "Our AI is trained on your coaching methodology and frameworks. Messages reference real pain points and use natural, conversational tone \u2014 not template fill-in-the-blank."
      },
      {
        question: "Will this integrate with my existing CRM?",
        answer: "Yes. We integrate with HubSpot, Salesforce, and most major CRMs. Leads flow directly into your existing pipeline with full attribution."
      },
      {
        question: "How quickly can I expect to see qualified leads?",
        answer: "Most coaches see their first qualified responses within 2-3 weeks of launch, with pipeline building steadily from there."
      }
    ],
    color: "accent"
  }
};

const ServicePage: React.FC<ServicePageProps> = ({ id }) => {
  const [location, setLocation] = useLocation();
  
  // Get the service details
  const service = serviceDetails[id];
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (!service) {
    // Redirect to 404 if service not found
    setLocation("/not-found");
    return null;
  }

  // Function to scroll back to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper function to scroll to section with an ID, accounting for header height
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Get the header height (approximately 100px), plus some extra padding
      const headerOffset = 120;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
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
        
        {/* Hero Section */}
        <section className="pt-56 pb-24 relative">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="flex flex-col-reverse md:flex-row md:items-center gap-12">
              <motion.div 
                className="md:w-1/2"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <Link 
                  href="/" 
                  className={`inline-flex items-center text-sm mb-6 transition-colors ${
                    service.color === "accent" 
                      ? "text-accent/60 hover:text-accent" 
                      : "text-highlight/60 hover:text-highlight"
                  }`}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Services
                </Link>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-space font-bold mb-6">{service.title}</h1>
                <p className="text-lg text-white/70 mb-8">{service.description}</p>
                <div className="flex flex-wrap gap-3 mb-8">
                  {service.benefits.slice(0, 3).map((benefit, index) => (
                    <span 
                      key={index}
                      className={`text-xs px-3 py-1 rounded-full ${
                        service.color === "accent" ? "bg-accent/20 text-accent" : "bg-highlight/20 text-highlight"
                      }`}
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  {service.externalUrl ? (
                    <Button
                      className={`${
                        service.color === "accent" ? "bg-accent hover:bg-accent/90" : "bg-highlight hover:bg-highlight/90"
                      } text-white`}
                      onClick={() => window.open(service.externalUrl, "_blank", "noopener,noreferrer")}
                    >
                      {service.cta.buttonText}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      className={`${
                        service.color === "accent" ? "bg-accent hover:bg-accent/90" : "bg-highlight hover:bg-highlight/90"
                      } text-white`}
                      onClick={() => {
                        setLocation("/");
                        setTimeout(() => {
                          const contactSection = document.getElementById("contact");
                          if (contactSection) {
                            const headerOffset = 120;
                            const elementPosition = contactSection.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                            window.scrollTo({
                              top: offsetPosition,
                              behavior: "smooth"
                            });
                          }
                        }, 100);
                      }}
                    >
                      {service.cta.buttonText}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className={`${
                      service.color === "accent"
                        ? "border-accent/20 text-accent hover:bg-accent/10"
                        : "border-highlight/20 text-highlight hover:bg-highlight/10"
                    }`}
                    onClick={() => scrollToSection("features")}
                  >
                    Explore Features
                  </Button>
                  {service.externalUrl && (
                    <Button
                      variant="outline"
                      className={`${
                        service.color === "accent"
                          ? "border-accent/20 text-accent hover:bg-accent/10"
                          : "border-highlight/20 text-highlight hover:bg-highlight/10"
                      }`}
                      onClick={() => window.open(service.externalUrl, "_blank", "noopener,noreferrer")}
                    >
                      Visit swimstorage.com
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
              
              <motion.div 
                className="md:w-1/2 flex justify-center"
                initial="hidden"
                animate="visible"
                variants={slideIn("right")}
              >
                <div className={`w-full max-w-md aspect-square rounded-2xl ${
                  service.color === "accent" ? "bg-accent/10" : "bg-highlight/10"
                } p-8 flex items-center justify-center relative overflow-hidden`}>
                  {/* Custom icon based on service type */}
                  <div className={`absolute inset-0 flex items-center justify-center opacity-30`}>
                    {service.color === "accent" ? (
                      <svg className="w-48 h-48 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {service.id === "retail" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
                        {service.id === "eos-ecosystem" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                      </svg>
                    ) : (
                      <svg className="w-48 h-48 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {service.id === "self-storage" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />}
                      </svg>
                    )}
                  </div>
                  <div className="relative z-10 text-center">
                    <h3 className={`text-2xl font-space font-bold mb-4 ${service.color === "accent" ? "text-accent" : "text-highlight"}`}>{service.title}</h3>
                    <p className="text-white/70">Advanced solutions for modern business challenges</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Description Section */}
        <section className="py-16 relative">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="max-w-4xl mx-auto">
              {service.longDescription.map((paragraph, index) => (
                <p key={index} className="text-lg text-white/80 mb-6">{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-16 relative">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="text-center mb-16">
              <span className={`font-inter text-sm uppercase tracking-widest ${service.color === "accent" ? "text-accent" : "text-highlight"} mb-3 inline-block`}>
                Key Features
              </span>
              <h2 className="text-3xl md:text-4xl font-space font-bold mb-6">
                What Makes Our {service.title} Different
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto font-inter">
                Our comprehensive approach ensures you receive the most effective solutions for your business needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {service.features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="glass rounded-xl p-6 flex gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {feature.icon}
                  <div>
                    <h3 className={`text-xl font-space font-bold mb-2 ${service.color === "accent" ? "text-accent" : "text-highlight"}`}>{feature.title}</h3>
                    <p className="text-white/70">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Process Section */}
        <section className="py-16 relative">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="text-center mb-16">
              <span className={`font-inter text-sm uppercase tracking-widest ${service.color === "accent" ? "text-accent" : "text-highlight"} mb-3 inline-block`}>
                Our Approach
              </span>
              <h2 className="text-3xl md:text-4xl font-space font-bold mb-6">
                How We Deliver Results
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto font-inter">
                A proven methodology that ensures successful outcomes for your business.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              {service.process.map((step, index) => (
                <motion.div 
                  key={index}
                  className="relative pl-14 pb-12 last:pb-0"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {/* Step number */}
                  <div className={`absolute left-0 top-0 w-10 h-10 rounded-full ${
                    service.color === "accent" ? "bg-accent/20 text-accent" : "bg-highlight/20 text-highlight"
                  } flex items-center justify-center font-bold`}>
                    {step.step}
                  </div>
                  
                  {/* Line connecting steps */}
                  {index < service.process.length - 1 && (
                    <div className={`absolute left-5 top-10 w-0.5 h-full ${
                      service.color === "accent" ? "bg-accent/20" : "bg-highlight/20"
                    }`}></div>
                  )}
                  
                  {/* Content */}
                  <h3 className={`text-xl font-space font-bold mb-2 ${service.color === "accent" ? "text-accent" : "text-highlight"}`}>{step.title}</h3>
                  <p className="text-white/70">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 relative">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="text-center mb-16">
              <span className={`font-inter text-sm uppercase tracking-widest ${service.color === "accent" ? "text-accent" : "text-highlight"} mb-3 inline-block`}>
                FAQs
              </span>
              <h2 className="text-3xl md:text-4xl font-space font-bold mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto font-inter">
                Get answers to common questions about our {service.title} services.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              {service.faqs.map((faq, index) => (
                <motion.div 
                  key={index}
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <h3 className={`text-xl font-space font-bold mb-2 ${service.color === "accent" ? "text-accent" : "text-highlight"}`}>{faq.question}</h3>
                  <p className="text-white/70">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section id="contact" className="py-16 relative">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className={`rounded-2xl ${
              service.color === "accent" ? "bg-accent/10" : "bg-highlight/10"
            } p-8 md:p-12 text-center`}>
              <h2 className="text-3xl md:text-4xl font-space font-bold mb-4">{service.cta.title}</h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">{service.cta.description}</p>
              <Button
                size="lg"
                className={`${
                  service.color === "accent" ? "bg-accent hover:bg-accent/90" : "bg-highlight hover:bg-highlight/90"
                } text-white`}
                onClick={() => {
                  if (service.externalUrl) {
                    window.open(service.externalUrl, "_blank", "noopener,noreferrer");
                  } else {
                    setLocation("/");
                    setTimeout(() => {
                      const contactSection = document.getElementById("contact");
                      if (contactSection) {
                        const headerOffset = 120;
                        const elementPosition = contactSection.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: "smooth"
                        });
                      }
                    }, 100);
                  }
                }}
              >
                {service.cta.buttonText}
                {service.externalUrl ? <ExternalLink className="ml-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </section>
        
        {/* Back to top button */}
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            size="icon"
            variant="outline"
            className={`rounded-full backdrop-blur-sm ${
              service.color === "accent" 
                ? "bg-accent/10 border-accent/20 text-accent hover:bg-accent/20" 
                : "bg-highlight/10 border-highlight/20 text-highlight hover:bg-highlight/20"
            }`}
            onClick={scrollToTop}
          >
            <ArrowRight className="h-4 w-4 rotate-[270deg]" />
          </Button>
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

export default ServicePage;