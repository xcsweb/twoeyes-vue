const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/twoeyes-vue/#/training/shuffle');
  await page.waitForTimeout(2000);
  
  console.log("Clicking home on shuffle");
  await page.locator('.bottom-nav .v-btn[value="home"]').click();
  await page.waitForTimeout(2000);
  console.log("URL is now:", page.url());
  
  await browser.close();
})();
