import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../../../server/storage'

// Admin authentication middleware
function requireAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || authHeader !== 'Bearer admin123') {
    return false
  }
  return true
}

export async function GET(request: NextRequest) {
  try {
    if (!requireAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posts = await storage.getBlogPosts({ status: 'all', limit: 100 })
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching admin blog posts:', error)
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
  }
}