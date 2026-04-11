import { test, expect } from '@playwright/test';

test.describe('Personalized Training Duration E2E Tests', () => {

  test('Test 1 (Child): Clear storage, mock age 10, verify training time is 10 minutes', async ({ page }) => {
    // 1. Go to root
    await page.goto('/');

    // 2. Clear storage and set mock settings for age 10
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('settings', JSON.stringify({
        age: 10,
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

    // Reload to apply localStorage
    await page.reload();

    // 3. Navigate to /training/menu directly
    await page.goto('/#/training/menu');

    // Wait for the training menu to load
    await expect(page.locator('h1.title:has-text("选择训练阶段")')).toBeVisible();

    // 4. Click `阶段 1` intro card
    const stage1Card = page.locator('.elegant-card:has-text("阶段 1：基础脱抑制")');
    await expect(stage1Card).toBeVisible();
    await stage1Card.click();

    // 5. Verify it says "时长要求：本阶段至少训练 10 分钟"
    await expect(page.locator('text=时长要求：本阶段至少训练 10 分钟')).toBeVisible();
  });

  test('Test 2 (Adult): Clear storage, mock age 25, verify training time is 20 minutes', async ({ page }) => {
    // 1. Go to root
    await page.goto('/');

    // 2. Clear storage and set mock settings for age 25
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

    // Reload to apply localStorage
    await page.reload();

    // 3. Navigate to /training/menu directly
    await page.goto('/#/training/menu');

    // Wait for the training menu to load
    await expect(page.locator('h1.title:has-text("选择训练阶段")')).toBeVisible();

    // 4. Click `阶段 1` intro card
    const stage1Card = page.locator('.elegant-card:has-text("阶段 1：基础脱抑制")');
    await expect(stage1Card).toBeVisible();
    await stage1Card.click();

    // 5. Verify it says "时长要求：本阶段至少训练 20 分钟"
    await expect(page.locator('text=时长要求：本阶段至少训练 20 分钟')).toBeVisible();
  });

});
