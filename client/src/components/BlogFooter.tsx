import { Link } from "wouter";
import Logo from "./ui/logo";
import { Button } from "@/components/ui/button";
import { Mail, ExternalLink, ArrowUp } from "lucide-react";

const BlogFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary/95 backdrop-blur-md border-t border-white/10 mt-16">
      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Logo className="mb-4" />
            <p className="text-white/70 mb-6 max-w-md">
              Transforming businesses through AI-powered marketing automation and 
              workflow optimization solutions.
            </p>
            <Link href="/#contact">
              <Button 
                variant="outline" 
                className="bg-transparent border border-accent text-accent hover:bg-accent hover:text-primary"
              >
                <Mail className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/70 hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/70 hover:text-accent transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-white/70 hover:text-accent transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-white/70 hover:text-accent transition-colors">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#case-studies" className="text-white/70 hover:text-accent transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/#workflow" className="text-white/70 hover:text-accent transition-colors">
                  Workflow Automation
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-white/70 hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-white/70 hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <p className="text-white/60 text-sm mb-4 md:mb-0">
            © 2025 AI Marketing Solutions. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="text-white/60 hover:text-accent transition-colors p-2 rounded-full hover:bg-white/10"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BlogFooter;