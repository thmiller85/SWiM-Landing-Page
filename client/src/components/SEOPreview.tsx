import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';

interface SEOPreviewProps {
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  slug: string;
  baseUrl?: string;
}

export function SEOPreview({ 
  title, 
  metaTitle, 
  metaDescription, 
  slug, 
  baseUrl = 'https://swim-ai.com' 
}: SEOPreviewProps) {
  const displayTitle = metaTitle || title || 'Untitled Post';
  const displayDescription = metaDescription || 'No description provided';
  const displayUrl = `${baseUrl}/blog/${slug || 'untitled'}`;

  // Truncate title and description to Google's typical display limits
  const truncatedTitle = displayTitle.length > 60 
    ? displayTitle.substring(0, 57) + '...' 
    : displayTitle;
  
  const truncatedDescription = displayDescription.length > 160 
    ? displayDescription.substring(0, 157) + '...' 
    : displayDescription;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white text-sm flex items-center gap-2">
          <Globe className="h-4 w-4" />
          SEO Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-xs text-green-600">{displayUrl}</div>
          <h3 className="text-blue-500 text-lg font-medium hover:underline cursor-pointer">
            {truncatedTitle}
          </h3>
          <p className="text-gray-400 text-sm">
            {truncatedDescription}
          </p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            This is how your post might appear in Google search results. 
            {metaTitle && metaTitle.length > 60 && (
              <span className="text-yellow-500"> Title is too long.</span>
            )}
            {metaDescription && metaDescription.length > 160 && (
              <span className="text-yellow-500"> Description is too long.</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}