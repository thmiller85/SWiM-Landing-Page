import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImagePickerModal } from '@/components/ImagePickerModal';
import { SEOPreview } from '@/components/SEOPreview';
import { PostPreview } from '@/components/PostPreview';
import { useToast } from '@/hooks/use-toast';
import { X, Save, Image, AlertCircle, Check, FileText, Eye, ClipboardPaste } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '@/styles/markdown-editor.css';

interface PostEditorProps {
  post: any;
  isCreating: boolean;
  onSave: (formData: FormData) => void;
  onCancel: () => void;
}

export function PostEditor({ post, isCreating, onSave, onCancel }: PostEditorProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: post.title || '',
    slug: post.slug || '',
    metaTitle: post.metaTitle || '',
    metaDescription: post.metaDescription || '',
    canonicalUrl: post.canonicalUrl || '',
    featuredImage: post.featuredImage || '',
    featuredImageAlt: post.featuredImageAlt || '',
    author: post.author || '',
    status: post.status || 'draft',
    ctaType: post.ctaType || 'consultation',
    category: post.category || '',
    tags: post.tags?.join(', ') || '',
    targetKeywords: post.targetKeywords?.join(', ') || '',
    readingTime: post.readingTime || 5,
  });
  const [metaTitleLength, setMetaTitleLength] = useState(formData.metaTitle.length);
  const [metaDescLength, setMetaDescLength] = useState(formData.metaDescription.length);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [featuredImagePreview, setFeaturedImagePreview] = useState(formData.featuredImage);
  const [seoPreviewData, setSeoPreviewData] = useState({
    title: formData.title,
    metaTitle: formData.metaTitle,
    metaDescription: formData.metaDescription,
    slug: formData.slug,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [autoSlug, setAutoSlug] = useState(!post.slug);
  const [markdownMode, setMarkdownMode] = useState(false);
  const [content, setContent] = useState(post.content || '');
  const [showPreview, setShowPreview] = useState(false);
  const [excerpt, setExcerpt] = useState(post.excerpt || '');
  const [excerptMarkdownMode, setExcerptMarkdownMode] = useState(false);
  const [showExcerptPreview, setShowExcerptPreview] = useState(false);
  const [showPostPreview, setShowPostPreview] = useState(false);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasteMarkdown = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setContent(text);
        
        // Extract title from first H1
        const titleMatch = text.match(/^#\s+(.+)$/m);
        if (titleMatch && !formData.title) {
          const title = titleMatch[1];
          updateFormData('title', title);
          setSeoPreviewData(prev => ({ ...prev, title }));
          if (autoSlug) {
            const slug = generateSlug(title);
            updateFormData('slug', slug);
            setSeoPreviewData(prev => ({ ...prev, slug }));
          }
        }
        
        // Extract first paragraph as excerpt
        const paragraphMatch = text.match(/^(?!#|\*|-|\d\.|\[|>|```).+$/m);
        if (paragraphMatch && !excerpt) {
          setExcerpt(paragraphMatch[0].substring(0, 200) + '...');
        }
        
        toast({
          title: "Content Pasted",
          description: "Markdown content has been pasted successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Paste Failed",
        description: "Unable to paste from clipboard",
        variant: "destructive",
      });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    updateFormData('title', title);
    setSeoPreviewData(prev => ({ ...prev, title }));
    
    if (autoSlug) {
      const slug = generateSlug(title);
      updateFormData('slug', slug);
      setSeoPreviewData(prev => ({ ...prev, slug }));
    }
  };

  const validateForm = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.get('title')) newErrors.title = 'Title is required';
    if (!formData.get('slug')) newErrors.slug = 'Slug is required';
    if (!formData.get('content')) newErrors.content = 'Content is required';
    if (!formData.get('category')) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitData = new FormData();
    
    // Add all form data from state
    submitData.set('title', formData.title);
    submitData.set('slug', formData.slug);
    submitData.set('metaTitle', formData.metaTitle);
    submitData.set('metaDescription', formData.metaDescription);
    submitData.set('canonicalUrl', formData.canonicalUrl);
    submitData.set('excerpt', excerpt);
    submitData.set('content', content);
    submitData.set('featuredImage', formData.featuredImage);
    submitData.set('featuredImageAlt', formData.featuredImageAlt);
    submitData.set('author', formData.author);
    submitData.set('status', formData.status);
    submitData.set('ctaType', formData.ctaType);
    submitData.set('category', formData.category);
    submitData.set('tags', formData.tags);
    submitData.set('targetKeywords', formData.targetKeywords);
    submitData.set('readingTime', formData.readingTime.toString());
    
    if (validateForm(submitData)) {
      onSave(submitData);
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-800 border-gray-700 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="border-b border-gray-700">
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">
              {isCreating ? 'Create New Post' : 'Edit Post'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-6 py-6">
            <Tabs defaultValue="content" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">
                    Title <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    className={`bg-gray-700 border-gray-600 text-white ${errors.title ? 'border-red-500' : ''}`}
                    required
                    onChange={handleTitleChange}
                  />
                  {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <Label htmlFor="slug" className="text-white">
                    URL Slug <span className="text-red-400">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      className={`bg-gray-700 border-gray-600 text-white flex-1 ${errors.slug ? 'border-red-500' : ''}`}
                      required
                      onChange={(e) => {
                        setAutoSlug(false);
                        updateFormData('slug', e.target.value);
                        setSeoPreviewData(prev => ({ ...prev, slug: e.target.value }));
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (formData.title) {
                          const slug = generateSlug(formData.title);
                          updateFormData('slug', slug);
                          setSeoPreviewData(prev => ({ ...prev, slug }));
                        }
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                  {errors.slug && <p className="text-red-400 text-sm mt-1">{errors.slug}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="excerpt" className="text-white">Excerpt</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={excerptMarkdownMode ? "default" : "outline"}
                        onClick={() => setExcerptMarkdownMode(!excerptMarkdownMode)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {excerptMarkdownMode ? 'Markdown' : 'Simple'}
                      </Button>
                      {excerptMarkdownMode && (
                        <Button
                          type="button"
                          size="sm"
                          variant={showExcerptPreview ? "default" : "outline"}
                          onClick={() => setShowExcerptPreview(!showExcerptPreview)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {excerptMarkdownMode ? (
                    <div className={showExcerptPreview ? "grid grid-cols-2 gap-4" : ""}>
                      <div data-color-mode="dark">
                        <MDEditor
                          value={excerpt}
                          onChange={(val) => setExcerpt(val || '')}
                          preview={showExcerptPreview ? 'edit' : 'edit'}
                          height={150}
                          textareaProps={{
                            placeholder: 'Brief summary of the post (appears in post listings)\n\nSupports **markdown** formatting',
                          }}
                        />
                      </div>
                      {showExcerptPreview && (
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-y-auto max-h-[150px]">
                          <article className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {excerpt}
                            </ReactMarkdown>
                          </article>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white h-20"
                      placeholder="Brief summary of the post (appears in post listings)"
                    />
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {excerptMarkdownMode 
                      ? "Markdown formatting supported for rich text excerpts" 
                      : "Plain text mode - you can still use markdown syntax"}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="content" className="text-white">
                      Content <span className="text-red-400">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handlePasteMarkdown}
                      >
                        <ClipboardPaste className="h-4 w-4 mr-2" />
                        Paste Markdown
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={markdownMode ? "default" : "outline"}
                        onClick={() => setMarkdownMode(!markdownMode)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {markdownMode ? 'Markdown' : 'Simple'}
                      </Button>
                      {markdownMode && (
                        <Button
                          type="button"
                          size="sm"
                          variant={showPreview ? "default" : "outline"}
                          onClick={() => setShowPreview(!showPreview)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {markdownMode ? (
                    <div className={showPreview ? "grid grid-cols-2 gap-4" : ""}>
                      <div data-color-mode="dark">
                        <MDEditor
                          value={content}
                          onChange={(val) => setContent(val || '')}
                          preview={showPreview ? 'edit' : 'edit'}
                          height={400}
                          textareaProps={{
                            placeholder: 'Write your blog post in markdown...\n\n# Heading\n**Bold text**, *italic text*\n\n- List item\n- Another item\n\n[Link text](https://example.com)',
                          }}
                        />
                      </div>
                      {showPreview && (
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-y-auto max-h-[400px]">
                          <article className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {content}
                            </ReactMarkdown>
                          </article>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Textarea
                      id="content"
                      name="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className={`bg-gray-700 border-gray-600 text-white h-64 font-mono ${errors.content ? 'border-red-500' : ''}`}
                      placeholder="Paste or write your content here..."
                      required
                    />
                  )}
                  {errors.content && <p className="text-red-400 text-sm mt-1">{errors.content}</p>}
                  <p className="text-xs text-gray-400 mt-2">
                    {markdownMode 
                      ? "Full markdown support with GFM, tables, and syntax highlighting" 
                      : "Plain text mode - you can still use markdown syntax"}
                  </p>
                </div>
              </TabsContent>

              {/* SEO Tab */}
              <TabsContent value="seo" className="space-y-4">
                <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-blue-400 text-sm font-medium">SEO Best Practices</p>
                      <ul className="text-blue-300 text-xs mt-1 space-y-1">
                        <li>• Meta title: 50-60 characters</li>
                        <li>• Meta description: 150-160 characters</li>
                        <li>• Include your target keywords naturally</li>
                        <li>• Make titles compelling and click-worthy</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="metaTitle" className="text-white">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    name="metaTitle"
                    value={formData.metaTitle}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Page title for search engines (leave empty to use post title)"
                    maxLength={60}
                    onChange={(e) => {
                      updateFormData('metaTitle', e.target.value);
                      setMetaTitleLength(e.target.value.length);
                      setSeoPreviewData(prev => ({ ...prev, metaTitle: e.target.value }));
                    }}
                  />
                  <p className={`text-xs mt-1 ${metaTitleLength > 60 ? 'text-red-400' : 'text-gray-400'}`}>
                    {metaTitleLength}/60 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="metaDescription" className="text-white">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    name="metaDescription"
                    value={formData.metaDescription}
                    className="bg-gray-700 border-gray-600 text-white h-20"
                    placeholder="Page description for search engines"
                    maxLength={160}
                    onChange={(e) => {
                      updateFormData('metaDescription', e.target.value);
                      setMetaDescLength(e.target.value.length);
                      setSeoPreviewData(prev => ({ ...prev, metaDescription: e.target.value }));
                    }}
                  />
                  <p className={`text-xs mt-1 ${metaDescLength > 160 ? 'text-red-400' : 'text-gray-400'}`}>
                    {metaDescLength}/160 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="canonicalUrl" className="text-white">Canonical URL</Label>
                  <Input
                    id="canonicalUrl"
                    name="canonicalUrl"
                    value={formData.canonicalUrl}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="https://example.com/original-post (leave empty for default)"
                    onChange={(e) => updateFormData('canonicalUrl', e.target.value)}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Use this if the content exists elsewhere to avoid duplicate content issues
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tags" className="text-white">Tags</Label>
                    <Input
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="ai, marketing, automation"
                      onChange={(e) => updateFormData('tags', e.target.value)}
                    />
                    <p className="text-xs text-gray-400 mt-1">Comma-separated list</p>
                  </div>
                  <div>
                    <Label htmlFor="targetKeywords" className="text-white">Target Keywords</Label>
                    <Input
                      id="targetKeywords"
                      name="targetKeywords"
                      value={formData.targetKeywords}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="ai marketing, workflow automation"
                      onChange={(e) => updateFormData('targetKeywords', e.target.value)}
                    />
                    <p className="text-xs text-gray-400 mt-1">Keywords to optimize for</p>
                  </div>
                </div>

                {/* SEO Preview */}
                <div className="mt-6">
                  <h4 className="text-white font-medium mb-3">Search Engine Preview</h4>
                  <SEOPreview
                    title={formData.title}
                    metaTitle={formData.metaTitle}
                    metaDescription={formData.metaDescription}
                    slug={formData.slug}
                  />
                </div>
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media" className="space-y-4">
                <div>
                  <Label htmlFor="featuredImage" className="text-white">Featured Image</Label>
                  <div className="flex gap-2">
                    <Input
                      id="featuredImage"
                      name="featuredImage"
                      value={formData.featuredImage}
                      className="bg-gray-700 border-gray-600 text-white flex-1"
                      placeholder="/images/blog/image.jpg"
                      onChange={(e) => {
                        updateFormData('featuredImage', e.target.value);
                        setFeaturedImagePreview(e.target.value);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowImagePicker(true)}
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Browse
                    </Button>
                  </div>
                </div>

                {featuredImagePreview && (
                  <>
                    <div className="relative">
                      <img 
                        src={featuredImagePreview} 
                        alt="Featured image preview" 
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          updateFormData('featuredImage', '');
                          setFeaturedImagePreview('');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor="featuredImageAlt" className="text-white">Alt Text</Label>
                      <Input
                        id="featuredImageAlt"
                        name="featuredImageAlt"
                        value={formData.featuredImageAlt}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Descriptive text for accessibility and SEO"
                        onChange={(e) => updateFormData('featuredImageAlt', e.target.value)}
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Describe what's in the image for screen readers
                      </p>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status" className="text-white">Status</Label>
                    <Select name="status" value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
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
                    <Label htmlFor="author" className="text-white">Author</Label>
                    <Input
                      id="author"
                      name="author"
                      value={formData.author}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                      onChange={(e) => updateFormData('author', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-white">
                      Category <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      className={`bg-gray-700 border-gray-600 text-white ${errors.category ? 'border-red-500' : ''}`}
                      required
                      placeholder="e.g., AI Tools, Marketing"
                      onChange={(e) => updateFormData('category', e.target.value)}
                    />
                    {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
                  </div>
                  <div>
                    <Label htmlFor="ctaType" className="text-white">Call-to-Action Type</Label>
                    <Select name="ctaType" value={formData.ctaType} onValueChange={(value) => updateFormData('ctaType', value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Free Consultation</SelectItem>
                        <SelectItem value="download">Download Resource</SelectItem>
                        <SelectItem value="newsletter">Newsletter Signup</SelectItem>
                        <SelectItem value="demo">Book a Demo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="readingTime" className="text-white">Reading Time (minutes)</Label>
                  <Input
                    id="readingTime"
                    name="readingTime"
                    type="number"
                    value={formData.readingTime}
                    className="bg-gray-700 border-gray-600 text-white"
                    min="1"
                    onChange={(e) => updateFormData('readingTime', parseInt(e.target.value) || 5)}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Estimated time to read the post
                  </p>
                </div>

                {/* Publishing checklist */}
                <div className="mt-6">
                  <h4 className="text-white font-medium mb-3">Publishing Checklist</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {formData.title ? <Check className="h-4 w-4 text-green-400" /> : <X className="h-4 w-4 text-gray-400" />}
                      <span className={formData.title ? "text-green-400" : "text-gray-400"}>Title added</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {content ? <Check className="h-4 w-4 text-green-400" /> : <X className="h-4 w-4 text-gray-400" />}
                      <span className={content ? "text-green-400" : "text-gray-400"}>Content written</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.featuredImage ? <Check className="h-4 w-4 text-green-400" /> : <X className="h-4 w-4 text-gray-400" />}
                      <span className={formData.featuredImage ? "text-green-400" : "text-gray-400"}>Featured image added</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.metaDescription ? <Check className="h-4 w-4 text-green-400" /> : <X className="h-4 w-4 text-gray-400" />}
                      <span className={formData.metaDescription ? "text-green-400" : "text-gray-400"}>Meta description added</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.tags.trim().length > 0 ? <Check className="h-4 w-4 text-green-400" /> : <X className="h-4 w-4 text-gray-400" />}
                      <span className={formData.tags.trim().length > 0 ? "text-green-400" : "text-gray-400"}>Tags added</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Form Actions */}
            <div className="flex justify-between pt-4 border-t border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPostPreview(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Post
              </Button>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {isCreating ? 'Create Post' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Image Picker Modal */}
      <ImagePickerModal
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={(imageUrl) => {
          updateFormData('featuredImage', imageUrl);
          setFeaturedImagePreview(imageUrl);
          setShowImagePicker(false);
          toast({
            title: "Image Selected",
            description: "Featured image has been set",
          });
        }}
        currentImage={post.featuredImage}
      />

      {/* Post Preview Modal */}
      {showPostPreview && (
        <PostPreview
          post={{
            title: formData.title,
            slug: formData.slug,
            metaTitle: formData.metaTitle,
            metaDescription: formData.metaDescription,
            excerpt: excerpt,
            content: content,
            featuredImage: formData.featuredImage,
            featuredImageAlt: formData.featuredImageAlt,
            author: formData.author,
            category: formData.category,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            readingTime: formData.readingTime,
            status: formData.status,
            ctaType: formData.ctaType,
            publishedAt: post.publishedAt || new Date(),
          }}
          isOpen={showPostPreview}
          onClose={() => setShowPostPreview(false)}
        />
      )}
    </div>
  );
}