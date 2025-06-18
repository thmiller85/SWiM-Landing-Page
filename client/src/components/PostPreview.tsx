import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  User, 
  X,
  Monitor,
  Smartphone,
  Eye,
  Share2
} from 'lucide-react';

interface PostPreviewProps {
  post: {
    title: string;
    slug: string;
    metaTitle?: string | null;
    metaDescription?: string | null;
    excerpt?: string | null;
    content: string;
    featuredImage?: string | null;
    featuredImageAlt?: string | null;
    author: string;
    category: string;
    tags: string[];
    readingTime: number;
    publishedAt?: Date | null;
    status: string;
    ctaType: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (date: Date | string | null) => {
  if (!date) return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export function PostPreview({ post, isOpen, onClose }: PostPreviewProps) {
  const [deviceView, setDeviceView] = React.useState<'desktop' | 'mobile'>('desktop');
  
  if (!isOpen) return null;

  const ctaContent = {
    consultation: {
      title: 'Ready to Transform Your Business?',
      description: 'Discover how SWiM AI can revolutionize your workflow automation and drive unprecedented growth.',
      button: 'Schedule Free Consultation'
    },
    download: {
      title: 'Get Your Free Resource',
      description: 'Download our comprehensive guide to AI-powered automation and start transforming your business today.',
      button: 'Download Now'
    },
    newsletter: {
      title: 'Stay Ahead of the Curve',
      description: 'Get the latest insights on AI and automation delivered straight to your inbox.',
      button: 'Subscribe to Newsletter'
    },
    demo: {
      title: 'See SWiM AI in Action',
      description: 'Book a personalized demo and discover how our AI solutions can transform your business.',
      button: 'Book a Demo'
    }
  };

  const cta = ctaContent[post.ctaType as keyof typeof ctaContent] || ctaContent.consultation;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-900 border-gray-700 w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Preview Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-white">Post Preview</h2>
              {post.status === 'draft' && (
                <Badge variant="secondary" className="bg-yellow-900 text-yellow-300">
                  Draft
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={deviceView === 'desktop' ? 'default' : 'outline'}
                onClick={() => setDeviceView('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={deviceView === 'mobile' ? 'default' : 'outline'}
                onClick={() => setDeviceView('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* SEO Preview */}
          <div className="mt-4 p-3 bg-gray-900 rounded-lg">
            <p className="text-blue-400 text-sm">{window.location.origin}/blog/{post.slug}</p>
            <h3 className="text-blue-600 text-lg font-normal hover:underline cursor-pointer">
              {post.metaTitle || post.title}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {post.metaDescription || post.excerpt || 'No description provided'}
            </p>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto bg-gray-900">
          <div className={`mx-auto transition-all duration-300 ${
            deviceView === 'mobile' ? 'max-w-sm' : 'max-w-4xl'
          }`}>
            <div className="bg-black min-h-full">
              {/* Hero Section */}
              <div className="pt-24 pb-12 px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/50">
                      {post.category}
                    </Badge>
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-gray-300 border-gray-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <h1 className={`font-bold text-white mb-6 ${
                    deviceView === 'mobile' ? 'text-3xl' : 'text-4xl md:text-5xl'
                  }`}>
                    {post.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
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
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>0 views</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white hover:bg-white/10"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  <Separator className="bg-gray-700 mt-6" />
                </motion.div>
              </div>

              {/* Main Content */}
              <div className="px-4 pb-20">
                <div className="max-w-4xl mx-auto">
                  {/* Featured Image */}
                  {post.featuredImage && (
                    <div className="mb-12">
                      <img 
                        src={post.featuredImage} 
                        alt={post.featuredImageAlt || post.title}
                        className="w-full h-64 md:h-96 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Excerpt */}
                  {post.excerpt && (
                    <div className="mb-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="prose prose-lg prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {post.excerpt}
                        </ReactMarkdown>
                      </div>
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
                      {cta.title}
                    </h3>
                    <p className="text-white/80 max-w-2xl mx-auto mb-8">
                      {cta.description}
                    </p>
                    <Button 
                      size="lg" 
                      className="bg-accent hover:bg-accent/90 text-black font-semibold shadow-glow transition-all"
                    >
                      {cta.button}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}