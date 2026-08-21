import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const cookie = request.cookies.get('currentUser')?.value
  const isProtectedPath = request.nextUrl.pathname.startsWith('/chat')

  if (isProtectedPath && !cookie) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/chat/:path*'],
}
