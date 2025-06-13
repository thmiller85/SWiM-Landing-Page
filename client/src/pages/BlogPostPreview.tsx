import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation, Link } from 'wouter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Share2, 
  Download, 
  Eye,
  MessageCircle,
  ChevronRight,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { BlogPost as BlogPostType } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { fadeIn, slideUp, staggerContainer } from '@/lib/animations';

interface BlogPostPreviewProps {
  id: string;
}

const BlogPostPreview = ({ id }: BlogPostPreviewProps) => {
  const [, navigate] = useLocation();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const { data: post, isLoading, error } = useQuery<BlogPostType>({
    queryKey: ['/api/blog-posts', id],
    queryFn: () => {
      const token = localStorage.getItem('adminToken');
      return fetch(`/api/blog-posts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(res => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      });
    }
  });

  const formatDate = (date: string | Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const words = content.split(' ').length;
    const readingSpeed = 200;
    return Math.ceil(words / readingSpeed);
  };

  const renderCTA = (ctaType: string) => {
    const ctaConfig = {
      consultation: {
        title: "Ready to Transform Your Business?",
        description: "Schedule a free consultation to see how AI can revolutionize your marketing strategy.",
        buttonText: "Book Free Consultation",
        icon: <MessageCircle className="h-5 w-5" />
      },
      download: {
        title: "Get Your Free Resource",
        description: "Download our comprehensive guide to implementing AI marketing automation.",
        buttonText: "Download Now",
        icon: <Download className="h-5 w-5" />
      },
      newsletter: {
        title: "Stay Ahead of the Curve",
        description: "Join thousands of marketers getting weekly AI insights and strategy tips.",
        buttonText: "Subscribe to Newsletter",
        icon: <ExternalLink className="h-5 w-5" />
      },
      demo: {
        title: "See It in Action",
        description: "Watch a live demo of our AI marketing platform and its capabilities.",
        buttonText: "Request Demo",
        icon: <Eye className="h-5 w-5" />
      }
    };

    const cta = ctaConfig[ctaType as keyof typeof ctaConfig] || ctaConfig.consultation;

    return (
      <motion.div
        variants={fadeIn}
        className="bg-gradient-to-r from-accent/20 to-highlight/20 border border-accent/30 rounded-2xl p-8 text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="bg-accent/20 p-3 rounded-full">
            {cta.icon}
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{cta.title}</h3>
        <p className="text-white/80 mb-6 max-w-md mx-auto">{cta.description}</p>
        <Button className="bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-3">
          {cta.buttonText}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-dark-navy flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-white/70">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-dark-navy flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Post Not Found</h2>
          <p className="text-white/70 mb-6">The blog post you're trying to preview doesn't exist.</p>
          <Link href="/admin/dashboard">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-dark-navy">
      {/* Preview Header */}
      <div className="bg-orange-500/20 border-b border-orange-500/30 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-400" />
              <span className="text-orange-200 font-medium">Preview Mode</span>
              <Badge className="bg-orange-500/20 text-orange-200 border-orange-500/30">
                {post.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/blog-posts/edit/${post.id}`}>
                <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Edit Post
                </Button>
              </Link>
              <Link href="/admin/dashboard">
                <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Article Header */}
          <motion.header variants={fadeIn} className="text-center space-y-6">
            <Badge className="bg-accent/20 text-accent border-accent/30">
              {post.category}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/70">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{getReadingTime(post.content)} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{post.views || 0} views</span>
              </div>
            </div>
          </motion.header>

          {/* Featured Image */}
          {post.featuredImage && (
            <motion.div variants={slideUp} className="rounded-2xl overflow-hidden">
              <img 
                src={post.featuredImage} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </motion.div>
          )}

          {/* Article Content */}
          <motion.div 
            variants={slideUp} 
            className="prose prose-lg prose-invert max-w-none"
          >
            <div 
              className="text-white/90 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: (post.content || '').replace(/\n/g, '<br />') }}
            />
          </motion.div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div variants={fadeIn} className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="bg-white/10 text-white/80 border-white/20"
                >
                  #{tag}
                </Badge>
              ))}
            </motion.div>
          )}

          <Separator className="bg-white/20" />

          {/* Call to Action */}
          <motion.div variants={fadeIn}>
            {renderCTA(post.ctaType)}
          </motion.div>

          {/* Downloadable Resource */}
          {post.downloadableResource && (
            <motion.div variants={fadeIn} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/20 p-3 rounded-full">
                  <Download className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">Free Resource Available</h4>
                  <p className="text-white/70 text-sm">{post.downloadableResource}</p>
                </div>
                <Button className="bg-accent hover:bg-accent/90">
                  Download
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </article>
    </div>
  );
};

const BlogPostPreviewPage = () => {
  const params = useParams();
  return <BlogPostPreview id={params.id || ''} />;
};

export default BlogPostPreviewPage;