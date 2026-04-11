import { test, expect } from '@playwright/test';

test.describe('Strabismus Exam Flow', () => {
  test('Normal suppression flow with UserInfoForm skips contrast test and proceeds to alignment', async ({ page }) => {
    await page.goto('/#/home');
    
    // Click "斜视检查"
    await page.locator('.cards-wrapper .elegant-card:has-text("斜视检查")').click();
    
    // SectionIntroExam -> UserInfoForm
    await expect(page.locator('text=临床级视功能检查')).toBeVisible();
    await page.locator('button:has-text("我已准备好，开始")').click();

    // Fill UserInfoForm
    await expect(page.getByText('基本信息', { exact: true })).toBeVisible();
    await page.getByLabel('年龄 (岁)').fill('25');
    await page.locator('button:has-text("继续")').click();

    // UserInfoForm -> LensSelection
    await expect(page.locator('text=系统需要确认您的镜片方向')).toBeVisible();
    await page.locator('.lens-btn').first().click();

    // LensSelection -> LensConfirmation
    await expect(page.locator('text=系统校准成功')).toBeVisible();
    await page.locator('button:has-text("确认配置并继续")').click();

    // LensConfirmation -> DistanceAdvice
    await expect(page.locator('text=测试距离提示')).toBeVisible();
    await page.locator('button:has-text("我已了解，开始测试")').click();

    // DistanceAdvice -> SuppressionTest
    await expect(page.locator('text=客观双眼抑制测试')).toBeVisible();
    await page.locator('button:has-text("开始测试")').click();

    // Play 10 trials (Normal - always correct)
    for (let i = 0; i < 10; i++) {
      await expect(page.locator('.e-symbol')).toBeVisible();
      const classAttr = await page.locator('.e-symbol').getAttribute('class') || '';
      
      let actualDir = 'up';
      if (classAttr.includes('dir-down')) actualDir = 'down';
      else if (classAttr.includes('dir-left')) actualDir = 'left';
      else if (classAttr.includes('dir-right')) actualDir = 'right';

      await page.locator(`button .mdi-arrow-${actualDir}-bold`).locator('..').click();
      await page.waitForTimeout(600);
    }

    // Wait for result section
    await expect(page.locator('text=没有明显的单眼抑制现象')).toBeVisible({ timeout: 15000 });
    
    // Click next
    await page.locator('button:has-text("继续下一步")').click();

    // Should skip contrast test and go to Alignment Intro
    await expect(page.locator('text=十字准星对齐测试')).toBeVisible();
    
    // Click start test
    await page.locator('button:has-text("我已准备好，开始")').click();

    // Now in AlignmentExercise
    await expect(page.locator('text=请先确保每个十字都与背景的白色参考线完全平行')).toBeVisible();
    
    // Take a screenshot to verify UI (grid, buttons, etc.)
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'public/screenshots/alignment_exercise_ui.png' });

    // Test rotation controls
    const rotateBtn = page.locator('.rotate-controls button').first();
    await rotateBtn.click();
    await page.waitForTimeout(100);

    // Confirm Alignment
    await page.locator('button:has-text("确认对齐")').click();

    // After Alignment, check next page load
    await expect(page.locator('.level-container')).toBeVisible({ timeout: 10000 });
  });
});
