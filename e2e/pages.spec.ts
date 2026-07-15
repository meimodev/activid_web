import { test, expect } from '@playwright/test';

// Main marketing-site routes (app/(main)). Keep in sync when adding pages.
const ROUTES = [
  '/',
  '/about',
  '/services',
  '/services/social-media',
  '/services/branding',
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
