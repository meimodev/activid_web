import { expect, test } from '@playwright/test';

for (const path of ['/satset', '/rds', '/satset?lang=en', '/rds?lang=en']) {
  test(`SatSet is cached and usable on a small phone: ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    const response = await page.goto(path);
    const english = path.includes('lang=en');

    expect(response?.status()).toBe(200);
    expect(response?.headers()['cache-control']).not.toContain('no-store');
    await expect(page.locator('h1')).toHaveText(english
      ? 'Keep service moving.'
      : 'Pesanan lancar. Resto tetap jalan.');
    await expect(page.locator('html')).toHaveAttribute('lang', english ? 'en' : 'id');

    const contact = page.locator('.satset-header-actions a[href*="wa.me"]');
    await expect(contact).toBeVisible();
    await expect(contact).toHaveAttribute('href', /^https:\/\/wa\.me\/62881080088816\?text=/);
    await page.setViewportSize({ width: 320, height: 568 });
    expect((await contact.boundingBox())?.height).toBeLessThanOrEqual(48);
    await expect(page.locator('.satset-actions a').first()).toBeInViewport({ ratio: 1 });
    await expect(page.locator('#satset-download-size')).toContainText('113 MB');
    await expect(page.locator('link[rel="preload"][as="image"]')).toHaveAttribute('imagesizes', '100vw');
    expect(await page.locator('link[rel="preload"][as="font"]').count()).toBe(2);

    expect(await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      blur: getComputedStyle(document.querySelector('.satset-header')!).backdropFilter,
      imagePosition: getComputedStyle(document.querySelector('.satset-hero-visual')!).position,
    }))).toEqual({ overflow: false, blur: 'none', imagePosition: 'absolute' });

    const menu = page.locator('.satset-mobile-menu');
    await menu.locator('summary').click();
    await expect(menu.locator('a[href="#pricing"]')).toBeVisible();
    await menu.locator('a[href="#pricing"]').click();
    await expect(menu).not.toHaveAttribute('open', '');
    await expect(page.locator('#pricing h2')).toBeInViewport();

    const screens = page.locator('.satset-screen');
    await expect(screens).toHaveCount(4);
    await screens.nth(2).locator('summary').click();
    await expect(screens.nth(2)).toHaveAttribute('open', '');
    await expect(screens.first()).not.toHaveAttribute('open', '');
    await expect(screens.nth(2).locator('img')).toHaveAttribute('src', '/satset/screens/kitchen.webp');

    const faq = page.locator('#faq details').first();
    await faq.locator('summary').click();
    await expect(faq.locator('p')).toBeVisible();

    await menu.locator('summary').click();
    await menu.locator('.satset-menu-language').click();
    await expect(page.locator('h1')).toHaveText(english
      ? 'Pesanan lancar. Resto tetap jalan.'
      : 'Keep service moving.');
  });
}
