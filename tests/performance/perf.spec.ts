import { test, expect } from '@playwright/test';

test.describe('性能测试', () => {
  test('测量 FCP, LCP 以及 SPA 导航延迟', async ({ page }) => {
    // 1. 导航到首页（使用 /#/home 跳过首次访问的引导页）
    await page.goto('/#/home');

    // 2. 等待应用加载完成
    await page.waitForSelector('text=双眼视觉康复系统', { state: 'visible' });

    // 等待一小段时间确保渲染事件已经触发
    await page.waitForTimeout(500);

    // 3. 评估 performance.getEntriesByType('paint') 以打印 FCP 和 LCP (FP/FCP)
    const paintMetrics = await page.evaluate(() => {
      const paintEntries = performance.getEntriesByType('paint');
      return paintEntries.map(e => ({ name: e.name, startTime: e.startTime }));
    });

    console.log('--- 渲染指标 (FP / FCP) ---');
    console.log(paintMetrics);

    // 注意：getEntriesByType('paint') 通常只返回 'first-paint' 和 'first-contentful-paint'。
    // 为了可靠地获取 LCP，我们需要使用 PerformanceObserver。
    const lcpTime = await page.evaluate(() => {
      return new Promise<number | null>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
          observer.disconnect();
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });

        // 设置超时，以防 LCP 已经触发或不被支持
        setTimeout(() => {
          observer.disconnect();
          resolve(null);
        }, 1500);
      });
    });

    console.log('--- 最大内容绘制 (LCP) ---');
    console.log(`LCP 时间: ${lcpTime !== null ? lcpTime.toFixed(2) + ' ms' : '未捕获或不支持'}`);

    // 4. 点击底部导航中的个人信息按钮
    // (注意：当前首页底部是通过卡片导航的，个人信息卡片位于最底部)
    const profileCard = page.locator('.elegant-card:has-text("个人信息与档案")');
    await expect(profileCard).toBeVisible();

    // 5. 使用 performance.now() 在前后测量 SPA 导航延迟
    const startTime = await page.evaluate(() => performance.now());

    await profileCard.click();

    // 等待个人信息页面加载完成
    await page.waitForSelector('text=视觉健康档案与训练进度概览', { state: 'visible' });

    const endTime = await page.evaluate(() => performance.now());
    const spaDelay = endTime - startTime;

    console.log('--- SPA 导航延迟 ---');
    console.log(`导航到个人信息页面耗时: ${spaDelay.toFixed(2)} ms`);

    // 基本断言，确保测试成功完成
    expect(spaDelay).toBeGreaterThan(0);
  });
});
