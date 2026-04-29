import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AFFILIATE_COOKIE_NAME = "inv_affiliate";
const AFFILIATE_ID_REGEX = /^[A-Z0-9]{12}$/;

function setAffiliateCookie(response: NextResponse, affiliateId: string): void {
  response.cookies.set({
    name: AFFILIATE_COOKIE_NAME,
    value: affiliateId,
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
  });
}

function tryAffiliateRewrite(
  request: NextRequest,
  affiliateId: string,
): NextResponse | null {
  const normalized = affiliateId.trim().toUpperCase();
  if (normalized && AFFILIATE_ID_REGEX.test(normalized)) {
    const response = NextResponse.rewrite(new URL(`/invitation`, request.url));
    setAffiliateCookie(response, normalized);
    return response;
  }
  return null;
}

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  const isInvitationSubdomain = hostname.startsWith('invitation.');
  const isInvitationPath = pathname.startsWith('/invitation');

  // Early exit: not an invitation subdomain and not an invitation path
  if (!isInvitationSubdomain && !isInvitationPath) {
    return NextResponse.next();
  }

  if (isInvitationPath) {
    // /invitation/ABCDEF123456 -> affiliate rewrite
    const segments = pathname.split("/").filter(Boolean);
    const maybeAffiliateId =
      segments.length === 2 && segments[0] === "invitation" ? segments[1] : "";
    const affiliate = tryAffiliateRewrite(request, maybeAffiliateId);
    if (affiliate) return affiliate;

    return NextResponse.next();
  }

  // Invitation subdomain logic
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // If already /invitation, don't rewrite
  if (pathname.startsWith('/invitation')) {
    return NextResponse.next();
  }

  // Subdomain affiliate rewrite: e.g. 000000000000.invitation.activid.id
  const segments = pathname.split("/").filter(Boolean);
  const maybeAffiliateId = segments.length === 1 ? segments[0] : "";
  const affiliate = tryAffiliateRewrite(request, maybeAffiliateId);
  if (affiliate) return affiliate;

  // Rewrite to /invitation/path for template slug routing
  return NextResponse.rewrite(new URL(`/invitation${pathname}`, request.url));
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
