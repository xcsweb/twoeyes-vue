import { test, expect } from '@playwright/test';

test.describe('Vision Flow', () => {
  test('Completes the basic vision test flow', async ({ page }) => {
    await page.goto('/#/home');
    
    // Click "普通视力检查"
    await page.locator('.cards-wrapper .elegant-card:has-text("普通视力检查")').click();
    
    // SectionIntroVision
    await expect(page.locator('text=普通视力检查')).toBeVisible();
    await page.locator('button:has-text("我已准备好，开始")').click();

    // VisionDistanceAdvice
    await expect(page.locator('text=视力测试距离提示')).toBeVisible();
    await page.locator('button:has-text("我已了解，开始测试")').click();

    // VisionTest (Left Eye)
    await expect(page.locator('text=普通视力测试')).toBeVisible();
    
    // Play the test for left eye
    for (let i = 0; i < 15; i++) {
      const upBtn = page.locator('button .mdi-arrow-up-bold').locator('..');
      if (await upBtn.count() > 0) {
        await upBtn.click();
        await page.waitForTimeout(300);
      }
    }

    // Middle screen: Right eye prompt
    if (await page.locator('text=左眼测试已完成').count() > 0) {
      await page.locator('button:has-text("开始右眼测试")').click();
      await page.waitForTimeout(500);
    }

    // Play the test for right eye
    for (let i = 0; i < 15; i++) {
      const upBtn = page.locator('button .mdi-arrow-up-bold').locator('..');
      if (await upBtn.count() > 0) {
        await upBtn.click();
        await page.waitForTimeout(300);
      }
    }

    // Check if test is finished
    await expect(page.locator('text=您的初步视力测试已结束')).toBeVisible({ timeout: 10000 });
    await page.locator('button:has-text("查看详细报告")').click();

    // AstigmatismTest
    await expect(page.locator('text=客观散光筛查')).toBeVisible();
    for (let i = 0; i < 8; i++) {
      await page.locator('button:has-text("看不清")').click();
      await page.waitForTimeout(300);
    }

    // ColorVisionTest
    await expect(page.locator('text=客观色觉筛查')).toBeVisible();
    for (let i = 0; i < 6; i++) {
      await page.locator('button:has-text("看不清")').click();
      await page.waitForTimeout(300);
    }

    // AmslerGridTest
    await expect(page.locator('text=客观黄斑功能筛查')).toBeVisible();
    for (let i = 0; i < 4; i++) {
      await page.locator('button:has-text("我看不出哪里扭曲（或到处都扭曲）")').click();
      await page.waitForTimeout(300);
    }

    // ContrastSensitivityTest
    await expect(page.locator('text=客观对比敏感度筛查')).toBeVisible();
    await page.locator('button:has-text("看不清")').click();

    // VisionAdvice
    await expect(page.locator('text=视力评估报告')).toBeVisible();
    await page.locator('button:has-text("完成并回到主页")').click();

    // Home
    await expect(page.locator('text=双眼视觉康复系统')).toBeVisible();
  });
});
