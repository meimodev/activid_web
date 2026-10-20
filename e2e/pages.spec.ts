import { test, expect } from '@playwright/test';

// Main marketing-site routes (app/(main)). Keep in sync when adding pages.
const ROUTES = [
  '/',
  '/about',
  '/services',
  '/services/social-media',
  '/services/event-documentation',
  '/services/product-photography',
  '/services/website-app',
  '/services/video-podcast',
  '/project',
  '/work',
  '/contact',
  '/privacy',
  '/privacy-loit',
  '/terms',
  '/account-deletion',
];

// ADR-0009 merged branding into Social Media Management and retired this URL.
test('retired branding service remains unavailable', async ({ page }) => {
  const response = await page.goto('/services/branding');
  expect(response?.status()).toBe(404);
});

test('product fonts load from this site', async ({ page }) => {
  const externalFontRequests: string[] = [];
  page.on('request', (request) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(request.url())) externalFontRequests.push(request.url());
  });
  // These pages exercise local fonts without requiring Firebase credentials in CI.
  for (const path of ['/loit', '/satset']) {
    const fonts: number[] = [];
    const capture = (response: import('@playwright/test').Response) => {
      if (response.request().resourceType() === 'font' && response.url().includes('/_next/static/media/')) fonts.push(response.status());
    };
    page.on('response', capture);
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response?.status(), path).toBe(200);
    await page.evaluate(async () => { await document.fonts.ready; });
    expect(fonts.length, `self-hosted fonts on ${path}`).toBeGreaterThan(0);
    expect(fonts.every((status) => status === 200), `font responses on ${path}`).toBe(true);
    page.off('response', capture);
  }
  expect(externalFontRequests).toEqual([]);
});

for (const path of ROUTES) {
  test(`renders ${path}`, async ({ page }) => {
    // Uncaught JS exceptions only — the signal that a render actually broke.
    // Console 'error' is intentionally ignored: real pages emit benign
    // third-party network noise (analytics/beacon ERR_CONNECTION_REFUSED)
    // that is environment-dependent and would make this flaky.
    const pageErrors: string[] = [];
    page.on('pageerror', (e) => pageErrors.push(e.message));

    const res = await page.goto(path, { waitUntil: 'domcontentloaded' });

    expect(res, 'no response').not.toBeNull();
    expect(res!.status(), `HTTP status for ${path}`).toBeLessThan(400);
    // rendered = body actually has DOM children (CSS-agnostic; body starts
    // opacity/visibility-animated so toBeVisible would false-negative)
    const childCount = await page.locator('body > *').count();
    expect(childCount, `body has rendered content on ${path}`).toBeGreaterThan(0);
    expect(pageErrors, `uncaught JS errors on ${path}`).toEqual([]);
  });
}
