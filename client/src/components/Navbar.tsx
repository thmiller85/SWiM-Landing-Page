import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import Logo from "./ui/logo";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useNavigation } from "../context/NavigationContext";

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
  const { servicesRef, aiSolutionsRef, workflowRef, caseStudiesRef, aboutRef, contactRef, navigateAndScroll } = useNavigation();

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

  const handleNavClick = (ref: React.RefObject<HTMLElement>) => {
    closeMobileMenu();
    navigateAndScroll(ref);
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
              onClick={() => handleNavClick(servicesRef)} 
              className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide"
            >
              Services
            </button>
            <button 
              onClick={() => handleNavClick(aiSolutionsRef)} 
              className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide"
            >
              AI Solutions
            </button>
            <button 
              onClick={() => handleNavClick(workflowRef)} 
              className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide"
            >
              Workflow
            </button>
            <button 
              onClick={() => handleNavClick(caseStudiesRef)} 
              className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide"
            >
              Case Studies
            </button>
            <Link href="/blog">
              <button 
                onClick={closeMobileMenu}
                className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide"
              >
                Blog
              </button>
            </Link>
            <button 
              onClick={() => handleNavClick(aboutRef)} 
              className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide"
            >
              About
            </button>
          </nav>
          
          <Button 
            onClick={() => handleNavClick(contactRef)}
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
      <div className={`md:hidden absolute w-full left-0 top-full bg-primary/95 backdrop-blur-md border-b border-accent/20 ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="container mx-auto px-6 py-8 flex flex-col space-y-5">
          <button 
            onClick={() => handleNavClick(servicesRef)}
            className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide py-2"
          >
            Services
          </button>
          <button 
            onClick={() => handleNavClick(aiSolutionsRef)}
            className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide py-2"
          >
            AI Solutions
          </button>
          <button 
            onClick={() => handleNavClick(workflowRef)}
            className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide py-2"
          >
            Workflow
          </button>
          <button 
            onClick={() => handleNavClick(caseStudiesRef)}
            className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide py-2"
          >
            Case Studies
          </button>
          <Link href="/blog" className="block w-full text-center">
            <button 
              onClick={closeMobileMenu}
              className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide py-2 w-full"
            >
              Blog
            </button>
          </Link>
          <button 
            onClick={() => handleNavClick(aboutRef)}
            className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide py-2"
          >
            About
          </button>
          <Button 
            onClick={() => handleNavClick(contactRef)}
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
