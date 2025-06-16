import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useParams } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Calendar,
  Upload,
  Hash,
  FileText,
  Settings,
  Trash2
} from 'lucide-react';
import { BlogPost, insertBlogPostSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { fadeIn } from '@/lib/animations';

const blogPostSchema = insertBlogPostSchema.extend({
  tags: z.array(z.string()).optional(),
  targetKeywords: z.array(z.string()).optional(),
  publishedAt: z.string().optional(),
});

type BlogPostForm = z.infer<typeof blogPostSchema>;

const AdminBlogEditor = () => {
  const params = useParams();
  const [, navigate] = useLocation();
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [driveUrlInput, setDriveUrlInput] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const isEditing = Boolean(params.id && params.id !== 'new');
  const postId = isEditing ? parseInt(params.id || '0') : null;

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ['/api/blog-posts', postId],
    queryFn: () => {
      const token = localStorage.getItem('adminToken');
      return fetch(`/api/blog-posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(res => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      });
    },
    enabled: isEditing && !!postId
  });

  const form = useForm<BlogPostForm>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      author: 'Ross Stockdale',
      status: 'draft',
      ctaType: 'consultation',
      featuredImage: '',
      seoTitle: '',
      metaDescription: '',
      downloadableResource: '',
      tags: [],
      targetKeywords: [],
    }
  });

  // Populate form when editing
  useEffect(() => {
    if (post && isEditing) {
      form.reset({
        ...post,
        tags: post.tags || [],
        targetKeywords: post.targetKeywords || [],
        publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : ''
      });
    }
  }, [post, isEditing, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: BlogPostForm) => {
      const token = localStorage.getItem('adminToken');
      const url = isEditing ? `/api/blog-posts/${postId}` : '/api/blog-posts';
      const method = isEditing ? 'PATCH' : 'POST';
      
      return fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          publishedAt: data.publishedAt ? new Date(data.publishedAt) : null
        })
      }).then(res => {
        if (!res.ok) throw new Error('Failed to save post');
        return res.json();
      });
    },
    onSuccess: (savedPost) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
      toast({
        title: isEditing ? "Post updated" : "Post created",
        description: `The blog post has been successfully ${isEditing ? 'updated' : 'created'}.`,
      });
      navigate('/admin/dashboard');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save the post. Please try again.",
        variant: "destructive",
      });
    }
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    form.setValue('title', title);
    if (!isEditing || !form.getValues('slug')) {
      form.setValue('slug', generateSlug(title));
    }
    if (!form.getValues('seoTitle')) {
      form.setValue('seoTitle', title);
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues('tags') || [];
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue('tags', [...currentTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      const currentKeywords = form.getValues('targetKeywords') || [];
      if (!currentKeywords.includes(keywordInput.trim())) {
        form.setValue('targetKeywords', [...currentKeywords, keywordInput.trim()]);
      }
      setKeywordInput('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    const currentKeywords = form.getValues('targetKeywords') || [];
    form.setValue('targetKeywords', currentKeywords.filter(keyword => keyword !== keywordToRemove));
  };

  const convertGoogleDriveUrl = (url: string): string => {
    // Extract file ID from Google Drive sharing URL
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url; // Return original if not a Google Drive URL
  };

  const handleDriveUrlConvert = () => {
    if (driveUrlInput.trim()) {
      const convertedUrl = convertGoogleDriveUrl(driveUrlInput.trim());
      form.setValue('featuredImage', convertedUrl);
      setDriveUrlInput('');
      toast({
        title: "URL Converted",
        description: "Google Drive URL has been converted and applied to the featured image field.",
      });
    }
  };

  const onSubmit = (data: BlogPostForm) => {
    saveMutation.mutate(data);
  };

  if (isLoading && isEditing) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-white/70">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="gradient-bg">
        {/* Header */}
        <header className="bg-white/5 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col gap-4">
              {/* Top row: Back button and title */}
              <div className="flex items-start gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/dashboard')}
                  className="border-white/20 text-white hover:bg-white/10 flex-shrink-0 mt-1"
                >
                  <ArrowLeft className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                </Button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-2xl font-bold text-white leading-tight">
                    {isEditing ? 'Edit Post' : 'Create New Post'}
                  </h1>
                  <p className="text-white/70 text-sm sm:text-base mt-1">
                    {isEditing ? 'Update your blog post' : 'Write and publish a new blog post'}
                  </p>
                </div>
              </div>
              
              {/* Bottom row: Action buttons */}
              <div className="flex items-center gap-2 sm:gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10 flex-shrink-0"
                  onClick={() => {
                    form.setValue('status', 'draft');
                    const formData = form.getValues();
                    saveMutation.mutate({ ...formData, status: 'draft' });
                  }}
                  disabled={saveMutation.isPending}
                >
                  <FileText className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {saveMutation.isPending ? 'Saving...' : 'Save Draft'}
                  </span>
                </Button>
                <Button
                  type="submit"
                  form="blog-post-form"
                  size="sm"
                  className="bg-accent hover:bg-accent/90 flex-shrink-0"
                  disabled={saveMutation.isPending}
                  onClick={() => form.setValue('status', 'published')}
                >
                  <Save className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {saveMutation.isPending ? 'Saving...' : isEditing ? 'Update' : 'Publish'}
                  </span>
                  <span className="sm:hidden">
                    {saveMutation.isPending ? '...' : isEditing ? 'Update' : 'Publish'}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main Editor */}
            <div className="lg:col-span-2">
              <form id="blog-post-form" onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Post Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="title" className="text-white">Title</Label>
                      <Input
                        id="title"
                        {...form.register('title')}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        placeholder="Enter post title (plain text, no # symbols)..."
                      />
                      <p className="text-white/60 text-xs mt-1">
                        Enter plain text only. The title will automatically be formatted as the page heading.
                      </p>
                      {form.formState.errors.title && (
                        <p className="text-red-400 text-sm mt-1">{form.formState.errors.title.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="slug" className="text-white">URL Slug</Label>
                      <Input
                        id="slug"
                        {...form.register('slug')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        placeholder="url-friendly-slug"
                      />
                      {form.formState.errors.slug && (
                        <p className="text-red-400 text-sm mt-1">{form.formState.errors.slug.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="excerpt" className="text-white">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        {...form.register('excerpt')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        placeholder="Brief description of the post..."
                        rows={3}
                      />
                      {form.formState.errors.excerpt && (
                        <p className="text-red-400 text-sm mt-1">{form.formState.errors.excerpt.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="content" className="text-white">Content</Label>
                      <Textarea
                        id="content"
                        {...form.register('content')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        placeholder="Start with your introduction paragraph. Use ## for sections, ### for subsections. See formatting guide for details..."
                        rows={20}
                      />
                      <p className="text-white/60 text-xs mt-1">
                        Use markdown formatting: ## for sections, **bold text**, *italic text*, [links](url), `code`, and ```code blocks```. 
                        <span className="text-accent">See BLOG_FORMATTING_GUIDE.md for SEO best practices.</span>
                      </p>
                      {form.formState.errors.content && (
                        <p className="text-red-400 text-sm mt-1">{form.formState.errors.content.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Post Settings */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Status</Label>
                    <Select
                      value={form.watch('status')}
                      onValueChange={(value) => form.setValue('status', value as any)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Category</Label>
                    <Select
                      value={form.watch('category')}
                      onValueChange={(value) => form.setValue('category', value)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Workflow Automation">Workflow Automation</SelectItem>
                        <SelectItem value="AI Solutions">AI Solutions</SelectItem>
                        <SelectItem value="SaaS Development">SaaS Development</SelectItem>
                        <SelectItem value="Business Intelligence">Business Intelligence</SelectItem>
                        <SelectItem value="Digital Transformation">Digital Transformation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Author</Label>
                    <Select
                      value={form.watch('author')}
                      onValueChange={(value) => form.setValue('author', value)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tom Miller">Tom Miller, Chief Product Officer</SelectItem>
                        <SelectItem value="Ross Stockdale">Ross Stockdale, Chief Marketing Officer</SelectItem>
                        <SelectItem value="Steve Wurster">Steve Wurster, Chief Growth Officer</SelectItem>
                        <SelectItem value="David Stockdale">David Stockdale, Chief Technology Officer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Call-to-Action</Label>
                    <Select
                      value={form.watch('ctaType') || 'consultation'}
                      onValueChange={(value) => form.setValue('ctaType', value as any)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Schedule Consultation</SelectItem>
                        <SelectItem value="download">Download Resource</SelectItem>
                        <SelectItem value="demo">Request Demo</SelectItem>
                        <SelectItem value="newsletter">Subscribe Newsletter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {form.watch('status') === 'scheduled' && (
                    <div>
                      <Label className="text-white">Publish Date</Label>
                      <Input
                        type="date"
                        {...form.register('publishedAt')}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* SEO */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">SEO Title</Label>
                    <Input
                      {...form.register('seoTitle')}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="SEO optimized title..."
                    />
                  </div>

                  <div>
                    <Label className="text-white">Meta Description</Label>
                    <Textarea
                      {...form.register('metaDescription')}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="Meta description for search engines..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="text-white">Google Drive URL Converter</Label>
                    <div className="flex gap-2 mb-3">
                      <Input
                        value={driveUrlInput}
                        onChange={(e) => setDriveUrlInput(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        placeholder="Paste Google Drive sharing URL here..."
                      />
                      <Button 
                        type="button" 
                        onClick={handleDriveUrlConvert}
                        size="sm"
                        className="bg-accent hover:bg-accent/90 text-white"
                        disabled={!driveUrlInput.trim()}
                      >
                        Convert
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">Featured Image URL</Label>
                    <Input
                      {...form.register('featuredImage')}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="https://drive.google.com/uc?export=view&id=YOUR_FILE_ID"
                    />
                    <div className="text-white/60 text-xs mt-2 space-y-1">
                      <p><strong>Tip:</strong> Use the converter above for Google Drive images</p>
                      <p>Or paste any direct image URL (Google Drive, Imgur, etc.)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="Add tag..."
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Hash className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(form.watch('tags') || []).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-accent/30 text-accent bg-accent/10"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:text-red-400"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Target Keywords */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Target Keywords</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="Add keyword..."
                    />
                    <Button type="button" onClick={addKeyword} size="sm">
                      +
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(form.watch('targetKeywords') || []).map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-highlight/30 text-highlight bg-highlight/10"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(keyword)}
                          className="ml-2 hover:text-red-400"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogEditor;