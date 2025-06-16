import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    if (password === 'swimai2024') {
      return NextResponse.json({ token: 'admin123', success: true })
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }
  } catch (error) {
    console.error('Error in admin login:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}