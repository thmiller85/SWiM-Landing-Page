import React, { createContext, useContext, useRef, RefObject } from 'react';
import { useLocation } from 'wouter';

interface SectionRefs {
  servicesRef: RefObject<HTMLElement>;
  aiSolutionsRef: RefObject<HTMLElement>;
  workflowRef: RefObject<HTMLElement>;
  caseStudiesRef: RefObject<HTMLElement>;
  aboutRef: RefObject<HTMLElement>;
  contactRef: RefObject<HTMLElement>;
}

interface NavigationContextType extends SectionRefs {
  scrollToSection: (ref: RefObject<HTMLElement>) => void;
  navigateAndScroll: (ref: RefObject<HTMLElement>) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const servicesRef = useRef<HTMLElement>(null);
  const aiSolutionsRef = useRef<HTMLElement>(null);
  const workflowRef = useRef<HTMLElement>(null);
  const caseStudiesRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  
  const [location, navigate] = useLocation();

  const scrollToSection = (ref: RefObject<HTMLElement>) => {
    if (ref.current) {
      const yOffset = -80; // Adjust based on navbar height
      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const navigateAndScroll = (ref: RefObject<HTMLElement>) => {
    if (location !== '/') {
      navigate('/');
      // Use a longer timeout to ensure the DOM is fully loaded
      setTimeout(() => {
        scrollToSection(ref);
      }, 500);
    } else {
      scrollToSection(ref);
    }
  };

  return (
    <NavigationContext.Provider 
      value={{ 
        servicesRef, 
        aiSolutionsRef, 
        workflowRef, 
        caseStudiesRef, 
        aboutRef, 
        contactRef, 
        scrollToSection,
        navigateAndScroll
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};