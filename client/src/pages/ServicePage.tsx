import React, { useEffect } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
}

// Sample service details (these would come from a database or API in a real application)
const serviceDetails: Record<string, ServiceDetail> = {
  "ai-powered-marketing": {
    id: "ai-powered-marketing",
    title: "AI-Powered Marketing",
    description: "Leverage machine learning algorithms to optimize your marketing campaigns, predict customer behavior, and increase ROI.",
    longDescription: [
      "Our AI-powered marketing solutions use advanced algorithms to analyze customer data, predict behavior patterns, and optimize your marketing campaigns in real-time.",
      "By leveraging machine learning and predictive analytics, we help you identify the most effective channels, messaging, and timing for your target audience, resulting in higher conversion rates and ROI."
    ],
    benefits: [
      "Increased conversion rates through personalized marketing",
      "Reduced marketing spend by focusing on high-performing channels",
      "Improved customer retention through predictive behavior analysis",
      "Data-driven insights to inform your marketing strategy",
      "Automated campaign optimization that improves over time"
    ],
    features: [
      {
        title: "Predictive Analytics",
        description: "Forecast customer behavior and market trends to stay ahead of the competition.",
        icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center"><svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
      },
      {
        title: "Customer Segmentation",
        description: "Automatically group customers based on behavior, preferences, and demographics.",
        icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center"><svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>
      },
      {
        title: "Content Optimization",
        description: "AI-driven content recommendations that resonate with your target audience.",
        icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center"><svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></div>
      },
      {
        title: "Campaign Automation",
        description: "Set up self-optimizing campaigns that improve performance over time.",
        icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center"><svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></div>
      }
    ],
    process: [
      {
        step: 1,
        title: "Data Collection & Analysis",
        description: "We gather and analyze your existing marketing data to establish baselines and identify opportunities."
      },
      {
        step: 2,
        title: "Strategy Development",
        description: "Our team creates a customized AI marketing strategy aligned with your business goals."
      },
      {
        step: 3,
        title: "Implementation",
        description: "We deploy AI-powered tools and integrate them with your existing marketing stack."
      },
      {
        step: 4,
        title: "Optimization",
        description: "Continuous monitoring and refinement to improve performance and ROI."
      }
    ],
    cta: {
      title: "Transform Your Marketing with AI",
      description: "Ready to leverage AI to increase your marketing effectiveness? Our team of experts is ready to help you implement cutting-edge solutions tailored to your business.",
      buttonText: "Get a Marketing Analysis"
    },
    faqs: [
      {
        question: "How quickly can I expect to see results from AI-powered marketing?",
        answer: "Most clients see initial improvements within 4-6 weeks, with significant results typically appearing within 3-4 months as the AI continues to learn and optimize."
      },
      {
        question: "Do I need to replace my entire marketing stack?",
        answer: "No, our solutions are designed to integrate with your existing marketing tools and platforms, enhancing their capabilities rather than replacing them."
      },
      {
        question: "How do you ensure the AI makes decisions aligned with our brand?",
        answer: "We work closely with your team to establish parameters and guidelines that align with your brand values and marketing objectives, ensuring the AI operates within your defined boundaries."
      }
    ],
    color: "accent"
  },
  "workflow-automation": {
    id: "workflow-automation",
    title: "Workflow Automation",
    description: "Streamline your operations with intelligent automation systems that reduce manual tasks and optimize resource allocation.",
    longDescription: [
      "Our workflow automation solutions transform manual, time-consuming processes into streamlined, efficient operations that free your team to focus on high-value activities.",
      "Using a combination of AI, machine learning, and robotic process automation (RPA), we identify bottlenecks, eliminate redundancies, and create intelligent workflows that adapt to changing conditions."
    ],
    benefits: [
      "Reduced operational costs through elimination of manual tasks",
      "Increased productivity and throughput across departments",
      "Minimized human error in repetitive processes",
      "Improved employee satisfaction by removing tedious tasks",
      "Enhanced scalability without proportional increase in staff"
    ],
    features: [
      {
        title: "Process Mapping & Analysis",
        description: "Comprehensive mapping of your existing workflows to identify automation opportunities.",
        icon: <div className="w-12 h-12 rounded-lg bg-highlight/20 flex items-center justify-center"><svg className="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg></div>
      },
      {
        title: "Intelligent Document Processing",
        description: "Extract, categorize, and process information from documents with minimal human intervention.",
        icon: <div className="w-12 h-12 rounded-lg bg-highlight/20 flex items-center justify-center"><svg className="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
      },
      {
        title: "Adaptive Workflows",
        description: "Workflows that learn and improve based on changing conditions and outcomes.",
        icon: <div className="w-12 h-12 rounded-lg bg-highlight/20 flex items-center justify-center"><svg className="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></div>
      },
      {
        title: "Cross-System Integration",
        description: "Seamless connection between disparate systems and platforms for unified operations.",
        icon: <div className="w-12 h-12 rounded-lg bg-highlight/20 flex items-center justify-center"><svg className="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg></div>
      }
    ],
    process: [
      {
        step: 1,
        title: "Process Discovery",
        description: "We analyze your current workflows, identify inefficiencies, and pinpoint automation opportunities."
      },
      {
        step: 2,
        title: "Solution Design",
        description: "Our team designs custom automation solutions tailored to your specific business processes."
      },
      {
        step: 3,
        title: "Development & Integration",
        description: "We develop and deploy automation tools that integrate seamlessly with your existing systems."
      },
      {
        step: 4,
        title: "Monitoring & Optimization",
        description: "Continuous evaluation and refinement to ensure optimal performance and adaptation to changes."
      }
    ],
    cta: {
      title: "Reclaim Time with Intelligent Automation",
      description: "Ready to free your team from repetitive tasks and streamline your operations? Our automation experts are ready to transform your workflows.",
      buttonText: "Schedule a Workflow Audit"
    },
    faqs: [
      {
        question: "Which business processes are best suited for automation?",
        answer: "Processes that are repetitive, rule-based, high-volume, and time-consuming typically yield the highest ROI from automation. Examples include data entry, document processing, approval workflows, and reporting."
      },
      {
        question: "How disruptive is implementing automation to our current operations?",
        answer: "We design our implementation process to minimize disruption. Most solutions are deployed in phases, with careful testing and training to ensure a smooth transition."
      },
      {
        question: "Can automated workflows adapt to changes in our business processes?",
        answer: "Yes, we develop flexible automation solutions that can be easily modified as your processes evolve. Our AI-powered workflows also learn and adapt to changing conditions over time."
      }
    ],
    color: "highlight"
  },
  "b2b-saas-development": {
    id: "b2b-saas-development",
    title: "B2B SaaS Development",
    description: "Create custom software solutions that integrate AI capabilities to solve specific business challenges and drive growth.",
    longDescription: [
      "Our B2B SaaS development services deliver custom software solutions designed specifically for your business challenges, with AI capabilities seamlessly integrated to maximize value.",
      "We focus on creating scalable, secure, and user-friendly applications that solve real business problems, streamline operations, and create competitive advantages for your organization."
    ],
    benefits: [
      "Custom software tailored to your specific business needs",
      "Reduced costs compared to off-the-shelf solutions with unnecessary features",
      "Seamless integration with your existing technology stack",
      "Scalable solutions that grow with your business",
      "Competitive advantage through proprietary software capabilities"
    ],
    features: [
      {
        title: "Custom Software Development",
        description: "End-to-end development of bespoke software solutions designed specifically for your business needs.",
        icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center"><svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg></div>
      },
      {
        title: "AI Integration",
        description: "Incorporate cutting-edge AI capabilities to enhance functionality and provide competitive advantages.",
        icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center"><svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
      },
      {
        title: "API Development",
        description: "Create robust APIs that enable seamless integration with third-party services and platforms.",
        icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center"><svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg></div>
      },
      {
        title: "Cloud-Native Architecture",
        description: "Design and develop scalable, resilient applications optimized for cloud environments.",
        icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center"><svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg></div>
      }
    ],
    process: [
      {
        step: 1,
        title: "Discovery & Requirements",
        description: "We work closely with your team to understand your business challenges and define detailed requirements."
      },
      {
        step: 2,
        title: "Design & Architecture",
        description: "Our architects create a comprehensive solution design, including technical architecture and user experience."
      },
      {
        step: 3,
        title: "Agile Development",
        description: "We develop your solution using agile methodologies, with regular demos and feedback cycles."
      },
      {
        step: 4,
        title: "Testing & Deployment",
        description: "Rigorous testing and smooth deployment, followed by ongoing support and enhancement."
      }
    ],
    cta: {
      title: "Build Your Custom SaaS Solution",
      description: "Ready to create a software solution that perfectly fits your business needs? Our development team is ready to bring your vision to life.",
      buttonText: "Discuss Your SaaS Project"
    },
    faqs: [
      {
        question: "How long does it typically take to develop a custom SaaS solution?",
        answer: "Development timelines vary based on complexity, but most projects take 4-8 months from conception to launch. We use an agile approach with phased releases to deliver value incrementally."
      },
      {
        question: "How do you ensure the security of our data and intellectual property?",
        answer: "We implement industry-leading security practices throughout the development process, including secure coding standards, regular security testing, and comprehensive data protection measures. All our work is covered by strict confidentiality agreements."
      },
      {
        question: "Can you enhance our existing software rather than building from scratch?",
        answer: "Absolutely. We often work with clients to modernize and extend their existing software systems, adding new features, improving performance, or integrating AI capabilities to legacy applications."
      }
    ],
    color: "accent"
  },
  "data-intelligence": {
    id: "data-intelligence",
    title: "Data Intelligence",
    description: "Transform raw data into actionable insights through advanced analytics, visualization, and predictive modeling.",
    longDescription: [
      "Our data intelligence services help you unlock the full potential of your data assets, turning raw information into strategic insights and competitive advantages.",
      "Using advanced analytics, machine learning, and intuitive visualization tools, we help you discover patterns, predict trends, and make data-driven decisions with confidence."
    ],
    benefits: [
      "Improved decision-making through data-driven insights",
      "Identification of previously hidden patterns and opportunities",
      "Competitive advantage through predictive capabilities",
      "Optimized operations based on real-time analytics",
      "Enhanced customer understanding and personalization"
    ],
    features: [
      {
        title: "Advanced Analytics",
        description: "Sophisticated statistical analysis to uncover meaningful patterns and relationships in your data.",
        icon: <div className="w-12 h-12 rounded-lg bg-highlight/20 flex items-center justify-center"><svg className="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
      },
      {
        title: "Predictive Modeling",
        description: "AI-powered forecasting to anticipate future trends and outcomes with high accuracy.",
        icon: <div className="w-12 h-12 rounded-lg bg-highlight/20 flex items-center justify-center"><svg className="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg></div>
      },
      {
        title: "Interactive Dashboards",
        description: "Custom visualization tools that make complex data accessible and actionable.",
        icon: <div className="w-12 h-12 rounded-lg bg-highlight/20 flex items-center justify-center"><svg className="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg></div>
      },
      {
        title: "Data Integration",
        description: "Unify data from disparate sources to create a comprehensive view of your business.",
        icon: <div className="w-12 h-12 rounded-lg bg-highlight/20 flex items-center justify-center"><svg className="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg></div>
      }
    ],
    process: [
      {
        step: 1,
        title: "Data Assessment",
        description: "We evaluate your existing data assets, identify gaps, and determine the optimal approach to meet your objectives."
      },
      {
        step: 2,
        title: "Data Engineering",
        description: "Our team builds a robust data pipeline that cleanses, integrates, and prepares your data for analysis."
      },
      {
        step: 3,
        title: "Analysis & Modeling",
        description: "We apply advanced analytics and develop predictive models tailored to your specific business questions."
      },
      {
        step: 4,
        title: "Visualization & Deployment",
        description: "We create intuitive dashboards and embed analytical capabilities into your business processes."
      }
    ],
    cta: {
      title: "Unlock the Power of Your Data",
      description: "Ready to transform your data into a strategic asset? Our data scientists are ready to help you extract maximum value from your information.",
      buttonText: "Request a Data Assessment"
    },
    faqs: [
      {
        question: "What types of data can you work with?",
        answer: "We can work with virtually any type of structured or unstructured data, including transaction records, customer information, operational logs, text documents, images, and sensor data."
      },
      {
        question: "How do you ensure data privacy and compliance?",
        answer: "We implement comprehensive data governance practices that ensure compliance with relevant regulations such as GDPR, CCPA, and HIPAA. This includes data anonymization, secure handling procedures, and transparent data processing protocols."
      },
      {
        question: "Do we need a large volume of data to benefit from your services?",
        answer: "Not necessarily. While more data can improve model accuracy, we can often extract valuable insights from smaller datasets using appropriate analytical techniques. We'll assess your data during our initial consultation and provide honest recommendations."
      }
    ],
    color: "highlight"
  },
  "ai-strategy-consulting": {
    id: "ai-strategy-consulting",
    title: "AI Strategy Consulting",
    description: "Develop a comprehensive AI roadmap tailored to your business goals, technical infrastructure, and market positioning.",
    longDescription: [
      "Our AI strategy consulting helps your organization chart a clear path to AI adoption and implementation that aligns with your business objectives and capabilities.",
      "We work with your leadership team to identify the most promising AI opportunities, prioritize initiatives, and create a realistic roadmap that maximizes ROI while minimizing risks."
    ],
    benefits: [
      "Clear vision and roadmap for AI implementation",
      "Prioritized opportunities based on impact and feasibility",
      "Reduced risk through strategic planning and expertise",
      "Alignment of technical capabilities with business objectives",
      "Competitive positioning in an AI-driven marketplace"
    ],
    features: [
      {
        title: "AI Opportunity Assessment",
        description: "Comprehensive evaluation of your business to identify the most promising AI applications.",
        icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center"><svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg></div>
      },
      {
        title: "Technology Roadmapping",
        description: "Strategic planning for AI implementation, including technologies, timeline, and resource requirements.",
        icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center"><svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg></div>
      },
      {
        title: "Cost-Benefit Analysis",
        description: "Detailed evaluation of potential AI initiatives to identify those with the highest ROI.",
        icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center"><svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
      },
      {
        title: "Organizational Readiness",
        description: "Assessment and recommendations to prepare your organization for successful AI adoption.",
        icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center"><svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>
      }
    ],
    process: [
      {
        step: 1,
        title: "Discovery & Assessment",
        description: "We conduct a thorough assessment of your business objectives, technical capabilities, and industry landscape."
      },
      {
        step: 2,
        title: "Opportunity Identification",
        description: "Our experts identify and prioritize AI opportunities based on impact, feasibility, and alignment with your goals."
      },
      {
        step: 3,
        title: "Strategy Development",
        description: "We create a comprehensive AI strategy and roadmap with clear initiatives, timelines, and resource requirements."
      },
      {
        step: 4,
        title: "Implementation Planning",
        description: "Detailed planning for successful execution, including technology selection, team structure, and change management."
      }
    ],
    cta: {
      title: "Chart Your AI Future",
      description: "Ready to develop a strategic approach to AI that drives real business value? Our consultants are ready to guide your journey.",
      buttonText: "Book a Strategy Session"
    },
    faqs: [
      {
        question: "Do we need in-house AI expertise to work with you?",
        answer: "No, we work with organizations at all levels of AI maturity. Our consulting process includes assessing your current capabilities and providing recommendations for building or supplementing your team as needed."
      },
      {
        question: "How do you ensure our AI strategy aligns with our business goals?",
        answer: "We begin our process by deeply understanding your business objectives and constraints. Every recommendation we make is evaluated against its potential to advance your specific goals and generate measurable ROI."
      },
      {
        question: "What if we're not sure AI is right for our business?",
        answer: "Our objective assessment will honestly evaluate whether and how AI can benefit your specific situation. We'll only recommend AI initiatives that offer clear value, and we'll be transparent if we believe certain applications aren't right for your business."
      }
    ],
    color: "accent"
  },
  "ai-security-ethics": {
    id: "ai-security-ethics",
    title: "AI Security & Ethics",
    description: "Ensure your AI implementations are secure, compliant with regulations, and aligned with ethical business practices.",
    longDescription: [
      "Our AI security and ethics services help you implement AI technologies responsibly, with robust safeguards against security vulnerabilities, bias, and compliance risks.",
      "We work with your team to establish governance frameworks, implement security best practices, and ensure your AI systems operate transparently and ethically while delivering business value."
    ],
    benefits: [
      "Reduced risk of security breaches and vulnerabilities",
      "Compliance with evolving AI regulations and standards",
      "Protection against reputational damage from biased or unethical AI",
      "Increased stakeholder trust through responsible AI practices",
      "Future-proofing against emerging ethical and regulatory requirements"
    ],
    features: [
      {
        title: "AI Risk Assessment",
        description: "Comprehensive evaluation of your AI systems for security vulnerabilities, bias, and ethical concerns.",
        icon: <div className="w-12 h-12 rounded-lg bg-highlight/20 flex items-center justify-center"><svg className="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
      },
      {
        title: "Security Implementation",
        description: "Development and implementation of robust security measures to protect your AI systems and data.",
        icon: <div className="w-12 h-12 rounded-lg bg-highlight/20 flex items-center justify-center"><svg className="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
      },
      {
        title: "Ethical Frameworks",
        description: "Development of governance structures and guidelines for responsible AI deployment.",
        icon: <div className="w-12 h-12 rounded-lg bg-highlight/20 flex items-center justify-center"><svg className="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>
      },
      {
        title: "Compliance Monitoring",
        description: "Ongoing assessment and adjustment to ensure alignment with evolving regulations and standards.",
        icon: <div className="w-12 h-12 rounded-lg bg-highlight/20 flex items-center justify-center"><svg className="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg></div>
      }
    ],
    process: [
      {
        step: 1,
        title: "Risk Assessment",
        description: "We evaluate your current or planned AI systems for security vulnerabilities, bias, and ethical concerns."
      },
      {
        step: 2,
        title: "Framework Development",
        description: "Our team creates customized governance frameworks and security protocols for your specific AI applications."
      },
      {
        step: 3,
        title: "Implementation",
        description: "We help you deploy security measures, bias mitigation techniques, and governance processes."
      },
      {
        step: 4,
        title: "Monitoring & Evolution",
        description: "Ongoing support to monitor compliance, address emerging risks, and adapt to evolving standards."
      }
    ],
    cta: {
      title: "Build Trust Through Responsible AI",
      description: "Ready to ensure your AI implementations are secure, ethical, and compliant? Our specialists can help you establish the necessary safeguards.",
      buttonText: "Schedule a Security Review"
    },
    faqs: [
      {
        question: "How do you address algorithmic bias in AI systems?",
        answer: "We implement a multi-faceted approach that includes diverse training data, bias detection algorithms, regular auditing, and transparent documentation of model limitations. Our methodology is designed to identify and mitigate bias throughout the AI lifecycle."
      },
      {
        question: "What regulations should we be concerned about for our AI implementations?",
        answer: "The regulatory landscape for AI is evolving rapidly. Depending on your industry and location, you may need to comply with general data protection regulations (like GDPR), sector-specific regulations, and emerging AI-specific frameworks. We help you navigate this complex landscape."
      },
      {
        question: "How can we ensure our AI systems remain secure after deployment?",
        answer: "We help you implement a comprehensive security program that includes regular vulnerability assessments, monitoring for unusual behavior, secure update processes, and incident response plans specifically designed for AI systems."
      }
    ],
    color: "highlight"
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

  // Helper function to scroll to section with an ID
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
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
        <section className="py-24 relative">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="flex flex-col-reverse md:flex-row md:items-center gap-12">
              <motion.div 
                className="md:w-1/2"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <Link href="/" className="inline-flex items-center text-sm text-white/60 hover:text-white mb-6 transition-colors">
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
                  <Button 
                    className={`${
                      service.color === "accent" ? "bg-accent hover:bg-accent/90" : "bg-highlight hover:bg-highlight/90"
                    } text-white`}
                    onClick={() => scrollToSection("contact")}
                  >
                    {service.cta.buttonText}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => scrollToSection("features")}
                  >
                    Explore Features
                  </Button>
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
                  <div className={`text-9xl ${
                    service.color === "accent" ? "text-accent/30" : "text-highlight/30"
                  } absolute inset-0 flex items-center justify-center`}>
                    {service.features[0].icon}
                  </div>
                  <div className="relative z-10 text-center">
                    <h3 className="text-2xl font-space font-bold mb-4">{service.title}</h3>
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
              <span className="font-inter text-sm uppercase tracking-widest text-accent mb-3 inline-block">
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
                    <h3 className="text-xl font-space font-bold mb-2">{feature.title}</h3>
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
              <span className="font-inter text-sm uppercase tracking-widest text-accent mb-3 inline-block">
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
                  <h3 className="text-xl font-space font-bold mb-2">{step.title}</h3>
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
              <span className="font-inter text-sm uppercase tracking-widest text-accent mb-3 inline-block">
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
                  <h3 className="text-xl font-space font-bold mb-2">{faq.question}</h3>
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
                onClick={() => setLocation("/contact")}
              >
                {service.cta.buttonText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        
        {/* Back to top button */}
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            size="icon"
            variant="outline"
            className="rounded-full bg-secondary/50 backdrop-blur-sm border-white/10 text-white hover:bg-secondary/80"
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