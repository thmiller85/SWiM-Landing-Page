// Serverless function for blog posts API
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq, desc, asc, like, or } from 'drizzle-orm';
import * as schema from '../../shared/schema.js';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check authentication
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token !== 'admin123') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    if (req.method === 'GET') {
      const posts = await db
        .select()
        .from(schema.blogPosts)
        .orderBy(desc(schema.blogPosts.createdAt));
      
      res.status(200).json(posts);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}