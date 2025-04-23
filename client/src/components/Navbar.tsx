import { useState, useEffect } from "react";
import Logo from "./ui/logo";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onServicesClick: () => void;
  onAISolutionsClick: () => void;
  onWorkflowClick: () => void;
  onCaseStudiesClick: () => void;
  onAboutClick: () => void;
  onContactClick: () => void;
}

const Navbar = ({
  onServicesClick,
  onAISolutionsClick,
  onWorkflowClick,
  onCaseStudiesClick,
  onAboutClick,
  onContactClick
}: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleNavClick = (callback: () => void) => {
    closeMobileMenu();
    callback();
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-primary/90 backdrop-blur-md" : "glass"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between py-3 md:py-4">
          <div className="w-auto mr-4">
            <Logo />
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => handleNavClick(onServicesClick)} 
              className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide"
            >
              Services
            </button>
            <button 
              onClick={() => handleNavClick(onAISolutionsClick)} 
              className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide"
            >
              AI Solutions
            </button>
            <button 
              onClick={() => handleNavClick(onWorkflowClick)} 
              className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide"
            >
              Workflow
            </button>
            <button 
              onClick={() => handleNavClick(onCaseStudiesClick)} 
              className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide"
            >
              Case Studies
            </button>
            <button 
              onClick={() => handleNavClick(onAboutClick)} 
              className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide"
            >
              About
            </button>
          </nav>
          
          <Button 
            onClick={() => handleNavClick(onContactClick)}
            variant="outline" 
            className="hidden md:flex bg-transparent border border-accent text-accent hover:bg-accent hover:text-primary transition-all duration-300"
          >
            Get in Touch
          </Button>
          
          <button 
            className="md:hidden text-white" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden absolute w-full left-0 top-full glass ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="container mx-auto px-6 py-8 flex flex-col space-y-5">
          <button 
            onClick={() => handleNavClick(onServicesClick)}
            className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide py-2"
          >
            Services
          </button>
          <button 
            onClick={() => handleNavClick(onAISolutionsClick)}
            className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide py-2"
          >
            AI Solutions
          </button>
          <button 
            onClick={() => handleNavClick(onWorkflowClick)}
            className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide py-2"
          >
            Workflow
          </button>
          <button 
            onClick={() => handleNavClick(onCaseStudiesClick)}
            className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide py-2"
          >
            Case Studies
          </button>
          <button 
            onClick={() => handleNavClick(onAboutClick)}
            className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide py-2"
          >
            About
          </button>
          <Button 
            onClick={() => handleNavClick(onContactClick)}
            variant="outline" 
            className="w-full bg-transparent border border-accent text-accent hover:bg-accent hover:text-primary transition-all duration-300"
          >
            Get in Touch
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
