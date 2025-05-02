import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { ACCENT_COLOR, HIGHLIGHT_COLOR, PRIMARY_COLOR } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Define the team member type
interface TeamMember {
  id: number;
  name: string;
  title: string;
  bio: string;
  photo: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

// Team members data
const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Ross Stockdale",
    title: "Chief Marketing Officer",
    bio: "Leads marketing strategy and brand development, leveraging AI tools to optimize customer acquisition and engagement across all channels.",
    photo: "gradient-avatar", // We'll use gradient avatars as placeholders
    social: {
      linkedin: "https://linkedin.com/in/",
    }
  },
  {
    id: 2,
    name: "Tom Miller",
    title: "Chief Product Officer",
    bio: "Drives product vision and implementation, ensuring our AI solutions address real customer needs and deliver measurable value.",
    photo: "gradient-avatar",
    social: {
      linkedin: "https://linkedin.com/in/",
      twitter: "https://twitter.com/"
    }
  },
  {
    id: 3,
    name: "Steve Wurster",
    title: "Chief Growth Officer",
    bio: "Focuses on strategic partnerships and business development, identifying new markets and opportunities for AI-powered solutions.",
    photo: "gradient-avatar",
    social: {
      linkedin: "https://linkedin.com/in/",
    }
  },
  {
    id: 4,
    name: "David Stockdale",
    title: "AI Solutions Architect",
    bio: "Designs and implements custom AI architectures, ensuring technical excellence and alignment with business objectives.",
    photo: "gradient-avatar",
    social: {
      linkedin: "https://linkedin.com/in/",
      github: "https://github.com/"
    }
  }
];

// Avatar component with gradient background
const GradientAvatar: React.FC<{ index: number, name: string }> = ({ index, name }) => {
  // Use different gradient colors based on index
  const gradients = [
    `linear-gradient(135deg, ${ACCENT_COLOR}, ${HIGHLIGHT_COLOR})`,
    `linear-gradient(135deg, ${HIGHLIGHT_COLOR}, ${ACCENT_COLOR})`,
    `linear-gradient(45deg, ${ACCENT_COLOR}, ${PRIMARY_COLOR})`,
    `linear-gradient(45deg, ${HIGHLIGHT_COLOR}, ${PRIMARY_COLOR})`
  ];

  return (
    <div 
      className="w-full aspect-square rounded-2xl mb-4 flex items-center justify-center overflow-hidden"
      style={{ background: gradients[index % gradients.length] }}
    >
      <span className="text-6xl text-white font-bold opacity-30">
        {name.charAt(0)}
      </span>
    </div>
  );
};

// Team member card component
const TeamMemberCard: React.FC<{ member: TeamMember, index: number }> = ({ member, index }) => {
  return (
    <motion.div 
      className="glass rounded-xl p-6 h-full flex flex-col"
      variants={fadeIn}
      custom={index * 0.1}
    >
      <GradientAvatar index={index} name={member.name} />
      
      <h3 className="text-xl font-space font-bold mb-1">{member.name}</h3>
      <p className="text-accent font-inter text-sm mb-4">{member.title}</p>
      
      <p className="text-white/70 font-inter text-sm mb-6 flex-grow">{member.bio}</p>
      
      {member.social && (
        <div className="flex gap-3">
          {member.social.linkedin && (
            <a 
              href={member.social.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent/40 transition-all"
            >
              <Linkedin className="w-4 h-4 text-white" />
            </a>
          )}
          {member.social.twitter && (
            <a 
              href={member.social.twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent/40 transition-all"
            >
              <Twitter className="w-4 h-4 text-white" />
            </a>
          )}
          {member.social.github && (
            <a 
              href={member.social.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent/40 transition-all"
            >
              <Github className="w-4 h-4 text-white" />
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
};

const Team: React.FC = () => {
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative bg-primary min-h-screen overflow-x-hidden">
      <div className="gradient-bg">
        <Navbar 
          onServicesClick={() => {}}
          onAISolutionsClick={() => {}}
          onWorkflowClick={() => {}}
          onCaseStudiesClick={() => {}}
          onAboutClick={() => {}}
          onContactClick={() => {}}
        />
        
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-6 md:px-12">
            <Link href="/">
              <Button 
                variant="ghost" 
                className="mb-8 text-white/70 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="mb-16"
            >
              <motion.span 
                variants={fadeIn}
                className="font-inter text-sm uppercase tracking-widest text-accent mb-3 inline-block"
              >
                Our team
              </motion.span>
              <motion.h1 
                variants={fadeIn}
                className="text-4xl md:text-6xl font-space font-bold mb-6"
              >
                Meet the SWiM Team
              </motion.h1>
              <motion.p 
                variants={fadeIn}
                className="text-white/70 font-inter text-lg max-w-3xl"
              >
                Our team brings together diverse expertise in AI, marketing, sales, and business strategy to deliver solutions that transform how businesses operate and engage with customers.
              </motion.p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {teamMembers.map((member, index) => (
                <TeamMemberCard 
                  key={member.id} 
                  member={member} 
                  index={index}
                />
              ))}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-20 glass p-8 rounded-xl text-center"
            >
              <h2 className="text-2xl font-space font-bold mb-4">Join Our Team</h2>
              <p className="text-white/70 font-inter mb-6">
                We're always looking for talented individuals who are passionate about AI and marketing technology.
              </p>
              <Link href="/contact">
                <Button 
                  variant="outline"
                  className="bg-transparent border border-accent text-accent hover:bg-accent hover:text-primary transition-all duration-300"
                >
                  Get in Touch
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>
        
        <Footer 
          onServicesClick={() => {}}
          onAboutClick={() => {}}
          onContactClick={() => {}}
        />
      </div>
    </div>
  );
};

export default Team;