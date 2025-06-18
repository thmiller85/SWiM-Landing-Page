import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Plus, Edit, Trash2, Image, Save, Eye, BarChart3, Upload, X, Copy, Check } from 'lucide-react';
import { ImagePickerModal } from '@/components/ImagePickerModal';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { GoogleAnalyticsDashboard } from '@/components/GoogleAnalyticsDashboard';
import { SEOPreview } from '@/components/SEOPreview';
import { PostEditor } from '@/components/PostEditor';
import { PostPreview } from '@/components/PostPreview';

// Client-only types to avoid server-side imports
interface ClientPost {
  id: number;
  title: string;
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  featuredImageAlt: string | null;
  author: string;
  status: string;
  ctaType: string;
  category: string;
  tags: string[];
  targetKeywords: string[];
  readingTime: number;
  views: number;
  leads: number;
  shares: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ClientImage {
  id: number;
  filename: string;
  originalName: string;
  altText: string | null;
  caption: string | null;
  url: string;
  size: number;
  mimeType: string;
  width: number | null;
  height: number | null;
  createdAt: Date;
}

export default function CMSDashboardClean() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'images' | 'analytics' | 'google-analytics'>('posts');
  const [editingPost, setEditingPost] = useState<ClientPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [copiedImageUrl, setCopiedImageUrl] = useState<string | null>(null);
  const [previewPost, setPreviewPost] = useState<ClientPost | null>(null);

  // Check authentication
  useEffect(() => {
    const user = localStorage.getItem('cms_user');
    if (!user) {
      navigate('/cms/login');
      return;
    }
    setCurrentUser(JSON.parse(user));
  }, [navigate]);

  // Fetch posts
  const { data: posts = [], isLoading: postsLoading } = useQuery<ClientPost[]>({
    queryKey: ['cms-posts'],
    queryFn: () => apiRequest('/api/cms/posts'),
  });

  // Fetch images
  const { data: images = [], isLoading: imagesLoading } = useQuery<ClientImage[]>({
    queryKey: ['cms-images'],
    queryFn: () => apiRequest('/api/cms/images'),
  });

  const handleLogout = () => {
    localStorage.removeItem('cms_user');
    navigate('/cms/login');
  };

  const handleEditPost = (post: ClientPost) => {
    // Ensure content is properly set for the editor
    setEditingPost({
      ...post,
      content: post.content || ''
    });
    setIsCreating(false);
  };

  const handleCreatePost = () => {
    setEditingPost({
      id: 0,
      title: '',
      slug: '',
      metaTitle: '',
      metaDescription: '',
      canonicalUrl: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      featuredImageAlt: '',
      author: currentUser?.username || '',
      status: 'draft',
      ctaType: 'consultation',
      category: '',
      tags: [],
      targetKeywords: [],
      readingTime: 5,
      views: 0,
      leads: 0,
      shares: 0,
      publishedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setIsCreating(true);
  };

  // Create/Update post mutation
  const postMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/cms/posts', {
      method: editingPost?.id ? 'PUT' : 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts/database/all'] });
      setEditingPost(null);
      setIsCreating(false);
      toast({
        title: "Success",
        description: `Post ${editingPost?.id ? 'updated' : 'created'} successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save post",
        variant: "destructive",
      });
    }
  });

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => 
      apiRequest(`/api/cms/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts/database/all'] });
      toast({
        title: "Success",
        description: "Post updated successfully",
      });
    }
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/cms/posts/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts/database/all'] });
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    }
  });

  const handleSavePost = (formData: FormData) => {
    const data = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      metaTitle: (formData.get('metaTitle') as string) || undefined,
      metaDescription: (formData.get('metaDescription') as string) || undefined,
      canonicalUrl: (formData.get('canonicalUrl') as string) || undefined,
      excerpt: (formData.get('excerpt') as string) || undefined,
      content: formData.get('content') as string,
      featuredImage: (formData.get('featuredImage') as string) || null,
      featuredImageAlt: (formData.get('featuredImageAlt') as string) || undefined,
      author: formData.get('author') as string,
      status: formData.get('status') as string,
      ctaType: formData.get('ctaType') as string,
      category: formData.get('category') as string,
      tags: ((formData.get('tags') as string) || '').split(',').map(tag => tag.trim()).filter(Boolean),
      targetKeywords: ((formData.get('targetKeywords') as string) || '').split(',').map(kw => kw.trim()).filter(Boolean),
      readingTime: parseInt((formData.get('readingTime') as string) || '5'),
    };

    if (editingPost?.id) {
      updatePostMutation.mutate({ id: editingPost.id, data });
    } else {
      postMutation.mutate(data);
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Content Management System</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <Button
            variant={activeTab === 'posts' ? 'default' : 'outline'}
            onClick={() => setActiveTab('posts')}
          >
            <Edit className="h-4 w-4 mr-2" />
            Posts
          </Button>
          <Button
            variant={activeTab === 'images' ? 'default' : 'outline'}
            onClick={() => setActiveTab('images')}
          >
            <Image className="h-4 w-4 mr-2" />
            Images
          </Button>
          <Button
            variant={activeTab === 'analytics' ? 'default' : 'outline'}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button
            variant={activeTab === 'google-analytics' ? 'default' : 'outline'}
            onClick={() => setActiveTab('google-analytics')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Google Analytics
          </Button>
        </div>

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Blog Posts</h2>
              <Button onClick={handleCreatePost}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Post
              </Button>
            </div>

            {postsLoading ? (
              <div className="text-white">Loading posts...</div>
            ) : (
              <div className="grid gap-4">
                {posts.map((post) => (
                  <Card key={post.id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-white">{post.title}</CardTitle>
                          <CardDescription className="text-gray-400">
                            {post.status === 'published' ? 'Published' : 'Draft'} • {post.views} views
                          </CardDescription>
                          {post.status === 'published' && (!post.metaTitle || !post.metaDescription || !post.featuredImage) && (
                            <div className="flex gap-2 mt-2">
                              {!post.metaTitle && <Badge variant="destructive" className="text-xs">Missing Meta Title</Badge>}
                              {!post.metaDescription && <Badge variant="destructive" className="text-xs">Missing Meta Description</Badge>}
                              {!post.featuredImage && <Badge variant="destructive" className="text-xs">Missing Featured Image</Badge>}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPreviewPost(post)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPost(post)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deletePostMutation.mutate(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-gray-300 text-sm line-clamp-2">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <>{children}</>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            em: ({ children }) => <em className="italic">{children}</em>,
                            code: ({ children }) => <code className="bg-gray-800 px-1 py-0.5 rounded text-xs">{children}</code>,
                            a: ({ children }) => <span className="text-blue-400">{children}</span>
                          }}
                        >
                          {post.excerpt || ''}
                        </ReactMarkdown>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary">{post.category}</Badge>
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Image Library</h2>
              <div className="flex gap-2">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    const formData = new FormData();
                    formData.append('image', file);
                    formData.append('altText', file.name.split('.')[0].replace(/-|_/g, ' '));
                    
                    try {
                      const response = await fetch('/api/cms/images/upload', {
                        method: 'POST',
                        body: formData,
                      });
                      
                      if (response.ok) {
                        queryClient.invalidateQueries({ queryKey: ['cms-images'] });
                        toast({
                          title: "Success",
                          description: "Image uploaded successfully",
                        });
                      }
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to upload image",
                        variant: "destructive",
                      });
                    }
                  }}
                />
                <Button
                  onClick={() => document.getElementById('imageUpload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>
            
            {imagesLoading ? (
              <div className="text-white">Loading images...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image) => (
                  <Card 
                    key={image.id} 
                    className="bg-gray-800 border-gray-700 cursor-pointer transition-all hover:border-accent"
                    onClick={() => {
                      // Copy URL to clipboard
                      navigator.clipboard.writeText(image.url);
                      setCopiedImageUrl(image.url);
                      setTimeout(() => setCopiedImageUrl(null), 2000);
                      toast({
                        title: "Copied!",
                        description: "Image URL copied to clipboard",
                      });
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="relative">
                        <img
                          src={image.url}
                          alt={image.altText || image.filename}
                          className="w-full h-40 object-cover rounded mb-2"
                        />
                        {copiedImageUrl === image.url && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                            <Check className="h-8 w-8 text-green-400" />
                          </div>
                        )}
                      </div>
                      <p className="text-white text-sm font-medium truncate">{image.filename}</p>
                      <p className="text-gray-400 text-xs truncate">{image.altText || 'No alt text'}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-gray-500 text-xs">
                          {(image.size / 1024).toFixed(1)} KB
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(image.url);
                            setCopiedImageUrl(image.url);
                            setTimeout(() => setCopiedImageUrl(null), 2000);
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && <AnalyticsDashboard />}

        {/* Google Analytics Tab */}
        {activeTab === 'google-analytics' && <GoogleAnalyticsDashboard />}

        {/* Edit/Create Post Modal */}
        {editingPost && (
          <PostEditor
            post={editingPost}
            isCreating={isCreating}
            onSave={handleSavePost}
            onCancel={() => {
              setEditingPost(null);
              setIsCreating(false);
            }}
          />
        )}

        {/* Post Preview Modal */}
        {previewPost && (
          <PostPreview
            post={previewPost}
            isOpen={!!previewPost}
            onClose={() => setPreviewPost(null)}
          />
        )}
      </div>
    </div>
  );
}