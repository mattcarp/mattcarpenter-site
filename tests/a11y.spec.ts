import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('briefings / has no critical axe violations', async ({ page }) => {
  await page.goto('/briefings/', { waitUntil: 'networkidle' });

  const results = await new AxeBuilder({ page }).analyze();

  for (const violation of results.violations) {
    console.log(
      `[axe] ${violation.id} (${violation.impact}): ${violation.help}\n` +
        violation.nodes
          .map((n) => `  - ${n.html}\n    ${n.failureSummary}`)
          .join('\n'),
    );
  }

  const critical = results.violations.filter((v) => v.impact === 'critical');
  expect(critical, 'critical accessibility violations').toEqual([]);
});
