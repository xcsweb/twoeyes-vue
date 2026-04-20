import { test, expect } from '@playwright/test';

test.describe('Color Calibration and Penalization E2E Flow', () => {

  test('Full flow: Lens Selection -> Grid Calibration -> Suppression -> Contrast -> Alignment', async ({ page }) => {
    // 1. Go to Home and start Amblyopia flow
    await page.goto('/');
    
    const startBtn = page.locator('button:has-text("开始体验")');
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    // Click "弱视/抑制检查"
    await page.locator('.cards-wrapper .elegant-card:has-text("弱视/抑制检查")').click();

    // SectionIntroAmblyopia
    await expect(page.locator('text=弱视 / 抑制检查')).toBeVisible();
    await page.locator('button:has-text("我已准备好，开始")').click();

    // UserInfoForm
    await page.getByLabel('年龄 (岁)').fill('25');
    await page.locator('button:has-text("继续")').click();

    // LensSelection
    await expect(page.locator('text=系统需要确认您的镜片方向')).toBeVisible();
    // Choose red-cyan
    await page.locator('.lens-btn').first().click(); // Assuming first is left red right cyan

    // LensConfirmation
    await expect(page.locator('text=系统校准成功')).toBeVisible();
    await page.locator('button:has-text("确认配置并继续")').click();

    // ColorCalibration
    await expect(page.locator('text=颜色域校准')).toBeVisible();
    await expect(page.locator('text=第 1 步：红色域校准')).toBeVisible();
    await page.locator('.calibration-cell').nth(63).click();
    await page.locator('button:has-text("确认红色并继续")').click();

    await expect(page.locator('text=第 2 步：青(蓝)色域校准')).toBeVisible();
    await page.locator('.calibration-cell').nth(63).click();
    await page.locator('button:has-text("保存并继续")').click();

    // DistanceAdvice
    await expect(page.locator('text=测试距离提示')).toBeVisible();
    await page.locator('button:has-text("我已了解，开始测试")').click();

    // ObjectiveTestLevel (Suppression)
    await expect(page.locator('text=客观双眼抑制测试')).toBeVisible();
    await page.locator('button:has-text("开始测试")').click();

    // We want to force "Left Eye Suppression". So we answer correctly for right eye, incorrectly for left eye.
    for (let i = 0; i < 10; i++) {
      const eSymbol = page.locator('.e-symbol');
      await expect(eSymbol).toBeVisible();
      const classStr = await eSymbol.getAttribute('class') || '';
      
      const isLeftEye = classStr.includes('color-cyan'); // For red-cyan lens, left eye (red) sees cyan E
      
      if (isLeftEye) {
        // Answer wrong
        if (classStr.includes('dir-up')) await page.keyboard.press('ArrowDown');
        else await page.keyboard.press('ArrowUp');
      } else {
        // Answer correct
        if (classStr.includes('dir-up')) await page.keyboard.press('ArrowUp');
        else if (classStr.includes('dir-down')) await page.keyboard.press('ArrowDown');
        else if (classStr.includes('dir-left')) await page.keyboard.press('ArrowLeft');
        else if (classStr.includes('dir-right')) await page.keyboard.press('ArrowRight');
      }
      
      // Small delay for vue reactivity to update trial
      await page.waitForTimeout(200);
    }

    // Now it should show the result
    await expect(page.locator('text=客观测试结果分析')).toBeVisible();
    await expect(page.locator('text=左眼存在视觉抑制')).toBeVisible();
    await page.locator('button:has-text("继续下一步")').click();

    // ContrastTestLevel
    await expect(page.locator('text=客观暗光惩罚阈值测定')).toBeVisible();
    await page.locator('button:has-text("开始测试")').click();

    // We want to get penalized to 0.7 (testOpacity starts at 0.85, one wrong answer makes it 0.7)
    // First answer: wrong
    const eSymbolContrast = page.locator('.e-symbol');
    await expect(eSymbolContrast).toBeVisible();
    let classStr = await eSymbolContrast.getAttribute('class') || '';
    if (classStr.includes('dir-up')) await page.keyboard.press('ArrowDown');
    else await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(200);

    // Next two answers: correct
    for (let i = 0; i < 2; i++) {
      classStr = await eSymbolContrast.getAttribute('class') || '';
      if (classStr.includes('dir-up')) await page.keyboard.press('ArrowUp');
      else if (classStr.includes('dir-down')) await page.keyboard.press('ArrowDown');
      else if (classStr.includes('dir-left')) await page.keyboard.press('ArrowLeft');
      else if (classStr.includes('dir-right')) await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(200);
    }

    // Should finish contrast test
    await expect(page.locator('text=临界阈值测定成功')).toBeVisible();
    await page.locator('button:has-text("继续下一步")').click();

    // AmblyopiaAdvice
    await expect(page.locator('text=弱视与抑制评估报告')).toBeVisible();
    await page.locator('button:has-text("返回主页")').click();

    // Now back at Home. Let's go to exam to see AlignmentTest
    await expect(page.locator('text=斜视检查')).toBeVisible();
    await page.locator('.cards-wrapper .elegant-card:has-text("斜视检查")').click();

    // Wait, in exam flow, we have to go through UserInfo -> LensSelection -> ColorCalibration again?
    // Let's just bypass by directly going to /#/exam/alignment-exercise
    await page.goto('/#/exam/alignment-exercise');

    // Wait for the exercise to render
    await page.waitForSelector('.canvas-area');

    // Now we assert the final colors in the DOM
    const verticalLine = page.locator('.vertical-line');
    const horizontalLine = page.locator('.horizontal-line');

    await expect(verticalLine).toBeVisible();
    await expect(horizontalLine).toBeVisible();

    // Left eye (red) is weak, so it has factor 1.0 -> rgb(255, 0, 0)
    // Right eye (cyan) is strong, penalized to 0.7 -> rgb(0, 179, 179)
    await expect(verticalLine).toHaveCSS('background-color', 'rgb(255, 0, 0)');
    await expect(horizontalLine).toHaveCSS('background-color', 'rgb(0, 179, 179)');
  });

});
