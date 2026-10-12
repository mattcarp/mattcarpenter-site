import { test, expect } from '@playwright/test';

test.describe('briefings smoke', () => {
  for (const path of ['/briefings/', '/briefings-preview/']) {
    test(`${path} renders entries, filter bar, no console errors`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      page.on('pageerror', (err) => {
        consoleErrors.push(err.message);
      });

      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(response?.ok(), `expected ${path} to return 2xx`).toBeTruthy();

      const articles = page.locator('article.briefing');
      await expect(articles.first()).toBeVisible();
      expect(await articles.count()).toBeGreaterThanOrEqual(1);

      const first = articles.first();
      const headline = first.locator('h2.headline');
      await expect(headline).toBeVisible();
      expect((await headline.textContent())?.trim().length).toBeGreaterThan(0);

      const timeEl = first.locator('time[datetime]');
      await expect(timeEl).toBeVisible();
      expect((await timeEl.getAttribute('datetime'))?.length).toBeGreaterThan(0);

      const filterBar = page.locator('#filters');
      await expect(filterBar).toBeVisible();
      await expect(filterBar.locator('button').first()).toBeVisible();

      expect(consoleErrors, `console errors on ${path}`).toEqual([]);
    });
  }
});
