import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useParams, useLocation } from 'wouter';
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
  ExternalLink
} from 'lucide-react';
import { BlogPost as BlogPostType } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { apiRequest } from '@/lib/queryClient';
import { fadeIn, slideUp, staggerContainer } from '@/lib/animations';

interface BlogPostProps {
  slug: string;
}

const BlogPost = ({ slug }: BlogPostProps) => {
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const { data: post, isLoading, error } = useQuery<BlogPostType>({
    queryKey: ['/api/blog-posts/slug', slug],
    queryFn: () => fetch(`/api/blog-posts/slug/${slug}`).then(res => {
      if (!res.ok) throw new Error('Post not found');
      return res.json();
    })
  });

  const { data: recentPosts = [] } = useQuery<BlogPostType[]>({
    queryKey: ['/api/blog-posts/recent/list'],
  });

  const shareMutation = useMutation({
    mutationFn: () => apiRequest(`/api/blog-posts/${post?.id}/share`, 'POST', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts/slug', slug] });
    }
  });

  const leadMutation = useMutation({
    mutationFn: () => apiRequest(`/api/blog-posts/${post?.id}/lead`, 'POST', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts/slug', slug] });
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

  const handleShare = async () => {
    shareMutation.mutate();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      // Could add toast notification here
    }
  };

  const handleDownload = () => {
    leadMutation.mutate();
    // In a real implementation, this would download the resource
    if (post?.downloadableResource) {
      window.open(`/downloads/${post.downloadableResource}`, '_blank');
    }
  };

  const handleCTAClick = () => {
    leadMutation.mutate();
    
    switch (post?.ctaType) {
      case 'consultation':
        navigate('/#contact');
        break;
      case 'download':
        handleDownload();
        break;
      case 'newsletter':
        // Scroll to newsletter signup
        navigate('/#contact');
        break;
      case 'demo':
        navigate('/#contact');
        break;
      default:
        navigate('/#contact');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-white/80 mb-8">The article you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button className="bg-accent hover:bg-accent/90">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary">
        <div className="gradient-bg">
          <div className="container mx-auto px-4 pt-24">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-white/10 rounded w-1/4 mb-4"></div>
                <div className="h-12 bg-white/10 rounded mb-6"></div>
                <div className="h-6 bg-white/10 rounded w-1/3 mb-8"></div>
                <div className="h-64 bg-white/10 rounded mb-8"></div>
                <div className="space-y-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-4 bg-white/10 rounded w-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-primary">
      <div className="gradient-bg">
        {/* Header */}
        <header className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-4xl mx-auto"
            >
              <motion.div variants={fadeIn} className="mb-6">
                <Link href="/blog" className="inline-flex items-center text-accent hover:text-highlight transition-colors">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Link>
              </motion.div>

              <motion.div variants={slideUp} className="mb-6">
                <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30 mb-4">
                  {post.category}
                </Badge>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  {post.title}
                </h1>
                <p className="text-xl text-white/80 mb-6">
                  {post.excerpt}
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-6 text-white/60">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(post.publishedAt)}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {getReadingTime(post.content)} min read
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  {post.views || 0} views
                </div>
              </motion.div>
            </motion.div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <motion.section 
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="pb-12"
          >
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <img 
                  src={post.featuredImage} 
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-2xl"
                />
              </div>
            </div>
          </motion.section>
        )}

        {/* Content */}
        <main className="pb-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
              {/* Article Content */}
              <motion.article 
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="lg:col-span-3"
              >
                <div className="prose prose-lg prose-invert max-w-none">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                    <div className="text-white/90 leading-relaxed">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                        h1: ({ children }) => <h1 className="text-3xl font-bold text-white mb-6 mt-8">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-bold text-white mb-4 mt-6">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-semibold text-white mb-3 mt-4">{children}</h3>,
                        h4: ({ children }) => <h4 className="text-lg font-semibold text-white mb-2 mt-3">{children}</h4>,
                        p: ({ children }) => <p className="text-white/90 mb-4 leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside text-white/90 mb-4 space-y-2">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside text-white/90 mb-4 space-y-2">{children}</ol>,
                        li: ({ children }) => <li className="text-white/90">{children}</li>,
                        a: ({ children, href }) => (
                          <a 
                            href={href} 
                            className="text-accent hover:text-highlight transition-colors underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {children}
                          </a>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-accent pl-6 py-2 my-6 bg-white/5 rounded-r-lg">
                            <div className="text-white/80 italic">{children}</div>
                          </blockquote>
                        ),
                        code: ({ children, className }) => {
                          const isInline = !className;
                          if (isInline) {
                            return (
                              <code className="bg-white/10 text-accent px-2 py-1 rounded text-sm font-mono">
                                {children}
                              </code>
                            );
                          }
                          return (
                            <code className={className}>
                              {children}
                            </code>
                          );
                        },
                        pre: ({ children }) => (
                          <pre className="bg-secondary/50 border border-white/10 rounded-lg p-4 overflow-x-auto mb-6">
                            {children}
                          </pre>
                        ),
                        strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                        em: ({ children }) => <em className="italic text-white/90">{children}</em>,
                        hr: () => <hr className="border-white/20 my-8" />,
                      }}
                    >
                      {post.content}
                    </ReactMarkdown>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="border-white/20 text-white/70">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Section */}
                <div className="mt-12 p-8 bg-gradient-to-r from-accent/20 to-highlight/20 rounded-2xl border border-accent/30">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {post.ctaType === 'download' && 'Get Your Free Resource'}
                    {post.ctaType === 'consultation' && 'Ready to Transform Your Business?'}
                    {post.ctaType === 'demo' && 'See It in Action'}
                    {post.ctaType === 'newsletter' && 'Stay Updated'}
                  </h3>
                  <p className="text-white/80 mb-6">
                    {post.ctaType === 'download' && 'Download our comprehensive guide and start implementing these strategies today.'}
                    {post.ctaType === 'consultation' && 'Let\'s discuss how AI and automation can revolutionize your workflows.'}
                    {post.ctaType === 'demo' && 'Schedule a personalized demo to see how our solutions work for your business.'}
                    {post.ctaType === 'newsletter' && 'Get the latest insights on AI, automation, and business transformation.'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={handleCTAClick}
                      className="bg-accent hover:bg-accent/90 text-white font-semibold"
                    >
                      {post.ctaType === 'download' && <Download className="h-4 w-4 mr-2" />}
                      {post.ctaType === 'demo' && <ExternalLink className="h-4 w-4 mr-2" />}
                      {post.ctaType === 'consultation' && <MessageCircle className="h-4 w-4 mr-2" />}
                      {post.ctaType === 'download' && 'Download Now'}
                      {post.ctaType === 'consultation' && 'Schedule Consultation'}
                      {post.ctaType === 'demo' && 'Request Demo'}
                      {post.ctaType === 'newsletter' && 'Subscribe'}
                    </Button>
                    <Button 
                      onClick={handleShare}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Article
                    </Button>
                  </div>
                </div>
              </motion.article>

              {/* Sidebar */}
              <motion.aside 
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="sticky top-24 space-y-8">
                  {/* Recent Posts */}
                  {recentPosts.length > 0 && (
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Recent Articles</h3>
                      <div className="space-y-4">
                        {recentPosts.slice(0, 3).filter(p => p.slug !== post.slug).map((recentPost) => (
                          <Link key={recentPost.id} href={`/blog/${recentPost.slug}`}>
                            <div className="group cursor-pointer">
                              <h4 className="text-sm font-medium text-white group-hover:text-accent transition-colors line-clamp-2 mb-2">
                                {recentPost.title}
                              </h4>
                              <div className="flex items-center text-xs text-white/60">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(recentPost.publishedAt)}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Newsletter Signup */}
                  <div className="bg-gradient-to-br from-accent/20 to-highlight/20 border border-accent/30 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Stay Informed</h3>
                    <p className="text-white/80 text-sm mb-4">
                      Get weekly insights on AI, automation, and business transformation.
                    </p>
                    <Button 
                      onClick={() => navigate('/#contact')}
                      className="w-full bg-accent hover:bg-accent/90"
                    >
                      Subscribe Now
                    </Button>
                  </div>
                </div>
              </motion.aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const BlogPostPage = () => {
  const params = useParams();
  return <BlogPost slug={params.slug || ''} />;
};

export default BlogPostPage;