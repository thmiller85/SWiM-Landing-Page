import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ValidationResult {
  test: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

const WordPressValidator = () => {
  const [wordpressUrl, setWordpressUrl] = useState(import.meta.env.VITE_WORDPRESS_URL || '');
  const [isValidating, setIsValidating] = useState(false);
  const [results, setResults] = useState<ValidationResult[]>([]);

  const validateWordPress = async () => {
    setIsValidating(true);
    setResults([]);
    
    const newResults: ValidationResult[] = [];

    // Test 1: Basic URL format
    try {
      new URL(wordpressUrl);
      newResults.push({
        test: 'URL Format',
        status: 'success',
        message: 'WordPress URL format is valid'
      });
    } catch {
      newResults.push({
        test: 'URL Format',
        status: 'error',
        message: 'Invalid URL format',
        details: 'Please enter a valid URL like https://yourdomain.com'
      });
    }

    // Test 2: WordPress site accessibility
    try {
      const response = await fetch(wordpressUrl);
      if (response.ok) {
        const html = await response.text();
        if (html.includes('wp-content') || html.includes('WordPress')) {
          newResults.push({
            test: 'WordPress Site',
            status: 'success',
            message: 'WordPress site is accessible'
          });
        } else {
          newResults.push({
            test: 'WordPress Site',
            status: 'warning',
            message: 'Site accessible but may not be WordPress',
            details: 'The site responds but WordPress indicators not found'
          });
        }
      } else {
        newResults.push({
          test: 'WordPress Site',
          status: 'error',
          message: `Site returned ${response.status} error`
        });
      }
    } catch (error) {
      newResults.push({
        test: 'WordPress Site',
        status: 'error',
        message: 'Cannot access WordPress site',
        details: 'Check URL and ensure site is online'
      });
    }

    // Test 3: REST API availability
    try {
      const apiUrl = `${wordpressUrl.replace(/\/$/, '')}/wp-json/wp/v2`;
      const response = await fetch(apiUrl);
      if (response.ok) {
        newResults.push({
          test: 'REST API',
          status: 'success',
          message: 'WordPress REST API is available'
        });
      } else {
        newResults.push({
          test: 'REST API',
          status: 'error',
          message: `REST API returned ${response.status} error`,
          details: 'REST API may be disabled or URL is incorrect'
        });
      }
    } catch (error) {
      newResults.push({
        test: 'REST API',
        status: 'error',
        message: 'Cannot access REST API',
        details: 'Ensure REST API is enabled in WordPress'
      });
    }

    // Test 4: Posts endpoint
    try {
      const postsUrl = `${wordpressUrl.replace(/\/$/, '')}/wp-json/wp/v2/posts?per_page=1`;
      const response = await fetch(postsUrl);
      if (response.ok) {
        const posts = await response.json();
        if (Array.isArray(posts) && posts.length > 0) {
          newResults.push({
            test: 'Posts API',
            status: 'success',
            message: `Found ${posts.length > 0 ? 'blog posts' : 'no posts'}`,
            details: posts.length > 0 ? `Latest post: "${posts[0].title?.rendered || 'Untitled'}"` : 'Create some blog posts to test integration'
          });
        } else {
          newResults.push({
            test: 'Posts API',
            status: 'warning',
            message: 'Posts API works but no posts found',
            details: 'Create some blog posts to test full integration'
          });
        }
      } else {
        newResults.push({
          test: 'Posts API',
          status: 'error',
          message: `Posts API returned ${response.status} error`
        });
      }
    } catch (error) {
      newResults.push({
        test: 'Posts API',
        status: 'error',
        message: 'Cannot access posts endpoint'
      });
    }

    // Test 5: CORS check
    try {
      const response = await fetch(`${wordpressUrl.replace(/\/$/, '')}/wp-json/wp/v2/posts?per_page=1`, {
        method: 'GET',
        mode: 'cors'
      });
      newResults.push({
        test: 'CORS Policy',
        status: 'success',
        message: 'CORS is properly configured'
      });
    } catch (error) {
      newResults.push({
        test: 'CORS Policy',
        status: 'warning',
        message: 'CORS may need configuration',
        details: 'If you see CORS errors in production, add CORS headers to WordPress'
      });
    }

    setResults(newResults);
    setIsValidating(false);
  };

  const getStatusIcon = (status: ValidationResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: ValidationResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>WordPress Integration Validator</CardTitle>
          <CardDescription>
            Test your WordPress setup to ensure it works with your React application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="https://yourdomain.com"
              value={wordpressUrl}
              onChange={(e) => setWordpressUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={validateWordPress}
              disabled={isValidating || !wordpressUrl}
            >
              {isValidating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                'Validate Setup'
              )}
            </Button>
          </div>

          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h3 className="text-lg font-semibold">Validation Results</h3>
              
              {results.map((result, index) => (
                <motion.div
                  key={result.test}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{result.test}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-white ${getStatusColor(result.status)}`}
                      >
                        {result.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                    {result.details && (
                      <p className="text-xs text-gray-500 mt-1">{result.details}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  {results.some(r => r.status === 'error') && (
                    <li>• Fix any errors above before proceeding</li>
                  )}
                  {results.some(r => r.status === 'success') && (
                    <li>• Update your .env file with this WordPress URL</li>
                  )}
                  {results.every(r => r.status === 'success') && (
                    <li>• Your WordPress integration is ready! Check your /blog page</li>
                  )}
                  <li>• Create blog posts in WordPress to test the full integration</li>
                </ul>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WordPressValidator;