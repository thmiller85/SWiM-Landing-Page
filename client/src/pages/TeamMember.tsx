import React, { useEffect } from "react";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { ACCENT_COLOR, DARK_NAVY, HIGHLIGHT_COLOR, PRIMARY_COLOR } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import rossAvatarImage from "@/assets/ross-avatar.png";
import tomAvatarImage from "@/assets/tom-avatar.png";
import steveAvatarImage from "@/assets/steve-avatar.png";
import davidAvatarImage from "@/assets/david-avatar.png";

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
    shortBio: "Fractional CMO and founder of Thunder Stock Marketing, helping B2B service companies craft data-driven campaigns and lean operational workflows.",
    detailedBio: [
      "Ross Stockdale steers SWiM's marketing \"lanes\" with the precision of a veteran swimmer and the strategic vision of a stoic captain. A self-made Fractional CMO and founder of Thunder Stock Marketing, Ross has spent over a decade helping B2B service companies dive into profitability by crafting data-driven campaigns and lean operational workflows.",
      "From his early days optimizing SEO for family businesses to scaling a $600M enterprise in private equity and agency roles, Ross charted his own course—culminating in the Q4 2022 launch of his solopreneur-led firm. He balances profit-over-revenue mindsets with community-first ideals, slashing client acquisition costs by up to 75% and guiding entrepreneurs to financial freedom.",
      "Whether developing campaign KPIs in swim practice sessions, building agile marketing teams in collaborative relays, or integrating generative AI to generate trust strokes in every touchpoint, Ross's philosophy is clear: align each stroke with net profit, empower small businesses as the backbone of our economy, and aim for that Big Hairy Audacious Goal—helping 100 companies achieve lasting success.",
      "When he's not fine-tuning a campaign relay, you'll find Ross sharing insights on The Thunder Stock Show or mentoring peers in Vistage and local forums."
    ],
    expertise: [
      "Fractional CMO",
      "Data-Driven Marketing",
      "B2B Service Marketing",
      "Profit-Focused Campaigns",
      "Marketing Operations"
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
    shortBio: "Former J.P. Morgan Executive Director turned self-taught AI expert who blends financial expertise with cutting-edge technology solutions.",
    detailedBio: [
      "From the high-stakes boardrooms of J.P. Morgan to the cutting-edge currents of artificial intelligence, Tom Miller has spent his career charting new lanes in finance and technology.",
      "As an Executive Director in private banking, he mastered the art of navigating complex financial waters—by night and on weekends, he dove headfirst into self-taught AI mastery, binge-learning the latest frameworks between soccer practices and golf tee times.",
      "Tom's highlights include architecting a bespoke golf app to track friendly course competitions, engineering AI-driven micro-SaaS tools that streamlined operations and cut costs for boutique clients, and maintaining a relentless learning regimen fueled by tech podcasts and family time.",
      "Armed with a B.A. in Business (Finance concentration) from Franklin & Marshall College and a Kolbe Quick-Start instinct for rapid prototyping, Tom leads SWiM's Product Development \"practice\" with swimmer's precision: setting clear lanes for each sprint, soliciting feedback, and fine-tuning until every stroke is seamless.",
      "When he's not devising the next wave of AI solutions, you'll find him on the fairway or coaching his kids through life's drills—ensuring SWiM always surges ahead."
    ],
    expertise: [
      "AI Solution Design",
      "Financial Technology",
      "Rapid Prototyping",
      "Product Development",
      "Self-Taught Engineering"
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
    shortBio: "Founder of Wurster Digital Group with 15+ years experience in performance media strategy, managing multi-million-dollar budgets, and scaling marketing teams.",
    detailedBio: [
      "Steve Wurster captains SWiM's growth lane with over 15 years of hands-on experience leading performance media strategy, scaling marketing teams, and managing multi-million-dollar budgets.", 
      "As the founder of Wurster Digital Group, Steve built a consultancy dedicated to bridging the gap between data analytics and creative marketing—an ethos that aligns perfectly with SWiM's mission to help businesses grow smarter, not just faster.",
      "Steve's career started in digital advertising at Liberty Travel, where he managed a $2.1M ad budget and cut cost per inquiry by 50% through data-driven optimizations. At Merkle, he stewarded over $25M in advertising spend and helped launch display campaigns that boosted both brand awareness and revenue. His leadership at Fishbowl saw him managing campaigns for 120 national restaurant accounts and generating $2M annually through email performance enhancements.",
      "At Dentsu, as Director of Performance Media, Steve led a 14-person team and managed $60M in annual ad spend—driving record-breaking growth for one of the largest U.S. furniture retailers and stabilizing performance for major beverage clients during key transitions. His approach blends rigorous analytics with agile execution, always focused on impact over vanity.",
      "Today, at SWiM, Steve helps lead the charge in transforming paid media and marketing into growth engines powered by automation, AI, and strategic clarity.",
      "When he's not deep in campaign metrics or strategy maps, you'll find him out on the golf course—reminding us all that growth, like a good swing, is all about rhythm, balance, and precision."
    ],
    expertise: [
      "Performance Media Strategy",
      "Data-Driven Marketing",
      "Budget Optimization",
      "Team Leadership",
      "Digital Advertising"
    ],
    photo: "gradient-avatar",
    social: {
      linkedin: "https://linkedin.com/in/",
    }
  },
  {
    id: 4,
    name: "David Stockdale",
    title: "Chief Technology Officer",
    shortBio: "Self-taught technician with a decade of experience in network infrastructure, systems integration, and hands-on technical leadership.",
    detailedBio: [
      "David Stockdale brings a builder's mindset and a technician's precision to SWiM's technology lane. With nearly a decade of hands-on experience in network infrastructure, low-voltage systems, and systems integration, David's path into tech didn't start in a classroom—it was pulled through walls, wired into racks, and booted up one machine at a time.",
      "From laying 250,000+ feet of cabling for a multi-floor healthcare facility to designing full-scale commercial network systems, David has been architecting complex environments long before stepping into his official CTO role. His time as a technician for a digital gambling company sharpened his ability to combine hardware, software, and scalable connectivity—skills he now brings to bear on SWiM's rapidly evolving product architecture.",
      "Self-taught in networking and computing, and currently pursuing a Developer Certificate, David leads from the trenches. Whether designing the next-gen infrastructure that powers SWiM's automations or debugging a line of rogue code, he believes in doing the work alongside the team, not above it. His leadership is rooted in clarity, accountability, and velocity—qualities forged during his years as an Eagle Scout and youth leader, where solving problems under pressure became second nature.",
      "When he's not streamlining digital systems, you'll find David deep in the wilderness, tending to his personal horticulture studies or simply reconnecting with the wild. For him, building with purpose—whether in the woods or in the codebase—is what keeps things flowing."
    ],
    expertise: [
      "Network Infrastructure",
      "Systems Integration",
      "Technical Architecture",
      "Hands-on Leadership",
      "Problem-Solving"
    ],
    photo: "gradient-avatar",
    social: {
      linkedin: "https://linkedin.com/in/",
      github: "https://github.com/"
    }
  }
];

// Team member avatar component with size options
const TeamMemberAvatar: React.FC<{ index: number, name: string, size: "large" | "regular", memberId: number }> = ({ index, name, size, memberId }) => {
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

  const sizeClasses = size === "large" 
    ? "w-48 h-48 md:w-64 md:h-64 rounded-3xl mb-6" 
    : "w-full aspect-square rounded-2xl mb-4";
    
  const fontSizeClass = size === "large" ? "text-8xl" : "text-6xl";

  // Ross Stockdale (id: 1) gets custom image
  if (memberId === 1) {
    return (
      <div 
        className={`flex items-center justify-center overflow-hidden relative ${sizeClasses}`}
        style={{ background: backgrounds[index % backgrounds.length] }}
      >
        <img 
          src={rossAvatarImage} 
          alt={name}
          className="w-full h-full object-contain p-4"
        />
      </div>
    );
  }
  
  // Tom Miller (id: 2) gets custom image
  if (memberId === 2) {
    return (
      <div 
        className={`flex items-center justify-center overflow-hidden relative ${sizeClasses}`}
        style={{ background: backgrounds[index % backgrounds.length] }}
      >
        <img 
          src={tomAvatarImage} 
          alt={name}
          className="w-full h-full object-contain p-4"
        />
      </div>
    );
  }
  
  // Steve Wurster (id: 3) gets custom image
  if (memberId === 3) {
    return (
      <div 
        className={`flex items-center justify-center overflow-hidden relative ${sizeClasses}`}
        style={{ background: backgrounds[index % backgrounds.length] }}
      >
        <img 
          src={steveAvatarImage} 
          alt={name}
          className="w-full h-full object-contain p-4"
        />
      </div>
    );
  }
  
  // David Stockdale (id: 4) gets custom image
  if (memberId === 4) {
    return (
      <div 
        className={`flex items-center justify-center overflow-hidden relative ${sizeClasses}`}
        style={{ background: backgrounds[index % backgrounds.length] }}
      >
        <img 
          src={davidAvatarImage} 
          alt={name}
          className="w-full h-full object-contain p-4"
        />
      </div>
    );
  }
  
  // Others get gradient avatars with their initials
  return (
    <div 
      className={`flex items-center justify-center overflow-hidden ${sizeClasses}`}
      style={{ background: gradients[index % gradients.length] }}
    >
      <span className={`${fontSizeClass} text-white font-bold opacity-30`}>
        {name.charAt(0)}
      </span>
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
          <main className="pt-40 pb-24">
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
        
        <main className="pt-40 pb-24">
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
                      memberId={member.id}
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
                    <Link href="/#contact">
                      <Button 
                        variant="outline"
                        className="bg-transparent border border-accent text-accent hover:bg-accent hover:text-primary transition-all duration-300"
                        onClick={() => {
                          // Navigate to home page and scroll to contact section
                          setTimeout(() => {
                            const contactSection = document.getElementById('contact');
                            if (contactSection) {
                              contactSection.scrollIntoView({ behavior: 'smooth' });
                            }
                          }, 100);
                        }}
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