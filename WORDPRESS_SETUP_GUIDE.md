# WordPress CMS Integration Guide

## Overview

This project has been migrated from a custom CMS to use WordPress as the backend content management system. The React/Vite frontend now fetches blog posts directly from WordPress via the REST API, providing a more powerful and user-friendly content management experience.

## WordPress Setup Requirements

### 1. WordPress Installation

You'll need a WordPress installation with the following requirements:
- WordPress 5.0+ (for Gutenberg block editor)
- SSL certificate (HTTPS required for REST API)
- PHP 7.4+ recommended

### 2. Required WordPress Plugins

#### Essential Plugins:
1. **Yoast SEO** - For SEO optimization and meta data
2. **WP REST API** - Enhanced REST API functionality (usually built-in)
3. **JWT Authentication for WP REST API** - For secure API access (if needed)

#### Recommended Plugins:
1. **Advanced Custom Fields (ACF)** - For custom post fields
2. **WP Statistics** - For analytics tracking
3. **Custom Post Type UI** - If you need custom post types

### 3. WordPress Configuration

#### Enable REST API
The WordPress REST API is enabled by default. Verify it works by visiting:
```
https://your-wordpress-site.com/wp-json/wp/v2/posts
```

#### Configure Permalinks
Go to **Settings > Permalinks** and set to "Post name" structure for clean URLs.

## Frontend Configuration

### Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# WordPress Configuration
VITE_WORDPRESS_URL=https://your-wordpress-site.com
VITE_WORDPRESS_API_KEY=your-api-key-if-needed

# Optional: For private posts or admin features
VITE_WORDPRESS_USERNAME=your-username
VITE_WORDPRESS_PASSWORD=your-app-password
```

### WordPress REST API Endpoints Used

The application uses these WordPress REST API endpoints:

#### Public Endpoints:
- `GET /wp-json/wp/v2/posts` - Fetch all posts
- `GET /wp-json/wp/v2/posts?slug={slug}` - Fetch post by slug
- `GET /wp-json/wp/v2/categories` - Fetch categories
- `GET /wp-json/wp/v2/tags` - Fetch tags

#### Custom Analytics Endpoints (Optional):
- `POST /wp-json/custom/v1/track-view/{post-id}` - Track post views
- `POST /wp-json/custom/v1/track-lead/{post-id}` - Track lead generation
- `POST /wp-json/custom/v1/track-share/{post-id}` - Track social shares

## Custom Fields Setup (Optional)

To enhance the blog posts with additional metadata, set up these custom fields in WordPress:

### Using Advanced Custom Fields (ACF):

1. **CTA Type** (Select field)
   - Field Name: `cta_type`
   - Choices: consultation, download, newsletter, demo
   - Default: consultation

2. **Downloadable Resource** (Text field)
   - Field Name: `downloadable_resource`
   - Description: URL to downloadable resource for lead magnets

3. **Analytics Fields** (Number fields)
   - `views` - Post view count
   - `leads` - Lead generation count
   - `shares` - Social share count

## Content Management Workflow

### Creating Blog Posts

1. **Login to WordPress Admin**
   - Go to `https://your-wordpress-site.com/wp-admin`

2. **Create New Post**
   - Navigate to **Posts > Add New**
   - Write your content using the Gutenberg block editor

3. **SEO Optimization** (with Yoast SEO)
   - Set focus keyword
   - Write meta description
   - Optimize title for SEO

4. **Set Featured Image**
   - Upload and set a featured image for the post
   - This will be displayed on your React frontend

5. **Configure Categories and Tags**
   - Assign appropriate categories
   - Add relevant tags for filtering

6. **Publish**
   - Set status to "Published" when ready
   - The post will immediately appear on your React frontend

### Content Best Practices

#### SEO Optimization:
- Use descriptive titles with target keywords
- Write compelling meta descriptions (150-160 characters)
- Use header tags (H1, H2, H3) to structure content
- Add alt text to all images
- Include internal and external links

#### Lead Generation:
- Include clear calls-to-action in your posts
- Use the custom CTA type field to specify the action
- For download CTAs, provide the resource URL in the custom field

## Analytics and Tracking

### WordPress Analytics
If you install a WordPress analytics plugin like WP Statistics, you can track:
- Page views
- Visitor statistics
- Popular content
- Search engine referrals

### Custom Analytics Integration
The frontend includes methods to track engagement:
- Post views (tracked automatically when posts are loaded)
- Lead generation (tracked when CTAs are clicked)
- Social shares (tracked when share buttons are used)

These require custom WordPress endpoints to be set up.

## Troubleshooting

### Common Issues:

#### CORS Errors
If you encounter CORS errors, add this to your WordPress theme's `functions.php`:

```php
function add_cors_http_header(){
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
}
add_action('init','add_cors_http_header');
```

#### REST API Not Working
1. Check if REST API is enabled: `/wp-json/wp/v2/posts`
2. Verify permalink structure is set correctly
3. Check for plugin conflicts by deactivating all plugins

#### Posts Not Showing
1. Verify posts are published (not draft)
2. Check WordPress URL in environment variables
3. Ensure no authentication is required for public posts

### Testing the Integration

1. **Verify WordPress API**:
   ```bash
   curl https://your-wordpress-site.com/wp-json/wp/v2/posts
   ```

2. **Test Frontend Connection**:
   - Create a test post in WordPress
   - Check if it appears on your React blog page
   - Verify featured images and metadata display correctly

## Security Considerations

### Public vs Private Content
- Public posts are accessible via REST API without authentication
- For private content, implement proper authentication
- Use application passwords for secure API access

### Rate Limiting
Consider implementing rate limiting for:
- API requests from your frontend
- Analytics tracking endpoints
- Contact form submissions

## Migration Checklist

- [ ] WordPress site set up with HTTPS
- [ ] Required plugins installed and configured
- [ ] Permalink structure configured
- [ ] REST API tested and working
- [ ] Environment variables configured in React app
- [ ] Custom fields set up (if using)
- [ ] Test post created and verified on frontend
- [ ] SEO plugin configured
- [ ] Analytics tracking implemented
- [ ] Content migration completed (if applicable)

## Support Resources

- [WordPress REST API Documentation](https://developer.wordpress.org/rest-api/)
- [Yoast SEO Documentation](https://yoast.com/help/)
- [Advanced Custom Fields Documentation](https://www.advancedcustomfields.com/resources/)
- [WordPress Security Best Practices](https://wordpress.org/support/article/hardening-wordpress/)