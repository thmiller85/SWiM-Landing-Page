import { useRef } from "react";
import { Route, Switch } from "wouter";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import AISolutions from "./components/AISolutions";
import Workflow from "./components/Workflow";
import CaseStudies from "./components/CaseStudies";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Team from "./pages/Team";
import NotFound from "./pages/not-found";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Home page component
const HomePage = () => {
  const servicesRef = useRef<HTMLElement>(null);
  const aiSolutionsRef = useRef<HTMLElement>(null);
  const workflowRef = useRef<HTMLElement>(null);
  const caseStudiesRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const scrollToSection = (sectionRef: React.RefObject<HTMLElement>) => {
    if (sectionRef.current) {
      const yOffset = -80; // Adjust this value based on your navbar height
      const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
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
      </div>
    </div>
  );
};

function App() {
  return (
    <TooltipProvider>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/team" component={Team} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
