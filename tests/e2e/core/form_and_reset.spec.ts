import { test, expect } from '@playwright/test';

test.describe('Form and Reset E2E Tests', () => {

  test('Test 1: Verify UserInfoForm appears, no gender field, fill age and submit', async ({ page }) => {
    // 1. Go to /
    await page.goto('/');
    
    // Click "开始体验" to go to home if on intro page
    const startBtn = page.locator('button:has-text("开始体验")');
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    // 2. Click "斜视检查"
    await page.locator('.cards-wrapper .elegant-card:has-text("斜视检查")').click();

    // 3. Verify UserInfoForm appears (first is SectionIntroExam)
    await expect(page.locator('text=临床级视功能检查')).toBeVisible();
    await page.locator('button:has-text("我已准备好，开始")').click();

    // Now on UserInfoForm
    await expect(page.getByText('基本信息', { exact: true })).toBeVisible();

    // 4. Verify NO gender field exists
    const genderField = page.locator('text=性别');
    await expect(genderField).toHaveCount(0);

    // 5. Fill age and submit
    await page.getByLabel('年龄 (岁)').fill('28');
    await page.locator('button:has-text("继续")').click();

    // Wait for the next page to confirm submission was successful (LensSelection)
    await expect(page.locator('text=系统需要确认您的镜片方向')).toBeVisible();
  });

  test('Test 2: Trigger reset app via 5 clicks on title, accept dialog, verify reload and local storage is cleared', async ({ page }) => {
    // Go to home directly
    await page.goto('/#/home');
    
    // Set some dummy local storage to ensure it's cleared later
    await page.evaluate(() => {
      localStorage.setItem('dummy_key', 'dummy_value');
    });

    // Verify localStorage has item
    let storageLength = await page.evaluate(() => localStorage.length);
    expect(storageLength).toBeGreaterThan(0);

    // 1. Trigger reset app via 5 clicks on title
    const title = page.locator('h1.title:has-text("双眼视觉康复系统")');
    for (let i = 0; i < 5; i++) {
      await title.click();
      await page.waitForTimeout(50); // small delay between clicks
    }

    // 2. Click reset button
    const resetBtn = page.locator('button:has-text("清空数据并重置应用")');
    await expect(resetBtn).toBeVisible();

    // 3. Accept dialog and wait for reload
    page.once('dialog', dialog => dialog.accept());
    
    // 4. Verify window.location.reload() occurred and local storage is cleared
    // When the page reloads, a navigation event occurs
    const navigationPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await resetBtn.click();
    await navigationPromise;
    await page.waitForLoadState('networkidle');

    await page.waitForFunction(() => localStorage.length === 0);
    storageLength = await page.evaluate(() => localStorage.length);
    expect(storageLength).toBe(0);
  });

});
