import React, { forwardRef, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, Clock } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { useToast } from "@/hooks/use-toast";

const Contact = forwardRef<HTMLElement>((props, ref) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useIntersectionObserver(titleRef, { once: false, threshold: 0.1 });
  
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formRef.current) return;
    
    // Get form data
    const formData = new FormData(formRef.current);
    const formValues = Object.fromEntries(formData.entries());
    
    try {
      // Send data to our proxy endpoint
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });
      
      if (response.ok) {
        toast({
          title: "Form submitted successfully",
          description: "We'll be in touch shortly!",
        });
        
        // Reset form
        formRef.current.reset();
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission error",
        description: "There was a problem submitting your form. Please try again.",
        variant: "destructive",
      });
    }
  };
  
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
                className="w-full bg-secondary/50 border border-white/10 rounded-lg p-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Your company name"
              />
            </div>
            <div>
              <Label htmlFor="service" className="block mb-2 text-white/80 font-inter text-sm">Service of Interest</Label>
              <Select name="service">
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
                <Checkbox id="privacy" name="privacy" className="rounded bg-secondary/50 border-white/10 text-accent focus:ring-accent" />
                <Label htmlFor="privacy" className="text-white/70 font-inter text-sm">
                  I agree to the <a href="#" className="text-accent">Privacy Policy</a>
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
        
        {/* Alternative contact methods */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactMethods.map((method, index) => (
            <motion.div 
              key={index}
              className="glass rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.6 }}
            >
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                {method.icon}
              </div>
              <h3 className="text-lg font-space font-bold mb-2">{method.title}</h3>
              <p className="text-white/70 font-inter text-sm mb-4">
                {method.description}
              </p>
              <a href={method.href} className="text-accent font-medium">{method.contact}</a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

Contact.displayName = "Contact";

export default Contact;
