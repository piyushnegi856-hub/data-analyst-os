import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // If user is accessing a protected route (anything other than /onboarding)
  if (!request.nextUrl.pathname.startsWith('/onboarding') && 
      !request.nextUrl.pathname.startsWith('/_next') && 
      !request.nextUrl.pathname.startsWith('/api') &&
      !request.nextUrl.pathname.includes('.')) {
        
    const hasStarted = request.cookies.has('sprint_started');
    
    if (!hasStarted) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  // If user is accessing onboarding but already started, redirect to dashboard
  if (request.nextUrl.pathname.startsWith('/onboarding')) {
    if (request.cookies.has('sprint_started')) {
       return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
