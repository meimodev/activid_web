import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AFFILIATE_COOKIE_NAME = "inv_affiliate";
const AFFILIATE_ID_REGEX = /^[A-Z0-9]{12}$/;

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // Check if the hostname is the invitation subdomain
  // Adjust 'invitation.activid.id' to match your production domain
  // Also checking 'invitation.localhost' for local development testing
  const isInvitationSubdomain = hostname.startsWith('invitation.');

  if (isInvitationSubdomain) {
    // Avoid rewriting paths that differ from the expected page routes
    // e.g., API routes, static files, Next.js internals
    if (
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/static') || // if you have a static folder
      pathname.includes('.') // file extensions
    ) {
      return NextResponse.next();
    }

    // If the path is already /invitation, don't rewrite (prevent loops if any)
    if (pathname.startsWith('/invitation')) {
        return NextResponse.next();
    }

    const segments = pathname.split("/").filter(Boolean);
    const maybeAffiliateId = segments.length === 1 ? segments[0] : "";
    if (maybeAffiliateId && AFFILIATE_ID_REGEX.test(maybeAffiliateId)) {
      const response = NextResponse.rewrite(new URL(`/invitation`, request.url));
      response.cookies.set({
        name: AFFILIATE_COOKIE_NAME,
        value: maybeAffiliateId,
        path: "/",
        sameSite: "lax",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
      });
      return response;
    }
    
    // User requested invitation.activid.id/ricci-andrini
    // Rewrite to /invitation/ricci-andrini
    // The previous flow prefix is removed here, as the template logic is now inside /invitation/[slug]
    return NextResponse.rewrite(new URL(`/invitation${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
