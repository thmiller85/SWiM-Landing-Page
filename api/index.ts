import express, { type Request, Response, NextFunction } from "express";
import { storage } from "../server/storage";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic API endpoints for deployment
app.get('/api/blog/posts', async (req, res) => {
  try {
    const posts = await storage.getPublishedPosts();
    const convertedPosts = posts.map(post => storage.convertToClientFormat(post));
    res.json(convertedPosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.get('/api/blog/posts/:slug', async (req, res) => {
  try {
    const post = await storage.getPostBySlug(req.params.slug);
    if (!post || post.status !== 'published') {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const convertedPost = storage.convertToClientFormat(post);
    res.json(convertedPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../client/dist/index.html');
  res.sendFile(indexPath);
});

export default app;