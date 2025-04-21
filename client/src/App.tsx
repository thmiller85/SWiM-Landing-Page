import { useRef } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import AISolutions from "./components/AISolutions";
import Workflow from "./components/Workflow";
import CaseStudies from "./components/CaseStudies";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  const servicesRef = useRef<HTMLElement>(null);
  const aiSolutionsRef = useRef<HTMLElement>(null);
  const workflowRef = useRef<HTMLElement>(null);
  const caseStudiesRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const scrollToSection = (sectionRef: React.RefObject<HTMLElement>) => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <TooltipProvider>
      <div className="relative bg-primary min-h-screen overflow-x-hidden">
        <div className="gradient-bg">
          <Navbar 
            onServicesClick={() => scrollToSection(servicesRef)}
            onAISolutionsClick={() => scrollToSection(aiSolutionsRef)}
            onWorkflowClick={() => scrollToSection(workflowRef)}
            onCaseStudiesClick={() => scrollToSection(caseStudiesRef)}
            onAboutClick={() => scrollToSection(aboutRef)}
            onContactClick={() => scrollToSection(contactRef)}
          />
          <Hero onDiscoverClick={() => scrollToSection(servicesRef)} />
          <Services ref={servicesRef} />
          <AISolutions ref={aiSolutionsRef} />
          <Workflow ref={workflowRef} />
          <CaseStudies ref={caseStudiesRef} />
          <About ref={aboutRef} />
          <Contact ref={contactRef} />
          <Footer 
            onServicesClick={() => scrollToSection(servicesRef)}
            onAboutClick={() => scrollToSection(aboutRef)}
            onContactClick={() => scrollToSection(contactRef)}
          />
          <Toaster />
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;
