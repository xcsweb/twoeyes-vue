const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/twoeyes-vue/#/training/tetris');
  await page.waitForTimeout(2000);
  
  await page.locator('.bottom-nav .v-btn[value="back"]').click();
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'test_blank2_result.png' });
  console.log("Screenshot taken");
  await browser.close();
})();
