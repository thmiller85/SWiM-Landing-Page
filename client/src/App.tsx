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
import TeamMember from "./pages/TeamMember";
import ServicePage from "./pages/ServicePage";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBlogEditor from "./pages/AdminBlogEditor";
import BlogPostPreview from "./pages/BlogPostPreview";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/not-found";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NavigationProvider, useNavigation } from "./context/NavigationContext";

// Home page component
const HomePage = () => {
  const { 
    servicesRef, 
    aiSolutionsRef, 
    workflowRef, 
    caseStudiesRef, 
    aboutRef, 
    contactRef, 
    scrollToSection
  } = useNavigation();

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
        <Hero 
          onDiscoverClick={() => scrollToSection(servicesRef)}
          onContactClick={() => scrollToSection(contactRef)}
        />
        <Services ref={servicesRef} />
        <AISolutions ref={aiSolutionsRef} onContactClick={() => scrollToSection(contactRef)} />
        <Workflow ref={workflowRef} />
        <CaseStudies ref={caseStudiesRef} onContactClick={() => scrollToSection(contactRef)} />
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
    <NavigationProvider>
      <TooltipProvider>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/blog-posts/new" component={AdminBlogEditor} />
          <Route path="/admin/blog-posts/edit/:id" component={AdminBlogEditor} />
          <Route path="/admin/blog-posts/preview/:id" component={BlogPostPreview} />
          <Route path="/team" component={Team} />
          <Route path="/team/:id" component={TeamMember} />
          <Route path="/services/:id">
            {params => <ServicePage id={params.id} />}
          </Route>
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </TooltipProvider>
    </NavigationProvider>
  );
}

export default App;
