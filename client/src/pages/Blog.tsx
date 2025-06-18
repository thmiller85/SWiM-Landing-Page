import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import ReactMarkdown from 'react-markdown';
import { Search, Calendar, Clock, User, ArrowRight, Filter } from 'lucide-react';
import { blogAPIService } from '@/lib/blog-api';
import { BlogPost } from '@/blog-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fadeIn, slideUp, staggerContainer } from '@/lib/animations';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigation } from '@/context/NavigationContext';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const { 
    servicesRef, 
    aiSolutionsRef, 
    workflowRef, 
    caseStudiesRef, 
    aboutRef, 
    contactRef, 
    navigateAndScroll
  } = useNavigation();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { data: posts = [], isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['blog-posts', { 
      category: selectedCategory,
      tag: selectedTag,
      search: searchQuery,
    }],
    queryFn: () => blogAPIService.getAllPosts({
      search: searchQuery || undefined,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      tag: selectedTag !== 'all' ? selectedTag : undefined
    }),
    retry: 1,
    retryDelay: 1000,
    staleTime: 30 * 1000, // 30 seconds cache for real-time updates
  });

  const categories = ['all', 'Workflow Automation', 'AI Solutions', 'SaaS Development'];
  const tags = ['all', 'workflow', 'automation', 'ai', 'b2b', 'saas', 'productivity', 'strategy'];



  const BlogCard = ({ post, index }: { post: BlogPost; index: number }) => (
    <motion.article
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
      className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="p-6">
          {post.featuredImage && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img 
                src={post.featuredImage} 
                alt={post.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          
          <div className="flex items-center gap-4 mb-3">
            <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
              {post.category}
            </Badge>
            <div className="flex items-center text-white/60 text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              {blogAPIService.formatDate(post.publishedAt)}
            </div>
            <div className="flex items-center text-white/60 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              {post.readingTime} min read
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors line-clamp-2">
            {post.title}
          </h2>

          <div className="text-white/80 mb-4 line-clamp-3">
            <ReactMarkdown 
              components={{
                p: ({ children }) => <>{children}</>,
                strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                em: ({ children }) => <em className="italic text-white/90">{children}</em>,
                a: ({ children, href }) => <a href={href} className="text-accent hover:text-highlight underline transition-colors">{children}</a>
              }}
            >
              {post.excerpt}
            </ReactMarkdown>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-white/60 text-sm">
              <User className="h-4 w-4 mr-1" />
              {post.author}
            </div>
            
            <div className="flex items-center text-accent group-hover:text-highlight transition-colors">
              <span className="text-sm mr-2">Read more</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.slice(0, 3).map((tag: string, i: number) => (
                <Badge key={i} variant="outline" className="text-xs border-white/20 text-white/70">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );

  return (
    <div className="min-h-screen bg-primary">
      <Navbar 
        onServicesClick={() => navigateAndScroll(servicesRef)}
        onAISolutionsClick={() => navigateAndScroll(aiSolutionsRef)}
        onWorkflowClick={() => navigateAndScroll(workflowRef)}
        onCaseStudiesClick={() => navigateAndScroll(caseStudiesRef)}
        onAboutClick={() => navigateAndScroll(aboutRef)}
        onContactClick={() => navigateAndScroll(contactRef)}
      />
      <div className="gradient-bg">
        {/* Hero Section */}
        <section className="pt-40 pb-16">
          <div className="container mx-auto px-4">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-center max-w-4xl mx-auto"
            >
              <motion.h1 
                variants={slideUp}
                className="text-4xl md:text-6xl font-bold text-white mb-6"
              >
                AI & Automation <span className="text-accent">Insights</span>
              </motion.h1>
              <motion.p 
                variants={slideUp}
                className="text-xl text-white/80 mb-8"
              >
                Expert insights on workflow automation, AI implementation, and custom SaaS development
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="pb-8">
          <div className="container mx-auto px-4">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag === 'all' ? 'All Topics' : `#${tag}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedTag('all');
                  }}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-6 animate-pulse">
                    <div className="h-48 bg-white/10 rounded-lg mb-4"></div>
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-4 bg-white/10 rounded w-2/3 mb-4"></div>
                    <div className="h-20 bg-white/10 rounded"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold text-white mb-4">Error Loading Articles</h3>
                <p className="text-white/80 mb-8">
                  {error instanceof Error ? error.message : 'Failed to load articles from WordPress'}
                </p>
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4 text-left max-w-2xl mx-auto">
                  <pre className="text-sm text-white/90 whitespace-pre-wrap">
                    {error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}
                  </pre>
                </div>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-accent hover:bg-accent/90"
                >
                  Retry
                </Button>
              </motion.div>
            ) : posts.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {posts.map((post, index) => (
                  <BlogCard key={post.slug} post={post} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-white mb-4">No articles found</h3>
                <p className="text-white/80 mb-8">Try adjusting your search or filter criteria</p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedTag('all');
                  }}
                  className="bg-accent hover:bg-accent/90"
                >
                  View All Articles
                </Button>
              </motion.div>
            )}
          </div>
        </section>
      </div>
      <Footer 
        onServicesClick={() => navigateAndScroll(servicesRef)}
        onAboutClick={() => navigateAndScroll(aboutRef)}
        onContactClick={() => navigateAndScroll(contactRef)}
      />
    </div>
  );
};

export default Blog;