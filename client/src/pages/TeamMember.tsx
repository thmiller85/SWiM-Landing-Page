import React, { useEffect } from "react";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { ACCENT_COLOR, DARK_NAVY, HIGHLIGHT_COLOR, PRIMARY_COLOR } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import teamMemberImage from "@/assets/team-member.png";

// Extended team member type with detailed bio information
interface TeamMemberDetailed {
  id: number;
  name: string;
  title: string;
  shortBio: string;
  detailedBio: string[];
  expertise: string[];
  photo: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

// Team members data
const teamMembers: TeamMemberDetailed[] = [
  {
    id: 1,
    name: "Ross Stockdale",
    title: "Chief Marketing Officer",
    shortBio: "Leads marketing strategy and brand development, leveraging AI tools to optimize customer acquisition and engagement across all channels.",
    detailedBio: [
      "Ross brings over 15 years of experience in marketing leadership roles, with expertise in developing and implementing comprehensive marketing strategies for technology companies.",
      "His approach to marketing focuses on data-driven decision making, customer-centric messaging, and innovative campaign development that drives measurable business results.",
      "At SWiM, Ross leads all marketing initiatives, from brand strategy and content development to demand generation and marketing analytics."
    ],
    expertise: [
      "Digital Marketing Strategy",
      "Brand Development",
      "Marketing Analytics",
      "Content Strategy",
      "Customer Acquisition"
    ],
    photo: "gradient-avatar",
    social: {
      linkedin: "https://linkedin.com/in/",
    }
  },
  {
    id: 2,
    name: "Tom Miller",
    title: "Chief Product Officer",
    shortBio: "Drives product vision and implementation, ensuring our AI solutions address real customer needs and deliver measurable value.",
    detailedBio: [
      "Tom has dedicated his career to building innovative products that solve complex business problems. With a background in both software development and business strategy, he brings a unique perspective to product management.",
      "His experience includes leading product teams at several successful technology companies, where he developed AI-powered solutions for various industries.",
      "At SWiM, Tom oversees the entire product lifecycle, from concept and design to development and launch, ensuring that our solutions deliver exceptional user experiences and business outcomes."
    ],
    expertise: [
      "Product Strategy",
      "AI Solution Design",
      "User Experience",
      "Product Management",
      "Agile Methodologies"
    ],
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
    shortBio: "Focuses on strategic partnerships and business development, identifying new markets and opportunities for AI-powered solutions.",
    detailedBio: [
      "Steve is a seasoned business development executive with a proven track record of driving growth through strategic partnerships and market expansion.",
      "His expertise in identifying and capitalizing on emerging market trends has helped numerous companies achieve significant revenue growth and market penetration.",
      "At SWiM, Steve leads our growth initiatives, focusing on building relationships with key stakeholders, identifying new business opportunities, and developing strategies to scale our solutions across different industries and markets."
    ],
    expertise: [
      "Business Development",
      "Strategic Partnerships",
      "Market Expansion",
      "Revenue Growth",
      "Sales Leadership"
    ],
    photo: "gradient-avatar",
    social: {
      linkedin: "https://linkedin.com/in/",
    }
  },
  {
    id: 4,
    name: "David Stockdale",
    title: "AI Solutions Architect",
    shortBio: "Designs and implements custom AI architectures, ensuring technical excellence and alignment with business objectives.",
    detailedBio: [
      "David is a technology leader with deep expertise in artificial intelligence and machine learning systems. His technical knowledge spans various AI disciplines, including natural language processing, computer vision, and predictive analytics.",
      "Throughout his career, David has designed and implemented AI solutions for diverse industries, helping organizations leverage cutting-edge technology to solve complex business challenges and create competitive advantages.",
      "At SWiM, David leads the technical design and implementation of our AI solutions, ensuring they are scalable, secure, and deliver measurable business value."
    ],
    expertise: [
      "AI System Architecture",
      "Machine Learning",
      "Natural Language Processing",
      "Technical Leadership",
      "Solution Integration"
    ],
    photo: "gradient-avatar",
    social: {
      linkedin: "https://linkedin.com/in/",
      github: "https://github.com/"
    }
  }
];

// Team member avatar component with size options
const TeamMemberAvatar: React.FC<{ index: number, name: string, size: "large" | "regular" }> = ({ index, name, size }) => {
  // Use different background colors based on index for visual variety
  const backgrounds = [
    `rgba(26, 140, 183, 0.1)`, // ACCENT_COLOR with opacity
    `rgba(75, 203, 242, 0.1)`, // HIGHLIGHT_COLOR with opacity
    `rgba(10, 58, 90, 0.1)`,   // PRIMARY_COLOR with opacity
    `rgba(0, 35, 72, 0.1)`     // SECONDARY_COLOR with opacity
  ];

  const sizeClasses = size === "large" 
    ? "w-48 h-48 md:w-64 md:h-64 rounded-3xl mb-6" 
    : "w-full aspect-square rounded-2xl mb-4";

  return (
    <div 
      className={`flex items-center justify-center overflow-hidden relative ${sizeClasses}`}
      style={{ background: backgrounds[index % backgrounds.length] }}
    >
      <img 
        src={teamMemberImage} 
        alt={name}
        className="w-full h-full object-contain p-4"
      />
    </div>
  );
};

const TeamMemberProfile: React.FC = () => {
  const [, params] = useRoute<{ id: string }>("/team/:id");
  const memberId = params?.id ? parseInt(params.id) : null;
  const member = memberId !== null ? teamMembers.find(m => m.id === memberId) : null;
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // If member ID doesn't exist, show a not found message
  if (!member) {
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
            <div className="container mx-auto px-6 md:px-12 text-center">
              <h1 className="text-4xl font-space font-bold mb-6 text-white">Team Member Not Found</h1>
              <p className="text-white/70 mb-8">The team member you're looking for doesn't exist.</p>
              <Link href="/team">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Team
                </Button>
              </Link>
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
  }

  // Find team member index for avatar coloring
  const memberIndex = teamMembers.findIndex(m => m.id === member.id);

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
            <Link href="/team">
              <Button 
                variant="ghost" 
                className="mb-8 text-white/70 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Team
              </Button>
            </Link>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Left column: Photo and basic info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-1"
              >
                <div className="glass rounded-3xl p-6 sticky top-24">
                  <div className="flex flex-col items-center text-center">
                    <TeamMemberAvatar 
                      index={memberIndex} 
                      name={member.name} 
                      size="large" 
                    />
                    
                    <h1 className="text-2xl md:text-3xl font-space font-bold mb-2">{member.name}</h1>
                    <p className="text-accent font-inter text-lg mb-6">{member.title}</p>
                    
                    {/* Social links */}
                    <div className="flex gap-4 mb-8">
                      {member.social?.linkedin && (
                        <a 
                          href={member.social.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent/40 transition-all"
                        >
                          <Linkedin className="w-5 h-5 text-white" />
                        </a>
                      )}
                      {member.social?.twitter && (
                        <a 
                          href={member.social.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent/40 transition-all"
                        >
                          <Twitter className="w-5 h-5 text-white" />
                        </a>
                      )}
                      {member.social?.github && (
                        <a 
                          href={member.social.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent/40 transition-all"
                        >
                          <Github className="w-5 h-5 text-white" />
                        </a>
                      )}
                    </div>
                    
                    {/* Areas of expertise */}
                    <div className="w-full">
                      <h3 className="text-lg font-space font-semibold mb-3">Areas of Expertise</h3>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {member.expertise.map((skill, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 rounded-full bg-accent/10 text-accent/90 text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Right column: Detailed bio */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="lg:col-span-2"
              >
                <motion.div
                  variants={fadeIn}
                  className="glass rounded-3xl p-8"
                >
                  <h2 className="text-2xl font-space font-bold mb-6 border-b border-white/10 pb-4">About {member.name}</h2>
                  
                  <div className="space-y-6">
                    {member.detailedBio.map((paragraph, idx) => (
                      <p key={idx} className="text-white/80 font-inter leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  <div className="mt-12 pt-8 border-t border-white/10">
                    <h3 className="text-xl font-space font-semibold mb-4">Contact {member.name}</h3>
                    <p className="text-white/70 mb-6">
                      Interested in discussing how {member.name} and the SWiM team can help your business?
                    </p>
                    <Link href="/contact">
                      <Button 
                        variant="outline"
                        className="bg-transparent border border-accent text-accent hover:bg-accent hover:text-primary transition-all duration-300"
                      >
                        Get in Touch
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            </div>
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

export default TeamMemberProfile;