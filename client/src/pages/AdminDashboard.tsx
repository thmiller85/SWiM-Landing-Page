import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, Link } from 'wouter';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  LogOut,
  BarChart3,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';
import { BlogPost } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { fadeIn, staggerContainer } from '@/lib/animations';

const AdminDashboard = () => {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/admin/blog-posts'],
    queryFn: async () => {
      // Client-side data management for static deployment
      const storedPosts = localStorage.getItem('adminBlogPosts');
      if (storedPosts) {
        return JSON.parse(storedPosts);
      }
      
      // Initialize with sample blog posts for admin management
      const samplePosts: BlogPost[] = [
        {
          id: 1,
          title: "AI-Powered Marketing Automation: The Future is Here",
          slug: "ai-powered-marketing-automation-future",
          excerpt: "Discover how AI is revolutionizing marketing automation and helping businesses achieve unprecedented growth.",
          content: "AI-powered marketing automation is transforming how businesses engage with customers...",
          category: "AI Marketing",
          author: "Ross Stockdale",
          status: "published" as const,
          ctaType: "consultation" as const,
          featuredImage: "",
          seoTitle: "AI-Powered Marketing Automation: Transform Your Business",
          metaDescription: "Learn how AI marketing automation can boost your ROI by 300%. Expert insights on implementation strategies.",
          downloadableResource: "",
          tags: ["AI", "Marketing", "Automation"],
          targetKeywords: ["AI marketing", "marketing automation", "business growth"],
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-01-15"),
          views: 1250,
          leads: 45,
          shares: 23
        }
      ];
      
      localStorage.setItem('adminBlogPosts', JSON.stringify(samplePosts));
      return samplePosts;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      const token = localStorage.getItem('adminToken');
      return fetch(`/api/blog-posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
      toast({
        title: "Post deleted",
        description: "The blog post has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the post. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleDelete = (id: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    totalViews: posts.reduce((sum, p) => sum + (p.views || 0), 0),
    totalLeads: posts.reduce((sum, p) => sum + (p.leads || 0), 0)
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <div className="gradient-bg">
        {/* Header */}
        <header className="bg-white/5 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Content Management</h1>
                <p className="text-white/70">Manage your blog posts and content</p>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/blog">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Eye className="h-4 w-4 mr-2" />
                    View Blog
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="py-8">
          <div className="container mx-auto px-6">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
            >
              <motion.div variants={fadeIn}>
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Total Posts</p>
                        <p className="text-2xl font-bold text-white">{stats.total}</p>
                      </div>
                      <FileText className="h-8 w-8 text-accent" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Published</p>
                        <p className="text-2xl font-bold text-green-400">{stats.published}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Drafts</p>
                        <p className="text-2xl font-bold text-yellow-400">{stats.draft}</p>
                      </div>
                      <Edit className="h-8 w-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Total Views</p>
                        <p className="text-2xl font-bold text-blue-400">{stats.totalViews}</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Total Leads</p>
                        <p className="text-2xl font-bold text-highlight">{stats.totalLeads}</p>
                      </div>
                      <Users className="h-8 w-8 text-highlight" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Filters and Actions */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                    <Input
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Posts</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Link href="/admin/blog-posts/new">
                  <Button className="bg-accent hover:bg-accent/90">
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Posts Table */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
            >
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
                  <p className="text-white/70">Loading posts...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="h-12 w-12 text-white/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No posts found</h3>
                  <p className="text-white/70 mb-4">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Create your first blog post to get started'
                    }
                  </p>
                  <Link href="/admin/blog-posts/new">
                    <Button className="bg-accent hover:bg-accent/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Post
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="text-left p-4 text-white/80 font-semibold">Title</th>
                        <th className="text-left p-4 text-white/80 font-semibold">Status</th>
                        <th className="text-left p-4 text-white/80 font-semibold">Category</th>
                        <th className="text-left p-4 text-white/80 font-semibold">Views</th>
                        <th className="text-left p-4 text-white/80 font-semibold">Leads</th>
                        <th className="text-left p-4 text-white/80 font-semibold">Date</th>
                        <th className="text-right p-4 text-white/80 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPosts.map((post) => (
                        <tr key={post.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="p-4">
                            <div>
                              <h3 className="text-white font-medium line-clamp-1">{post.title}</h3>
                              <p className="text-white/60 text-sm line-clamp-1">{post.excerpt}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(post.status)}>
                              {post.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <span className="text-white/70">{post.category}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center text-white/70">
                              <Eye className="h-4 w-4 mr-1" />
                              {post.views || 0}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center text-white/70">
                              <Users className="h-4 w-4 mr-1" />
                              {post.leads || 0}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center text-white/70">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(post.publishedAt || post.createdAt)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              {post.status === 'published' && (
                                <Link href={`/blog/${post.slug}`}>
                                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                              )}
                              <Link href={`/admin/blog-posts/edit/${post.id}`}>
                                <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                onClick={() => handleDelete(post.id, post.title)}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;