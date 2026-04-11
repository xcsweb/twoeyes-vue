import { test, expect } from '@playwright/test';

test.describe('Intelligent Routing E2E Tests', () => {

  test('Test 1: Normal vision (offset 0, suppression none) unlocks all 4 stages', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('settings', JSON.stringify({
        age: 25,
        hasSeenIntro: true,
        lensConfig: 'red-cyan',
        leftLense: { r: 255, g: 0, b: 0 },
        rightLense: { r: 0, g: 255, b: 255 },
        alignmentOffset: { x: 0, y: 0, rLeft: 0, rRight: 0 },
        visionAcuity: { left: 1.0, right: 1.0 },
        suppressionStatus: 'none',
        penalizationFactor: 0.3,
        testFrequency: 1,
        lastTestTime: 0
      }));
      localStorage.setItem('progress', JSON.stringify({
        unlockedStage: 1,
        stages: {
          1: { stage: 1, totalTime: 0 },
          2: { stage: 2, totalTime: 0 },
          3: { stage: 3, totalTime: 0 },
          4: { stage: 4, totalTime: 0 }
        },
        firstTrainingDate: null,
        lastTrainingDate: null
      }));
    });

    await page.reload();
    await page.goto('/#/training/menu');
    await expect(page.locator('h1.title:has-text("选择训练阶段")')).toBeVisible();

    const stage1Card = page.locator('.elegant-card', { hasText: '阶段 1：' });
    const stage2Card = page.locator('.elegant-card', { hasText: '阶段 2：' });
    const stage3Card = page.locator('.elegant-card', { hasText: '阶段 3：' });
    const stage4Card = page.locator('.elegant-card', { hasText: '阶段 4：' });

    await expect(stage1Card).not.toHaveClass(/locked-card/);
    await expect(stage2Card).not.toHaveClass(/locked-card/);
    await expect(stage3Card).not.toHaveClass(/locked-card/);
    await expect(stage4Card).not.toHaveClass(/locked-card/);
  });

  test('Test 2: Strabismus only (offset x=10, suppression none) unlocks 1,2,3, locks 4', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('settings', JSON.stringify({
        age: 25,
        hasSeenIntro: true,
        lensConfig: 'red-cyan',
        leftLense: { r: 255, g: 0, b: 0 },
        rightLense: { r: 0, g: 255, b: 255 },
        alignmentOffset: { x: 10, y: 0, rLeft: 0, rRight: 0 },
        visionAcuity: { left: 1.0, right: 1.0 },
        suppressionStatus: 'none',
        penalizationFactor: 0.3,
        testFrequency: 1,
        lastTestTime: 0
      }));
      localStorage.setItem('progress', JSON.stringify({
        unlockedStage: 1,
        stages: {
          1: { stage: 1, totalTime: 0 },
          2: { stage: 2, totalTime: 0 },
          3: { stage: 3, totalTime: 0 },
          4: { stage: 4, totalTime: 0 }
        },
        firstTrainingDate: null,
        lastTrainingDate: null
      }));
    });

    await page.reload();
    await page.goto('/#/training/menu');
    await expect(page.locator('h1.title:has-text("选择训练阶段")')).toBeVisible();

    const stage1Card = page.locator('.elegant-card', { hasText: '阶段 1：' });
    const stage2Card = page.locator('.elegant-card', { hasText: '阶段 2：' });
    const stage3Card = page.locator('.elegant-card', { hasText: '阶段 3：' });
    const stage4Card = page.locator('.elegant-card', { hasText: '阶段 4：' });

    await expect(stage1Card).not.toHaveClass(/locked-card/);
    await expect(stage2Card).not.toHaveClass(/locked-card/);
    await expect(stage3Card).not.toHaveClass(/locked-card/);
    await expect(stage4Card).toHaveClass(/locked-card/);
  });

  test('Test 3: Amblyopia (suppression left) unlocks 1, locks 2,3,4', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('settings', JSON.stringify({
        age: 25,
        hasSeenIntro: true,
        lensConfig: 'red-cyan',
        leftLense: { r: 255, g: 0, b: 0 },
        rightLense: { r: 0, g: 255, b: 255 },
        alignmentOffset: { x: 0, y: 0, rLeft: 0, rRight: 0 },
        visionAcuity: { left: 1.0, right: 1.0 },
        suppressionStatus: 'left',
        penalizationFactor: 0.3,
        testFrequency: 1,
        lastTestTime: 0
      }));
      localStorage.setItem('progress', JSON.stringify({
        unlockedStage: 1,
        stages: {
          1: { stage: 1, totalTime: 0 },
          2: { stage: 2, totalTime: 0 },
          3: { stage: 3, totalTime: 0 },
          4: { stage: 4, totalTime: 0 }
        },
        firstTrainingDate: null,
        lastTrainingDate: null
      }));
    });

    await page.reload();
    await page.goto('/#/training/menu');
    await expect(page.locator('h1.title:has-text("选择训练阶段")')).toBeVisible();

    const stage1Card = page.locator('.elegant-card', { hasText: '阶段 1：' });
    const stage2Card = page.locator('.elegant-card', { hasText: '阶段 2：' });
    const stage3Card = page.locator('.elegant-card', { hasText: '阶段 3：' });
    const stage4Card = page.locator('.elegant-card', { hasText: '阶段 4：' });

    await expect(stage1Card).not.toHaveClass(/locked-card/);
    await expect(stage2Card).toHaveClass(/locked-card/);
    await expect(stage3Card).toHaveClass(/locked-card/);
    await expect(stage4Card).toHaveClass(/locked-card/);
  });

});
