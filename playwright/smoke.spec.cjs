/** Browser verification of the running portal and its no-local-storage contract. */
const { test, expect } = require('@playwright/test');
const base = process.env.BASE_URL || 'http://website:5173';

test('portal renders and API responds without browser storage', async ({ page, request }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  // Block storage APIs before application code runs, so even attempted writes fail this test.
  await page.addInitScript(() => {
    Storage.prototype.setItem = function () { throw new Error('Browser persistence is disabled'); };
    Storage.prototype.getItem = function () { throw new Error('Browser persistence is disabled'); };
  });
  await page.goto(base);
  await expect(page.locator('#root')).not.toBeEmpty();
  await expect(page.locator('body')).toContainText(/Axiom/i);
  const response = await request.get(base + '/api/auth/countries/');
  expect(response.ok()).toBeTruthy();
  expect(errors).toEqual([]);
  await page.reload();
  await expect(page.locator('#root')).not.toBeEmpty();
  expect(errors).toEqual([]);
});

/** Verify both selector links, the circuit outline and a localized fresh navigation. */
test('shared site links to both games and serves localized deep links', async ({ page, request }) => {
  const health = await request.get(base + '/api/health');
  expect(health.ok()).toBeTruthy();
  await page.goto(base + '/de');
  await expect(page.getByRole('link', { name: 'Axiom Force', exact: true }).last())
    .toHaveAttribute('href', '/de/games/axiom-force');
  await page.getByRole('link', { name: 'Axiom Force: Drift Circuit', exact: true }).click();
  await expect(page).toHaveURL(/\/de\/games\/drift-circuit$/);
  await expect(page.getByRole('heading', { name: 'Axiom Force: Drift Circuit', exact: true })).toBeVisible();
  await expect(page.getByText('Little Tokyo–Skyport', { exact: true })).toBeVisible();
  await expect(page.getByText('Apex Bastion Descent', { exact: true })).toBeVisible();
  await page.goto(base + '/ar/games/axiom-force');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('heading', { name: 'Axiom Force', exact: true })).toBeVisible();
  await expect(page.locator('main a[href="/ar/gameplay"]')).toBeVisible();
});
