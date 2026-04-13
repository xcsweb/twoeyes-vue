const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/twoeyes-vue/#/exercises/stereopsis');
  await page.waitForTimeout(2000);
  
  await page.locator('.bottom-nav .v-btn[value="back"]').click();
  await page.waitForTimeout(2000);
  
  const content = await page.content();
  if (content.includes('康复训练菜单')) {
    console.log('Menu is visible');
  } else {
    console.log('Menu is missing');
  }
  
  const text = await page.locator('body').innerText();
  console.log('Body text:', text);
  
  await browser.close();
})();
