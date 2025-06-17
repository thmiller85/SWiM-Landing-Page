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
import { Post, Image as ImageType } from '@shared/schema';

export default function CMSDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'images' | 'analytics'>('posts');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
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
  const { data: posts = [], isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ['cms-posts'],
    queryFn: () => apiRequest('/api/cms/posts'),
  });

  // Fetch images
  const { data: images = [], isLoading: imagesLoading } = useQuery<ImageType[]>({
    queryKey: ['cms-images'],
    queryFn: () => apiRequest('/api/cms/images'),
  });

  const handleLogout = () => {
    localStorage.removeItem('cms_user');
    navigate('/cms/login');
  };

  const handleEditPost = (post: Post) => {
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
      readingTime: 0,
      views: 0,
      leads: 0,
      shares: 0,
      publishedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Post);
    setIsCreating(true);
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Content Management System</h1>
            <p className="text-white/80">Welcome back, {currentUser.username}</p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => navigate('/')} 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Site
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          <Button
            onClick={() => setActiveTab('posts')}
            variant={activeTab === 'posts' ? 'default' : 'outline'}
            className={activeTab === 'posts' ? 'bg-accent' : 'border-white/20 text-white hover:bg-white/10'}
          >
            Posts
          </Button>
          <Button
            onClick={() => setActiveTab('images')}
            variant={activeTab === 'images' ? 'default' : 'outline'}
            className={activeTab === 'images' ? 'bg-accent' : 'border-white/20 text-white hover:bg-white/10'}
          >
            <Image className="h-4 w-4 mr-2" />
            Images
          </Button>
          <Button
            onClick={() => setActiveTab('analytics')}
            variant={activeTab === 'analytics' ? 'default' : 'outline'}
            className={activeTab === 'analytics' ? 'bg-accent' : 'border-white/20 text-white hover:bg-white/10'}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>

        {/* Content Area */}
        {activeTab === 'posts' && (
          <PostsTab 
            posts={posts}
            postsLoading={postsLoading}
            editingPost={editingPost}
            isCreating={isCreating}
            onEditPost={handleEditPost}
            onCreatePost={handleCreatePost}
            onCancelEdit={() => setEditingPost(null)}
            images={images}
          />
        )}

        {activeTab === 'images' && (
          <ImagesTab images={images} imagesLoading={imagesLoading} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab posts={posts} />
        )}
      </div>
    </div>
  );
}

// Posts Tab Component
function PostsTab({ 
  posts, 
  postsLoading, 
  editingPost, 
  isCreating, 
  onEditPost, 
  onCreatePost, 
  onCancelEdit,
  images 
}: { 
  posts: Post[];
  postsLoading: boolean;
  editingPost: Post | null;
  isCreating: boolean;
  onEditPost: (post: Post) => void;
  onCreatePost: () => void;
  onCancelEdit: () => void;
  images: ImageType[];
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/cms/posts', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }),
    onSuccess: () => {
      toast({ title: 'Post created successfully!' });
      queryClient.invalidateQueries({ queryKey: ['cms-posts'] });
      onCancelEdit();
    },
    onError: (error: any) => {
      toast({ title: 'Failed to create post', description: error.message, variant: 'destructive' });
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest(`/api/cms/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      }),
    onSuccess: () => {
      toast({ title: 'Post updated successfully!' });
      queryClient.invalidateQueries({ queryKey: ['cms-posts'] });
      onCancelEdit();
    },
    onError: (error: any) => {
      toast({ title: 'Failed to update post', description: error.message, variant: 'destructive' });
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/cms/posts/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast({ title: 'Post deleted successfully!' });
      queryClient.invalidateQueries({ queryKey: ['cms-posts'] });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to delete post', description: error.message, variant: 'destructive' });
    }
  });

  if (editingPost) {
    return (
      <PostEditor
        post={editingPost}
        isCreating={isCreating}
        images={images}
        onSave={(data) => {
          if (isCreating) {
            createPostMutation.mutate(data);
          } else {
            updatePostMutation.mutate({ id: editingPost.id, data });
          }
        }}
        onCancel={onCancelEdit}
        isSaving={createPostMutation.isPending || updatePostMutation.isPending}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Blog Posts</h2>
        <Button onClick={onCreatePost} className="bg-accent hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {postsLoading ? (
        <div className="text-white">Loading posts...</div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">{post.title}</CardTitle>
                    <CardDescription className="text-white/80">
                      {post.excerpt}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                      {post.status}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => onEditPost(post)}
                      className="bg-accent hover:bg-accent/90"
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
                <div className="flex justify-between text-sm text-white/60">
                  <span>By {post.author}</span>
                  <span>{post.views} views • {post.leads} leads • {post.shares} shares</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Post Editor Component
function PostEditor({ 
  post, 
  isCreating, 
  images, 
  onSave, 
  onCancel, 
  isSaving 
}: { 
  post: Post;
  isCreating: boolean;
  images: ImageType[];
  onSave: (data: any) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [formData, setFormData] = useState(post);
  const [tagsInput, setTagsInput] = useState(post.tags.join(', '));
  const [keywordsInput, setKeywordsInput] = useState(post.targetKeywords.join(', '));

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: isCreating ? generateSlug(title) : prev.slug,
      metaTitle: !prev.metaTitle || prev.metaTitle === prev.title ? title : prev.metaTitle
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSave = {
      ...formData,
      tags: tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag),
      targetKeywords: keywordsInput.split(',').map(keyword => keyword.trim()).filter(keyword => keyword),
      publishedAt: formData.status === 'published' && !formData.publishedAt ? new Date().toISOString() : formData.publishedAt
    };

    onSave(dataToSave);
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">
            {isCreating ? 'Create New Post' : 'Edit Post'}
          </CardTitle>
          <Button onClick={onCancel} variant="outline" className="border-white/20 text-white">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                placeholder="Enter post title"
                required
              />
            </div>
            <div>
              <Label className="text-white">Slug *</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                placeholder="url-friendly-slug"
                required
              />
            </div>
          </div>

          {/* Meta Information */}
          <div className="space-y-4">
            <div>
              <Label className="text-white">Meta Title</Label>
              <Input
                value={formData.metaTitle || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                placeholder="SEO title (defaults to title)"
              />
            </div>
            <div>
              <Label className="text-white">Meta Description</Label>
              <Textarea
                value={formData.metaDescription || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                placeholder="Brief description for search engines"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-white">Excerpt</Label>
              <Textarea
                value={formData.excerpt || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                placeholder="Brief excerpt for blog listing"
                rows={3}
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <Label className="text-white">Content *</Label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 min-h-[400px]"
              placeholder="Write your post content in Markdown..."
              required
            />
          </div>

          {/* Publishing Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-white">Status</Label>
              <Select value={formData.status || 'draft'} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white">Category *</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                placeholder="e.g., AI, Automation, Strategy"
                required
              />
            </div>
            <div>
              <Label className="text-white">CTA Type</Label>
              <Select value={formData.ctaType || 'consultation'} onValueChange={(value) => setFormData(prev => ({ ...prev, ctaType: value }))}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="download">Download</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="demo">Demo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <Label className="text-white">Featured Image</Label>
            <Select value={formData.featuredImage || 'none'} onValueChange={(value) => setFormData(prev => ({ ...prev, featuredImage: value === 'none' ? '' : value }))}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select an image" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No image</SelectItem>
                {images.map((image) => (
                  <SelectItem key={image.id} value={image.url || 'none'}>
                    {image.originalName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags and Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Tags</Label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                placeholder="AI, Automation, Business (comma-separated)"
              />
            </div>
            <div>
              <Label className="text-white">Target Keywords</Label>
              <Input
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                placeholder="workflow automation, AI tools (comma-separated)"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-accent hover:bg-accent/90"
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : (isCreating ? 'Create Post' : 'Update Post')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Images Tab Component
function ImagesTab({ images, imagesLoading }: { images: ImageType[]; imagesLoading: boolean }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => 
      fetch('/api/cms/images', {
        method: 'POST',
        body: formData,
      }).then(res => res.json()),
    onSuccess: () => {
      toast({ title: 'Image uploaded successfully!' });
      queryClient.invalidateQueries({ queryKey: ['cms-images'] });
      setUploading(false);
    },
    onError: (error: any) => {
      toast({ title: 'Failed to upload image', description: error.message, variant: 'destructive' });
      setUploading(false);
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('altText', file.name);

    setUploading(true);
    uploadMutation.mutate(formData);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Image Library</h2>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="image-upload"
            disabled={uploading}
          />
          <Button asChild className="bg-accent hover:bg-accent/90">
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Image'}
            </label>
          </Button>
        </div>
      </div>

      {imagesLoading ? (
        <div className="text-white">Loading images...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <Card key={image.id} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <img
                  src={image.url}
                  alt={image.altText || image.originalName}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <div className="space-y-2">
                  <h3 className="text-white font-medium truncate">{image.originalName}</h3>
                  <p className="text-white/60 text-sm">{image.altText}</p>
                  <div className="flex justify-between text-xs text-white/40">
                    <span>{(image.size / 1024).toFixed(1)} KB</span>
                    <span>{image.mimeType}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab({ posts }: { posts: Post[] }) {
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
  const totalLeads = posts.reduce((sum, post) => sum + post.leads, 0);
  const totalShares = posts.reduce((sum, post) => sum + post.shares, 0);
  const publishedPosts = posts.filter(post => post.status === 'published').length;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Analytics Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{publishedPosts}</div>
              <div className="text-white/80">Published Posts</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{totalViews}</div>
              <div className="text-white/80">Total Views</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{totalLeads}</div>
              <div className="text-white/80">Total Leads</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{totalShares}</div>
              <div className="text-white/80">Total Shares</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Post Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts
              .filter(post => post.status === 'published')
              .sort((a, b) => b.views - a.views)
              .map((post) => (
                <div key={post.id} className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">{post.title}</h3>
                    <p className="text-white/60 text-sm">{post.category}</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-white/80">{post.views} views</span>
                    <span className="text-white/80">{post.leads} leads</span>
                    <span className="text-white/80">{post.shares} shares</span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}