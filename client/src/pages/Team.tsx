import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { ACCENT_COLOR, HIGHLIGHT_COLOR, PRIMARY_COLOR } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import rossAvatarImage from "@/assets/ross-avatar.png";
import tomAvatarImage from "@/assets/tom-avatar.png";
import steveAvatarImage from "@/assets/steve-avatar.png";
import davidAvatarImage from "@/assets/david-avatar.png";

// Define the team member type
interface TeamMember {
  id: number;
  name: string;
  title: string;
  shortBio: string;
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
    shortBio: "Fractional CMO and founder of Thunder Stock Marketing, helping B2B service companies craft data-driven campaigns and lean operational workflows.",
    photo: "gradient-avatar", // We'll use gradient avatars as placeholders
    social: {
      linkedin: "https://linkedin.com/in/",
    }
  },
  {
    id: 2,
    name: "Tom Miller",
    title: "Chief Product Officer",
    shortBio: "Former J.P. Morgan Executive Director turned self-taught AI expert who blends financial expertise with cutting-edge technology solutions.",
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
    shortBio: "Founder of Wurster Digital Group with 15+ years experience in performance media strategy, managing multi-million-dollar budgets, and scaling marketing teams.",
    photo: "gradient-avatar",
    social: {
      linkedin: "https://linkedin.com/in/",
    }
  },
  {
    id: 4,
    name: "David Stockdale",
    title: "Chief Technology Officer",
    shortBio: "Designs and implements custom AI architectures, ensuring technical excellence and alignment with business objectives.",
    photo: "gradient-avatar",
    social: {
      linkedin: "https://linkedin.com/in/",
      github: "https://github.com/"
    }
  }
];

// Team member avatar component
const TeamMemberAvatar: React.FC<{ index: number, name: string, memberId: number }> = ({ index, name, memberId }) => {
  // Use different background colors or gradients based on index
  const gradients = [
    `linear-gradient(135deg, ${ACCENT_COLOR}, ${HIGHLIGHT_COLOR})`,
    `linear-gradient(135deg, ${HIGHLIGHT_COLOR}, ${ACCENT_COLOR})`,
    `linear-gradient(45deg, ${ACCENT_COLOR}, ${PRIMARY_COLOR})`,
    `linear-gradient(45deg, ${HIGHLIGHT_COLOR}, ${PRIMARY_COLOR})`
  ];
  
  const backgrounds = [
    `rgba(26, 140, 183, 0.1)`, // ACCENT_COLOR with opacity
    `rgba(75, 203, 242, 0.1)`, // HIGHLIGHT_COLOR with opacity
    `rgba(10, 58, 90, 0.1)`,   // PRIMARY_COLOR with opacity
    `rgba(0, 35, 72, 0.1)`     // SECONDARY_COLOR with opacity
  ];

  // Ross Stockdale (id: 1), Tom Miller (id: 2), and Steve Wurster (id: 3) get custom images
  if (memberId === 1) {
    return (
      <div 
        className="w-full aspect-square rounded-2xl mb-4 flex items-center justify-center overflow-hidden relative"
        style={{ background: backgrounds[index % backgrounds.length] }}
      >
        <img 
          src={rossAvatarImage} 
          alt={name}
          className="w-full h-full object-contain p-2"
        />
      </div>
    );
  }
  
  // Tom Miller gets his custom image
  if (memberId === 2) {
    return (
      <div 
        className="w-full aspect-square rounded-2xl mb-4 flex items-center justify-center overflow-hidden relative"
        style={{ background: backgrounds[index % backgrounds.length] }}
      >
        <img 
          src={tomAvatarImage} 
          alt={name}
          className="w-full h-full object-contain p-2"
        />
      </div>
    );
  }
  
  // Steve Wurster gets his custom image
  if (memberId === 3) {
    return (
      <div 
        className="w-full aspect-square rounded-2xl mb-4 flex items-center justify-center overflow-hidden relative"
        style={{ background: backgrounds[index % backgrounds.length] }}
      >
        <img 
          src={steveAvatarImage} 
          alt={name}
          className="w-full h-full object-contain p-2"
        />
      </div>
    );
  }
  
  // David Stockdale gets his custom image
  if (memberId === 4) {
    return (
      <div 
        className="w-full aspect-square rounded-2xl mb-4 flex items-center justify-center overflow-hidden relative"
        style={{ background: backgrounds[index % backgrounds.length] }}
      >
        <img 
          src={davidAvatarImage} 
          alt={name}
          className="w-full h-full object-contain p-2"
        />
      </div>
    );
  }
  
  // Others get gradient avatars with their initials
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
      className="glass rounded-xl p-6 h-full flex flex-col group relative"
      variants={fadeIn}
      custom={index * 0.1}
    >
      <Link href={`/team/${member.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View profile of {member.name}</span>
      </Link>
      
      <TeamMemberAvatar index={index} name={member.name} memberId={member.id} />
      
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-xl font-space font-bold">{member.name}</h3>
        <ArrowRight className="h-5 w-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <p className="text-accent font-inter text-sm mb-4">{member.title}</p>
      
      <p className="text-white/70 font-inter text-sm mb-6 flex-grow">{member.shortBio}</p>
      
      {member.social && (
        <div className="flex gap-3 relative z-20">
          {member.social.linkedin && (
            <a 
              href={member.social.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent/40 transition-all"
              onClick={(e) => e.stopPropagation()}
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
              onClick={(e) => e.stopPropagation()}
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
              onClick={(e) => e.stopPropagation()}
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
        
        <main className="pt-40 pb-24">
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