import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'wouter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Share2,
  Eye,
  ChevronRight
} from 'lucide-react';
import { blogAPIService } from '@/lib/blog-api';
import { BlogPost as BlogPostType } from '@/blog-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigation } from '@/context/NavigationContext';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const BlogPost = () => {
  const params = useParams();
  const slug = params.slug as string;
  const { servicesRef, aiSolutionsRef, workflowRef, caseStudiesRef, aboutRef, contactRef, navigateAndScroll } = useNavigation();

  const handleNavClick = (ref: React.RefObject<HTMLElement>) => {
    navigateAndScroll(ref);
  };

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['/api/blog/posts/database/slug', slug],
    queryFn: () => blogAPIService.getPostBySlug(slug),
    enabled: !!slug,
  });

  // Set document title
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | SWiM AI Blog`;
    }
  }, [post]);

  // Track view
  useEffect(() => {
    if (post) {
      blogAPIService.trackView(post.slug);
    }
  }, [post]);

  if (isLoading) {
    return (
      <div className="relative bg-primary min-h-screen overflow-x-hidden">
        <div className="gradient-bg">
          <Navbar 
            onServicesClick={() => handleNavClick(servicesRef)}
            onAISolutionsClick={() => handleNavClick(aiSolutionsRef)}
            onWorkflowClick={() => handleNavClick(workflowRef)}
            onCaseStudiesClick={() => handleNavClick(caseStudiesRef)}
            onAboutClick={() => handleNavClick(aboutRef)}
            onContactClick={() => handleNavClick(contactRef)}
          />
          <div className="pt-40 pb-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer 
            onServicesClick={() => handleNavClick(servicesRef)}
            onAboutClick={() => handleNavClick(aboutRef)}
            onContactClick={() => handleNavClick(contactRef)}
          />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="relative bg-primary min-h-screen overflow-x-hidden">
        <div className="gradient-bg">
          <Navbar 
            onServicesClick={() => handleNavClick(servicesRef)}
            onAISolutionsClick={() => handleNavClick(aiSolutionsRef)}
            onWorkflowClick={() => handleNavClick(workflowRef)}
            onCaseStudiesClick={() => handleNavClick(caseStudiesRef)}
            onAboutClick={() => handleNavClick(aboutRef)}
            onContactClick={() => handleNavClick(contactRef)}
          />
          <div className="pt-40 pb-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
                <p className="text-gray-300 mb-8">The blog post you're looking for doesn't exist.</p>
                <Link href="/blog">
                  <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <Footer 
            onServicesClick={() => handleNavClick(servicesRef)}
            onAboutClick={() => handleNavClick(aboutRef)}
            onContactClick={() => handleNavClick(contactRef)}
          />
        </div>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/blog/${post.slug}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: shareUrl,
        });
        blogAPIService.trackShare(post.slug);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      blogAPIService.trackShare(post.slug);
    }
  };

  return (
    <div className="relative bg-primary min-h-screen overflow-x-hidden">
      <div className="gradient-bg">
        <Navbar 
          onServicesClick={() => handleNavClick(servicesRef)}
          onAISolutionsClick={() => handleNavClick(aiSolutionsRef)}
          onWorkflowClick={() => handleNavClick(workflowRef)}
          onCaseStudiesClick={() => handleNavClick(caseStudiesRef)}
          onAboutClick={() => handleNavClick(aboutRef)}
          onContactClick={() => handleNavClick(contactRef)}
        />
        
        <main className="pt-40 pb-20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Back Button */}
              <Link href="/blog">
                <Button 
                  variant="ghost" 
                  className="text-gray-300 hover:text-white hover:bg-white/10 mb-8"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>

              {/* Article Header */}
              <header className="mb-12">
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-600/30">
                    {post.category}
                  </Badge>
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-gray-300 border-gray-600">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {post.title}
                </h1>

                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.readingTime} min read</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>

                <Separator className="bg-gray-700" />
              </header>

              {/* Featured Image */}
              {post.featuredImage && (
                <div className="mb-12">
                  <img 
                    src={post.featuredImage} 
                    alt={post.title}
                    className="w-full h-64 md:h-96 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Article Content */}
              <article className="prose prose-lg prose-invert max-w-none mb-12">
                <div className="text-gray-200">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              </article>

              {/* CTA Section */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-8 md:p-12 text-center border border-white/20">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to Transform Your Business?
                </h3>
                <p className="text-white/80 max-w-2xl mx-auto mb-8">
                  Discover how SWiM AI can revolutionize your workflow automation and drive unprecedented growth.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-accent hover:bg-accent/90 text-black font-semibold shadow-glow transition-all"
                    style={{ 
                      textShadow: "0 0 5px rgba(0,240,255,0.3)",
                      boxShadow: "0 0 20px rgba(0,240,255,0.5)"
                    }}
                    onClick={() => blogAPIService.trackLead(post.slug)}
                  >
                    Schedule Consultation
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-white border-white hover:bg-white hover:text-gray-900"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Case Studies
                  </Button>
                </div>
              </div>

              {/* Back to Blog */}
              <div className="text-center mt-12">
                <Link href="/blog">
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    More Articles
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer 
          onServicesClick={() => handleNavClick(servicesRef)}
          onAboutClick={() => handleNavClick(aboutRef)}
          onContactClick={() => handleNavClick(contactRef)}
        />
      </div>
    </div>
  );
};

export default BlogPost;