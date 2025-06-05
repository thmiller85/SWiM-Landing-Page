import React from "react";
import { useLocation, Link } from "wouter";
import Logo from "./ui/logo";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { useNavigation } from "../context/NavigationContext";

interface FooterProps {
  onServicesClick: () => void;
  onAboutClick: () => void;
  onContactClick: () => void;
}

const Footer = ({ onServicesClick, onAboutClick, onContactClick }: FooterProps) => {
  const { servicesRef, aboutRef, contactRef, navigateAndScroll } = useNavigation();
  
  const handleNavClick = (ref: React.RefObject<HTMLElement>) => {
    navigateAndScroll(ref);
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
              <li><Link href="/services/ai-powered-marketing" className="text-white/70 hover:text-accent transition-colors font-inter text-sm">AI-Powered Marketing</Link></li>
              <li><Link href="/services/workflow-automation" className="text-white/70 hover:text-accent transition-colors font-inter text-sm">Workflow Automation</Link></li>
              <li><Link href="/services/b2b-saas-development" className="text-white/70 hover:text-accent transition-colors font-inter text-sm">B2B SaaS Development</Link></li>
              <li><Link href="/services/data-intelligence" className="text-white/70 hover:text-accent transition-colors font-inter text-sm">Data Intelligence</Link></li>
              <li><Link href="/services/ai-strategy-consulting" className="text-white/70 hover:text-accent transition-colors font-inter text-sm">AI Strategy Consulting</Link></li>
              <li><Link href="/services/ai-security-ethics" className="text-white/70 hover:text-accent transition-colors font-inter text-sm">AI Security & Ethics</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-space font-bold mb-6">Company</h4>
            <ul className="space-y-3">
              <li><button onClick={() => handleNavClick(aboutRef)} className="text-white/70 hover:text-accent transition-colors font-inter text-sm">About Us</button></li>
              <li><button onClick={() => handleNavClick(aboutRef)} className="text-white/70 hover:text-accent transition-colors font-inter text-sm">Case Studies</button></li>
              <li><Link href="/team" className="text-white/70 hover:text-accent transition-colors font-inter text-sm">Team</Link></li>
              <li><a href="#" className="text-white/70 hover:text-accent transition-colors font-inter text-sm">Blog</a></li>
              <li><button onClick={() => handleNavClick(contactRef)} className="text-white/70 hover:text-accent transition-colors font-inter text-sm">Contact</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-space font-bold mb-6">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy-policy" className="text-white/70 hover:text-accent transition-colors font-inter text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-white/70 hover:text-accent transition-colors font-inter text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 font-inter text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} SWiM Agency. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="text-white/50 hover:text-white transition-colors font-inter text-sm">Privacy Policy</Link>
            <Link href="/terms-of-service" className="text-white/50 hover:text-white transition-colors font-inter text-sm">Terms of Service</Link>
            <a href="#" className="text-white/50 hover:text-white transition-colors font-inter text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
