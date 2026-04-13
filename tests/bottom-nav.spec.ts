import { test, expect } from '@playwright/test';

test.describe('Bottom Navigation Tests', () => {

  test('Clicking Home button should navigate to HomeMenuLevel', async ({ page }) => {
    // Go to TrainingMenu
    await page.goto('/#/training/menu', { waitUntil: 'networkidle' });
    
    // Ensure bottom nav is visible
    const bottomNav = page.locator('.bottom-nav');
    await expect(bottomNav).toBeVisible();

    // Click the Back button which says "返回主页"
    const backBtn = page.locator('.bottom-nav .v-btn[value="back"]');
    await expect(backBtn).toBeVisible();
    await expect(backBtn).toContainText('返回主页');
    await backBtn.click();

    // Verify URL changed to Home
    await expect(page).toHaveURL(/.*#\/home$/);
  });

  test('Clicking Back button should navigate correctly based on history or flow', async ({ page }) => {
    // Navigate from Home -> UserProfile
    await page.goto('/#/home', { waitUntil: 'networkidle' });
    
    // Check if we are on the intro screen
    const startBtnCount = await page.locator('.start-btn').count();
    if (startBtnCount > 0) {
       await page.locator('.start-btn').click();
    }
    
    // Click User Profile card
    await page.locator('.elegant-card:has-text("个人信息与档案")').click();
    await expect(page).toHaveURL(/.*#\/profile$/);
    
    // Ensure bottom nav is visible and back button exists
    const backBtn = page.locator('.bottom-nav .v-btn[value="back"]');
    await expect(backBtn).toBeVisible();
    
    // Click Back button
    await backBtn.click();
    
    // Verify we are back to Home
    await expect(page).toHaveURL(/.*#\/home$/);
  });
});