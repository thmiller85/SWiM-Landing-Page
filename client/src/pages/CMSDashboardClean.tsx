import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Plus, Edit, Trash2, Image, Save, Eye, BarChart3, Upload, X } from 'lucide-react';

// Client-only types to avoid server-side imports
interface ClientPost {
  id: number;
  title: string;
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
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
  const [activeTab, setActiveTab] = useState<'posts' | 'images' | 'analytics'>('posts');
  const [editingPost, setEditingPost] = useState<ClientPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);

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
    setEditingPost(post);
    setIsCreating(false);
  };

  const handleCreatePost = () => {
    setEditingPost({
      id: 0,
      title: '',
      slug: '',
      metaTitle: '',
      metaDescription: '',
      excerpt: '',
      content: '',
      featuredImage: '',
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
      title: formData.get('title'),
      slug: formData.get('slug'),
      metaTitle: formData.get('metaTitle'),
      metaDescription: formData.get('metaDescription'),
      excerpt: formData.get('excerpt'),
      content: formData.get('content'),
      featuredImage: formData.get('featuredImage'),
      author: formData.get('author'),
      status: formData.get('status'),
      ctaType: formData.get('ctaType'),
      category: formData.get('category'),
      tags: JSON.parse(formData.get('tags') as string || '[]'),
      targetKeywords: JSON.parse(formData.get('targetKeywords') as string || '[]'),
      readingTime: parseInt(formData.get('readingTime') as string || '5'),
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
                        <div>
                          <CardTitle className="text-white">{post.title}</CardTitle>
                          <CardDescription className="text-gray-400">
                            {post.status === 'published' ? 'Published' : 'Draft'} • {post.views} views
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
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
                      <p className="text-gray-300 text-sm">{post.excerpt}</p>
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
            <h2 className="text-2xl font-semibold text-white">Image Library</h2>
            {imagesLoading ? (
              <div className="text-white">Loading images...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image) => (
                  <Card key={image.id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <img
                        src={image.url}
                        alt={image.altText || image.filename}
                        className="w-full h-40 object-cover rounded mb-2"
                      />
                      <p className="text-white text-sm font-medium">{image.filename}</p>
                      <p className="text-gray-400 text-xs">{image.altText}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Analytics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Total Posts</h3>
                  <p className="text-3xl font-bold text-accent">{posts.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Total Views</h3>
                  <p className="text-3xl font-bold text-accent">
                    {posts.reduce((sum, post) => sum + post.views, 0)}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Total Leads</h3>
                  <p className="text-3xl font-bold text-accent">
                    {posts.reduce((sum, post) => sum + post.leads, 0)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Edit/Create Post Modal */}
        {editingPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="bg-gray-800 border-gray-700 w-full max-w-4xl max-h-screen overflow-y-auto m-4">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">
                    {isCreating ? 'Create New Post' : 'Edit Post'}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingPost(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    handleSavePost(formData);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title" className="text-white">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        defaultValue={editingPost.title}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug" className="text-white">Slug</Label>
                      <Input
                        id="slug"
                        name="slug"
                        defaultValue={editingPost.slug}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="content" className="text-white">Content</Label>
                    <Textarea
                      id="content"
                      name="content"
                      defaultValue={editingPost.content}
                      className="bg-gray-700 border-gray-600 text-white h-32"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status" className="text-white">Status</Label>
                      <Select name="status" defaultValue={editingPost.status}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category" className="text-white">Category</Label>
                      <Input
                        id="category"
                        name="category"
                        defaultValue={editingPost.category}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingPost(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Save Post
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}