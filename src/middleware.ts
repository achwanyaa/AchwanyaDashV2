import { createClient } from '@supabase/ssr'
import { NextResponse, NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const origin = request.nextUrl.origin

  // Create Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set(name, value)
        },
        remove(name: string, options: any) {
          request.cookies.delete(name)
        },
      },
    }
  )

  // Get user session
  const { data: { session } } = await supabase.auth.getSession()

  // Public routes
  if (pathname.startsWith('/api/track-view') || pathname.startsWith('/api/leads')) {
    return NextResponse.next()
  }

  // Login page logic
  if (pathname === '/login') {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', origin))
    }
    return NextResponse.next()
  }

  // Dashboard routes - must be logged in
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', origin))
    }
    return NextResponse.next()
  }

  // Admin routes - must be logged in AND be admin
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', origin))
    }
    
    const adminUserId = process.env.NEXT_PUBLIC_ADMIN_USER_ID
    if (session.user.id !== adminUserId) {
      return NextResponse.redirect(new URL('/dashboard', origin))
    }
    
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login']
}
