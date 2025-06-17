import { Link } from "wouter";
import Logo from "./ui/logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Mail } from "lucide-react";

interface BlogNavbarProps {
  showBackButton?: boolean;
  backHref?: string;
  backText?: string;
}

const BlogNavbar = ({ 
  showBackButton = false, 
  backHref = "/blog", 
  backText = "Back to Blog" 
}: BlogNavbarProps) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-primary/90 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <button className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </button>
            </Link>
            <Link href="/blog">
              <button className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide">
                Blog
              </button>
            </Link>
            <Link href="/team">
              <button className="text-white/80 hover:text-accent transition font-inter text-sm uppercase tracking-wide">
                Team
              </button>
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Link href={backHref} className="hidden md:inline-flex">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white/80 hover:text-accent hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {backText}
                </Button>
              </Link>
            )}
            <Link href="/#contact">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-transparent border border-accent text-accent hover:bg-accent hover:text-primary transition-all duration-300"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </Link>
          </div>

          {/* Mobile Back Button */}
          {showBackButton && (
            <Link href={backHref} className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white/80 hover:text-accent hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default BlogNavbar;