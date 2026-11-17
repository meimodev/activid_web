import { expect, test } from '@playwright/test';

for (const path of ['/satset', '/rds', '/satset?lang=en', '/rds?lang=en']) {
  test(`SatSet is cached and usable on a small phone: ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    const response = await page.goto(path);
    const english = path.includes('lang=en');

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("SatSet / Restaurant Display System (RDS)");
    expect(response?.headers()['cache-control']).not.toContain('no-store');
    await expect(page.locator('h1')).toHaveText(english
      ? 'A Busy Restaurant Should Be Good News, Not the Start of Chaos.'
      : 'Restoran Ramai Seharusnya Jadi Kabar Baik, Bukan Awal Kekacauan.');
    await expect(page.locator('html')).toHaveAttribute('lang', english ? 'en' : 'id');

    const contact = page.locator('.satset-header-actions a[href*="wa.me"]');
    await expect(contact).toBeVisible();
    await expect(contact).toHaveAttribute('href', /^https:\/\/wa\.me\/62881080088816\?text=/);
    await page.setViewportSize({ width: 320, height: 568 });
    expect((await contact.boundingBox())?.height).toBeLessThanOrEqual(48);
    await expect(page.locator('.satset-actions a').first()).toBeInViewport({ ratio: 1 });
    await expect(page.locator('#satset-download-size')).toContainText('113 MB');
    await expect(page.locator('link[rel="preload"][as="image"]')).toHaveAttribute('imagesizes', '(max-width: 899px) 100vw, 58vw');
    expect(await page.locator('link[rel="preload"][as="font"]').count()).toBe(2);

    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);

    const menu = page.locator('.satset-mobile-menu');
    await menu.locator('summary').click();
    await expect(menu.locator('a[href="#pricing"]')).toBeVisible();
    await menu.locator('a[href="#pricing"]').click();
    await expect(menu).not.toHaveAttribute('open', '');
    await expect(page.locator('#pricing h2')).toBeInViewport();

    // The price counts down from the regular figure and must settle on the offer.
    const price = page.locator('.satset-price-promo strong');
    await price.scrollIntoViewIfNeeded();
    await expect(price).toHaveText(english ? 'Rp399,000' : 'Rp399.000');

    // Feature recordings must not download until they are on screen.
    const videos = page.locator('.satset-stage video');
    await expect(videos).toHaveCount(5);
    for (const video of await videos.all()) await expect(video).toHaveAttribute('preload', 'none');

    // The internet cuts itself once in view; the switch brings it back.
    const network = page.locator('.satset-net');
    await network.scrollIntoViewIfNeeded();
    await expect(network).toHaveAttribute('data-online', 'false');
    await network.getByRole('switch').click();
    await expect(network).toHaveAttribute('data-online', 'true');

    const faq = page.locator('#faq details');
    await expect(faq).toHaveCount(6);
    await faq.nth(0).locator('summary').click();
    await expect(faq.nth(0).locator('p')).toBeVisible();
    await faq.nth(1).locator('summary').click();
    await expect(faq.nth(0)).not.toHaveAttribute('open', '');

    await menu.locator('summary').click();
    await menu.locator('.satset-menu-language').click();
    await expect(page.locator('h1')).toHaveText(english
      ? 'Restoran Ramai Seharusnya Jadi Kabar Baik, Bukan Awal Kekacauan.'
      : 'A Busy Restaurant Should Be Good News, Not the Start of Chaos.');
  });
}
