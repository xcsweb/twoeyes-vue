import { test, expect } from '@playwright/test';

test.describe('Training Flow', () => {
  test('Navigates through training menu to a training game', async ({ page }) => {
    await page.goto('/#/training/menu');
    
    await expect(page.locator('text=选择训练阶段')).toBeVisible();

    await page.locator('.elegant-card:has-text("阶段 1：基础脱抑制")').click();

    await expect(page.locator('text=阶段 1：基础脱抑制')).toBeVisible();

    await page.locator('.elegant-card:has-text("洗牌训练 (Shuffle)")').click();

    // Wait for the game to load (the canvas)
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 10000 });
    
    // Check for some HUD elements
    await expect(page.locator('text=剩余训练时间')).toBeVisible();
  });
});
