import { test, expect } from '@playwright/test';

test.describe('Full E2E Journey', () => {
  test('Vision Flow, Check Profile, and Training Navigation', async ({ page }) => {
    // 1. Go to Home and skip intro
    await page.goto('/#/');
    const startBtnCount = await page.locator('.start-btn').count();
    if (startBtnCount > 0) {
       await page.locator('.start-btn').click();
    }

    // Wait for home to load
    await page.waitForSelector('.elegant-card', { timeout: 10000 });

    // 2. Click "普通视力检查"
    await page.locator('.elegant-card:has-text("普通视力检查")').click();

    // SectionIntroVision
    await page.waitForSelector('text=普通视力检查', { timeout: 10000 });
    await page.locator('button:has-text("我已准备好，开始")').click();

    // UserInfoForm
    await page.waitForSelector('text=基本信息', { timeout: 10000 });
    await page.locator('input[type="number"]').fill('25');
    await page.locator('button:has-text("继续")').click();

    // VisionDistanceAdvice
    await page.waitForSelector('text=视力测试距离提示', { timeout: 10000 });
    await page.locator('button:has-text("我已了解，开始测试")').click();

    // VisionTest
    await page.waitForSelector('text=普通视力测试', { timeout: 10000 });
    // Keep clicking up until right eye
    while(await page.locator('text=开始右眼测试').count() === 0) {
      await page.locator('.mdi-arrow-up-bold').click();
      await page.waitForTimeout(50);
    }
    await page.locator('button:has-text("开始右眼测试")').click();
    // Keep clicking up until finish
    while(await page.locator('text=查看详细报告').count() === 0) {
      await page.locator('.mdi-arrow-up-bold').click();
      await page.waitForTimeout(50);
    }
    await page.locator('button:has-text("查看详细报告")').click();

    // AstigmatismTest
    await page.waitForSelector('text=客观散光筛查', { timeout: 10000 });
    for (let i = 0; i < 8; i++) {
      await page.locator('button:has-text("看不清")').click();
      await page.waitForTimeout(50);
    }

    // ColorVisionTest
    await page.waitForSelector('text=客观色觉筛查', { timeout: 10000 });
    for (let i = 0; i < 6; i++) {
      await page.locator('button:has-text("看不清")').click();
      await page.waitForTimeout(50);
    }

    // AmslerGridTest
    await page.waitForSelector('text=客观黄斑功能筛查', { timeout: 10000 });
    for (let i = 0; i < 4; i++) {
      await page.locator('button:has-text("我看不出哪里扭曲（或到处都扭曲）")').click();
      await page.waitForTimeout(50);
    }

    // ContrastSensitivityTest
    await page.waitForSelector('text=客观对比敏感度筛查', { timeout: 10000 });
    await page.locator('button:has-text("看不清")').click();

    // VisionAdvice
    await page.waitForSelector('text=视力评估报告', { timeout: 10000 });
    await page.locator('button:has-text("完成并回到主页")').click();

    // 3. Return to Home
    await page.waitForSelector('.elegant-card', { timeout: 10000 });

    // 4. Check UserProfile
    await page.locator('.elegant-card:has-text("个人信息与档案")').click();
    await page.waitForSelector('text=视觉健康档案', { timeout: 10000 });
    
    // Verify vision score is recorded
    await expect(page.locator('text=最新视力结果')).toBeVisible();

    // Go back to home
    await page.locator('.global-back-btn').click({ force: true });
    await page.waitForTimeout(1000);
    if (page.url().includes('profile')) {
      // fallback
      await page.goto('/#/home');
    }
    console.log('Current URL after back:', page.url());

    // Wait for home to load again
    await page.waitForSelector('.elegant-card:has-text("康复训练")', { timeout: 10000 });

    // 5. Go to Training Menu
    await page.locator('.elegant-card:has-text("康复训练")').click();

    // Wait for Training Menu
    await page.waitForSelector('.elegant-card', { timeout: 10000 });
    
    // Open a game (e.g. ShuffleExercise)
    await page.locator('.elegant-card:has-text("阶段 1")').click();
    
    // Wait for SectionIntroTraining
    await page.waitForSelector('text=阶段 1', { timeout: 10000 });
    
    // wait for cards-wrapper in SectionIntroTraining
    // SectionIntroLevel with games renders cards. 
    // We need to click the first game card
    await page.locator('.elegant-card').first().click();

    // Wait for game to load
    await page.waitForSelector('canvas', { timeout: 10000 }); // ShuffleExercise uses canvas
    await page.waitForTimeout(1000);

    // Click the top-left back button
    await page.locator('.global-back-btn').click();

    // Wait to return to Training Menu or Intro
    await page.waitForSelector('.elegant-card', { timeout: 10000 });
  });
});
