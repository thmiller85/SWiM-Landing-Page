import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, Cpu, BarChart3, MessageSquare, Shield, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fadeIn, slideIn, staggerContainer } from "@/lib/animations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AISolutionsPage = () => {
  const aiSolutions = [
    {
      id: "ai-powered-marketing",
      title: "AI-Powered Marketing",
      description: "Leverage machine learning algorithms to optimize your marketing campaigns, predict customer behavior, and increase ROI.",
      icon: <BarChart3 className="w-8 h-8" />,
      capabilities: ["Predictive Analytics", "Customer Segmentation", "Campaign Optimization", "Conversion Tracking"],
      color: "accent",
      results: "Average 40% increase in conversion rates"
    },
    {
      id: "natural-language-processing",
      title: "Natural Language Processing",
      description: "Implement advanced NLP models to analyze customer feedback, generate content, and streamline communication.",
      icon: <MessageSquare className="w-8 h-8" />,
      capabilities: ["Sentiment Analysis", "Content Generation", "Chatbots", "Document Processing"],
      color: "highlight",
      results: "Up to 70% reduction in response time"
    },
    {
      id: "machine-learning-models",
      title: "Custom Machine Learning",
      description: "Build custom ML models that continuously learn from your data to improve performance and accuracy over time.",
      icon: <Brain className="w-8 h-8" />,
      capabilities: ["Predictive Modeling", "Anomaly Detection", "Recommendation Systems", "Forecasting"],
      color: "accent",
      results: "96.8% accuracy in predictions"
    },
    {
      id: "data-intelligence",
      title: "Data Intelligence",
      description: "Transform raw data into actionable insights through advanced analytics, visualization, and predictive modeling.",
      icon: <Cpu className="w-8 h-8" />,
      capabilities: ["Real-time Analytics", "Data Visualization", "Business Intelligence", "Performance Metrics"],
      color: "highlight",
      results: "68 hours saved per month"
    },
    {
      id: "ai-strategy-consulting",
      title: "AI Strategy Consulting",
      description: "Develop a comprehensive AI roadmap tailored to your business goals, technical infrastructure, and market positioning.",
      icon: <Zap className="w-8 h-8" />,
      capabilities: ["Strategic Planning", "Technology Assessment", "ROI Analysis", "Implementation Roadmap"],
      color: "accent",
      results: "Strategic clarity and execution plan"
    },
    {
      id: "ai-security-ethics",
      title: "AI Security & Ethics",
      description: "Ensure your AI implementations are secure, compliant with regulations, and aligned with ethical business practices.",
      icon: <Shield className="w-8 h-8" />,
      capabilities: ["Security Audits", "Compliance Frameworks", "Ethical Guidelines", "Risk Assessment"],
      color: "highlight",
      results: "100% compliance with regulations"
    }
  ];

  return (
    <div className="relative bg-primary min-h-screen overflow-x-hidden">
      <div className="gradient-bg">
        <Navbar 
          onServicesClick={() => window.location.href = "/#services"}
          onAISolutionsClick={() => window.location.href = "/#ai-solutions"}
          onWorkflowClick={() => window.location.href = "/#workflow"}
          onCaseStudiesClick={() => window.location.href = "/#case-studies"}
          onAboutClick={() => window.location.href = "/#about"}
          onContactClick={() => window.location.href = "/#contact"}
        />
        
        {/* Header Section */}
        <section className="pt-32 pb-16 relative">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-highlight/10 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <Link href="/">
                <Button variant="ghost" className="mb-8 text-white/70 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              
              <motion.div variants={fadeIn}>
                <span className="font-inter text-sm uppercase tracking-widest text-accent mb-3 inline-block">
                  AI Solutions Portfolio
                </span>
                <h1 className="text-4xl md:text-6xl font-space font-bold mb-6">
                  Transform Your Business with <span className="text-accent">Artificial Intelligence</span>
                </h1>
                <p className="text-white/70 font-inter text-xl max-w-3xl mx-auto">
                  Discover our comprehensive suite of AI-powered solutions designed to revolutionize 
                  your operations, enhance decision-making, and drive unprecedented growth.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* AI Solutions Grid */}
        <section className="py-16 relative">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {aiSolutions.map((solution, index) => (
                <motion.div
                  key={solution.id}
                  variants={slideIn("up")}
                  custom={index}
                  className="group"
                >
                  <Card className="bg-primary/50 border border-white/10 hover:border-accent/50 transition-all duration-300 h-full backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <div className={`w-16 h-16 rounded-xl bg-${solution.color}/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <div className={`text-${solution.color}`}>
                          {solution.icon}
                        </div>
                      </div>
                      <CardTitle className="text-white font-space text-xl mb-2">
                        {solution.title}
                      </CardTitle>
                      <CardDescription className="text-white/70 font-inter">
                        {solution.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-white/90 font-medium mb-2 text-sm">Key Capabilities:</h4>
                          <div className="flex flex-wrap gap-2">
                            {solution.capabilities.map((capability, idx) => (
                              <Badge 
                                key={idx}
                                variant="secondary" 
                                className="bg-white/10 text-white/80 border-none text-xs"
                              >
                                {capability}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className={`p-3 rounded-lg bg-${solution.color}/10 border border-${solution.color}/20`}>
                          <p className={`text-${solution.color} font-medium text-sm`}>
                            {solution.results}
                          </p>
                        </div>
                        
                        <Link href={`/services/${solution.id}`}>
                          <Button 
                            variant="ghost" 
                            className={`w-full justify-between text-${solution.color} hover:bg-${solution.color}/10 group-hover:translate-x-1 transition-all duration-300`}
                          >
                            Learn More
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-3xl md:text-5xl font-space font-bold mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-white/70 font-inter text-xl mb-8">
                Let's discuss how our AI solutions can be tailored to your specific needs and goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/#contact">
                  <Button 
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-primary font-medium px-8 py-3"
                  >
                    Start Your AI Journey
                  </Button>
                </Link>
                <Link href="/#workflow">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-accent text-accent hover:bg-accent hover:text-primary px-8 py-3"
                  >
                    View Our Process
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer 
          onServicesClick={() => window.location.href = "/#services"}
          onAboutClick={() => window.location.href = "/#about"}
          onContactClick={() => window.location.href = "/#contact"}
        />
      </div>
    </div>
  );
};

export default AISolutionsPage;