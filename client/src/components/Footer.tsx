import React from "react";
import { useLocation } from "wouter";
import Logo from "./ui/logo";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { scrollToSection } from "../App";

interface FooterProps {
  onServicesClick: () => void;
  onAboutClick: () => void;
  onContactClick: () => void;
}

const Footer = ({ onServicesClick, onAboutClick, onContactClick }: FooterProps) => {
  const [location, navigate] = useLocation();
  
  const handleNavClick = (callback: () => void) => {
    // If we're not on the homepage, navigate there first, then scroll
    if (location !== '/') {
      // Navigate to homepage
      navigate('/');
      
      // Use a longer timeout to ensure DOM is fully loaded before scrolling
      setTimeout(() => {
        callback();
      }, 300); // Increased timeout for better reliability
    } else {
      // Already on homepage, just scroll
      callback();
    }
  };
  return (
    <footer className="py-12 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <Logo className="mb-6" />
            <p className="text-white/70 font-inter text-sm mb-6">
              Transforming businesses with AI-powered marketing, workflow automation, and custom SaaS solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-accent transition-colors">
                <Facebook />
              </a>
              <a href="#" className="text-white/60 hover:text-accent transition-colors">
                <Twitter />
              </a>
              <a href="#" className="text-white/60 hover:text-accent transition-colors">
                <Linkedin />
              </a>
              <a href="#" className="text-white/60 hover:text-accent transition-colors">
                <Instagram />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-space font-bold mb-6">Services</h4>
            <ul className="space-y-3">
              <li><button onClick={() => handleNavClick(onServicesClick)} className="text-white/70 hover:text-accent transition-colors font-inter text-sm">AI-Powered Marketing</button></li>
              <li><button onClick={() => handleNavClick(onServicesClick)} className="text-white/70 hover:text-accent transition-colors font-inter text-sm">Workflow Automation</button></li>
              <li><button onClick={() => handleNavClick(onServicesClick)} className="text-white/70 hover:text-accent transition-colors font-inter text-sm">B2B SaaS Development</button></li>
              <li><button onClick={() => handleNavClick(onServicesClick)} className="text-white/70 hover:text-accent transition-colors font-inter text-sm">Data Intelligence</button></li>
              <li><button onClick={() => handleNavClick(onServicesClick)} className="text-white/70 hover:text-accent transition-colors font-inter text-sm">AI Strategy Consulting</button></li>
              <li><button onClick={() => handleNavClick(onServicesClick)} className="text-white/70 hover:text-accent transition-colors font-inter text-sm">AI Security & Ethics</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-space font-bold mb-6">Company</h4>
            <ul className="space-y-3">
              <li><button onClick={() => handleNavClick(onAboutClick)} className="text-white/70 hover:text-accent transition-colors font-inter text-sm">About Us</button></li>
              <li><button onClick={() => handleNavClick(onAboutClick)} className="text-white/70 hover:text-accent transition-colors font-inter text-sm">Case Studies</button></li>
              <li><button onClick={() => handleNavClick(onAboutClick)} className="text-white/70 hover:text-accent transition-colors font-inter text-sm">Team</button></li>
              <li><a href="#" className="text-white/70 hover:text-accent transition-colors font-inter text-sm">Careers</a></li>
              <li><a href="#" className="text-white/70 hover:text-accent transition-colors font-inter text-sm">Blog</a></li>
              <li><button onClick={() => handleNavClick(onContactClick)} className="text-white/70 hover:text-accent transition-colors font-inter text-sm">Contact</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-space font-bold mb-6">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/70 hover:text-accent transition-colors font-inter text-sm">Documentation</a></li>
              <li><a href="#" className="text-white/70 hover:text-accent transition-colors font-inter text-sm">AI Knowledge Base</a></li>
              <li><a href="#" className="text-white/70 hover:text-accent transition-colors font-inter text-sm">API Reference</a></li>
              <li><a href="#" className="text-white/70 hover:text-accent transition-colors font-inter text-sm">Support Center</a></li>
              <li><a href="#" className="text-white/70 hover:text-accent transition-colors font-inter text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-white/70 hover:text-accent transition-colors font-inter text-sm">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 font-inter text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} SWiM Agency. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-white/50 hover:text-white transition-colors font-inter text-sm">Privacy Policy</a>
            <a href="#" className="text-white/50 hover:text-white transition-colors font-inter text-sm">Terms of Service</a>
            <a href="#" className="text-white/50 hover:text-white transition-colors font-inter text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
