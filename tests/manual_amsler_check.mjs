import { chromium } from 'playwright'

const main = async () => {
  const baseUrl = 'http://localhost:5177/twoeyes-vue/#/vision/amsler-grid-test'

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })

  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.screenshot({ path: '/workspace/twoeyes-vue/tests/_amsler_01_loaded.png', fullPage: true })

  for (let i = 0; i < 4; i++) {
    await page.locator('.q-tl').click()
    await page.waitForTimeout(200)
    await page.screenshot({
      path: `/workspace/twoeyes-vue/tests/_amsler_0${2 + i}_after_click.png`,
      fullPage: true,
    })
  }

  await page.waitForTimeout(800)
  await page.screenshot({ path: '/workspace/twoeyes-vue/tests/_amsler_06_after_finish.png', fullPage: true })

  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

