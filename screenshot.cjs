const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 500, height: 800 } });
  
  await page.goto('http://localhost:5173/twoeyes-vue/#/vision/color-vision-test');
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'public/screenshots/color-vision.png' });
  
  await browser.close();
})();
