import React, { forwardRef, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, Clock } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { useToast } from "@/hooks/use-toast";
import { trackConversion } from "@/lib/google-analytics";

const Contact = forwardRef<HTMLElement>((props, ref) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useIntersectionObserver(titleRef, { once: false, threshold: 0.1 });
  
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<string>("");
  const [privacyAccepted, setPrivacyAccepted] = useState<boolean>(false);
  
  const handlePrivacyChange = (checked: CheckedState) => {
    setPrivacyAccepted(checked === true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formRef.current) return;
    
    // Check if privacy policy is accepted
    if (!privacyAccepted) {
      toast({
        title: "Privacy Policy Required",
        description: "Please accept the privacy policy to continue.",
        variant: "destructive",
      });
      return;
    }
    
    // Get form data and add the selected service
    const formData = new FormData(formRef.current);
    const formValues = Object.fromEntries(formData.entries());
    
    // Add the selected service from state
    formValues.service = selectedService;
    
    try {
      console.log('Submitting form data:', formValues);
      
      // First, test if API is available
      let apiBaseUrl = '';
      try {
        const healthCheck = await fetch('/api/health');
        if (healthCheck.ok) {
          console.log('API health check passed, using relative URL');
          apiBaseUrl = '';
        } else {
          throw new Error('Health check failed');
        }
      } catch (healthError) {
        console.log('API health check failed, this might be a deployment issue');
        // In deployment, the API might be at a different path or not available
        apiBaseUrl = '';
      }
      
      // Send data to our proxy endpoint
      let response;
      try {
        response = await fetch(`${apiBaseUrl}/api/contact-form`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formValues),
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        console.log('Response URL:', response.url);
        
        // If we get a 404, it means the API route isn't available in deployment
        if (response.status === 404) {
          console.log('API endpoint not found, falling back to direct webhook submission');
          throw new Error('API_NOT_FOUND');
        }
      } catch (error) {
        console.log('Primary API call failed:', error);
        
        // Fallback: Submit directly to the webhook if API is not available
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        if (errorMessage === 'API_NOT_FOUND' || errorMessage.includes('Failed to fetch')) {
          console.log('Attempting direct webhook submission as fallback');
          
          response = await fetch('https://n8n.srv863333.hstgr.cloud/webhook/onSwimFormSubmit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formValues),
          });
          
          console.log('Direct webhook response status:', response.status);
        } else {
          throw error;
        }
      }
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('Success response:', responseData);
        
        // Track conversion in Google Analytics
        trackConversion('form_submit', selectedService || 'general_inquiry');
        
        toast({
          title: "Form submitted successfully",
          description: "We'll be in touch shortly!",
        });
        
        // Reset form and selected service
        formRef.current.reset();
        setSelectedService("");
        setPrivacyAccepted(false);
      } else {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // More detailed error message for debugging
      let errorMessage = "There was a problem submitting your form. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = "Unable to connect to server. Please check your internet connection.";
        } else if (error.message.includes('404')) {
          errorMessage = "Form submission endpoint not found. Please contact support.";
        } else if (error.message.includes('500')) {
          errorMessage = "Server error occurred. Please try again later.";
        }
      }
      
      toast({
        title: "Submission error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  
  // Commented out until email, phone, and calendar integration is setup
  /*
  const contactMethods = [
    {
      icon: <Mail className="text-accent" />,
      title: "Email Us",
      description: "Our team typically responds within 24 hours",
      contact: "hello@swimagency.ai",
      href: "mailto:hello@swimagency.ai"
    },
    {
      icon: <Phone className="text-accent" />,
      title: "Call Us",
      description: "Available Monday-Friday, 9am-6pm EST",
      contact: "+1 (234) 567-890",
      href: "tel:+1234567890"
    },
    {
      icon: <Clock className="text-accent" />,
      title: "Schedule Demo",
      description: "See our solutions in action with a personalized demo",
      contact: "Book a time slot",
      href: "#"
    }
  ];
  */

  return (
    <section ref={ref} id="contact" className="py-24 relative overflow-hidden bg-secondary/30">
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-highlight/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto glass rounded-2xl p-8 md:p-12">
          <div ref={titleRef} className="text-center mb-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <span className="font-inter text-sm uppercase tracking-widest text-accent mb-3 inline-block">
                Get Started
              </span>
              <h2 className="text-3xl md:text-5xl font-space font-bold mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-white/70 font-inter text-lg max-w-2xl mx-auto">
                Schedule a consultation with our AI specialists to discuss how we can help
                you leverage AI for sustainable business growth.
              </p>
            </motion.div>
          </div>
          
          <motion.form 
            ref={formRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={handleSubmit}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div>
              <Label htmlFor="name" className="block mb-2 text-white/80 font-inter text-sm">Full Name</Label>
              <Input 
                type="text" 
                id="name" 
                name="name"
                autoComplete="name"
                className="w-full bg-secondary/50 border border-white/10 rounded-lg p-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="block mb-2 text-white/80 font-inter text-sm">Email Address</Label>
              <Input 
                type="email" 
                id="email" 
                name="email"
                autoComplete="email"
                className="w-full bg-secondary/50 border border-white/10 rounded-lg p-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="your.email@company.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="company" className="block mb-2 text-white/80 font-inter text-sm">Company</Label>
              <Input 
                type="text" 
                id="company" 
                name="company"
                autoComplete="organization"
                className="w-full bg-secondary/50 border border-white/10 rounded-lg p-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Your company name"
              />
            </div>
            <div>
              <Label htmlFor="service" className="block mb-2 text-white/80 font-inter text-sm">Service of Interest</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="w-full bg-secondary/50 border border-white/10 rounded-lg p-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai-marketing">AI-Powered Marketing</SelectItem>
                  <SelectItem value="workflow">Workflow Automation</SelectItem>
                  <SelectItem value="saas">B2B SaaS Development</SelectItem>
                  <SelectItem value="data">Data Intelligence</SelectItem>
                  <SelectItem value="consulting">AI Strategy Consulting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="message" className="block mb-2 text-white/80 font-inter text-sm">Your Message</Label>
              <Textarea 
                id="message" 
                name="message"
                rows={4} 
                className="w-full bg-secondary/50 border border-white/10 rounded-lg p-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Tell us about your project or requirements..."
                required
              />
            </div>
            <div className="md:col-span-2 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="privacy" 
                  name="privacy" 
                  checked={privacyAccepted}
                  onCheckedChange={handlePrivacyChange}
                  className="rounded bg-secondary/50 border-white/10 text-accent focus:ring-accent" 
                />
                <Label htmlFor="privacy" className="text-white/70 font-inter text-sm">
                  I agree to the <a href="/privacy-policy" className="text-accent hover:text-accent/80 underline">Privacy Policy</a>*
                </Label>
              </div>
              <Button 
                type="submit" 
                className="bg-accent hover:bg-accent/90 text-black font-inter font-semibold text-lg px-8 py-6 shadow-glow transition-all w-full sm:w-auto"
                style={{ 
                  textShadow: "0 0 5px rgba(0,240,255,0.3)",
                  boxShadow: "0 0 20px rgba(0,240,255,0.5)"
                }}
              >
                Schedule Consultation
              </Button>
            </div>
          </motion.form>
        </div>
        
        {/* Alternative contact methods removed until email, phone, and calendar integration is setup */}
      </div>
    </section>
  );
});

Contact.displayName = "Contact";

export default Contact;
