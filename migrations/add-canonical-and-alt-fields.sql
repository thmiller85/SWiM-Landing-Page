-- Add canonical URL and featured image alt text fields to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS canonical_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS featured_image_alt VARCHAR(255);