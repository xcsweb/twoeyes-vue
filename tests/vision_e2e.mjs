import { chromium } from 'playwright'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8006'

const clickBottomNav = async (page, value) => {
  await page.locator(`.v-bottom-navigation button[value="${value}"]`).click({ timeout: 5000 })
  await page.waitForTimeout(800)
  await page.waitForLoadState('networkidle')
}

const run = async () => {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  page.on('pageerror', err => {
    console.error('PAGE EXCEPTION:', err)
  })

  console.log('=== Start Vision E2E Test ===')
  
  // 1. Go to Home
  console.log('Navigating to Home...')
  await page.goto(`${BASE_URL}/#/home`, { waitUntil: 'networkidle' })
  await page.waitForSelector('text=双眼视觉康复系统')

  // 2. Click "普通视力检查" card
  console.log('Clicking Vision Test Card...')
  await page.locator('.cards-wrapper .elegant-card:has-text("普通视力检查")').click()
  await page.waitForLoadState('networkidle')

  // 3. VisionIntro (should NOT have center button)
  console.log('Checking VisionIntro...')
  await page.waitForSelector('text=普通视力检查')
  
  // Verify no center button
  const centerBtn = await page.locator('.start-btn-wrapper button:has-text("我已准备好，开始")').count()
  if (centerBtn > 0) {
    console.error('ERROR: Center button "我已准备好，开始" is STILL visible on VisionIntro!')
    await page.screenshot({ path: '/workspace/vision_intro_error.png' })
    process.exit(1)
  } else {
    console.log('SUCCESS: Center button is properly hidden on VisionIntro.')
  }

  // Click "开始体验" on bottom nav
  console.log('Clicking bottom nav next on VisionIntro...')
  await clickBottomNav(page, 'next')

  // 4. VisionDistanceAdvice (should NOT have center button)
  console.log('Checking VisionDistanceAdvice...')
  await page.waitForSelector('text=视力测试距离提示')
  
  const centerBtn2 = await page.locator('button:has-text("我已保持 40cm 距离，开始测试")').count()
  if (centerBtn2 > 0) {
    console.error('ERROR: Center button is STILL visible on VisionDistanceAdvice!')
    process.exit(1)
  }

  // Click "开始测试" on bottom nav
  console.log('Clicking bottom nav next on VisionDistanceAdvice...')
  await clickBottomNav(page, 'next')

  // 5. VisionTest
  console.log('Checking VisionTest (Left Eye)...')
  await page.waitForSelector('text=普通视力测试')
  
  // Play the test for left eye (just click right arrow multiple times or answer correctly/wrongly)
  // Let's just click the UP arrow until test finishes
  for (let i = 0; i < 5; i++) {
    const upBtn = page.locator('button .mdi-arrow-up').locator('..')
    if (await upBtn.count() > 0) {
      await upBtn.click()
      await page.waitForTimeout(500)
    }
  }

  // Middle screen: Right eye prompt
  if (await page.locator('text=左眼测试已完成').count() > 0) {
    console.log('Middle screen reached. Proceeding to right eye...')
    await page.locator('button:has-text("开始测试右眼")').click()
    await page.waitForTimeout(500)
  }

  // Play the test for right eye
  console.log('Checking VisionTest (Right Eye)...')
  for (let i = 0; i < 5; i++) {
    const upBtn = page.locator('button .mdi-arrow-up').locator('..')
    if (await upBtn.count() > 0) {
      await upBtn.click()
      await page.waitForTimeout(500)
    }
  }

  // Check if test is finished
  await page.waitForSelector('text=您的初步视力测试已结束', { timeout: 10000 })
  console.log('VisionTest completed.')

  // Click "查看报告" on bottom nav
  console.log('Clicking bottom nav next on VisionTest...')
  await clickBottomNav(page, 'next')

  // 6. VisionAdvice
  console.log('Checking VisionAdvice...')
  await page.waitForSelector('text=视力测试结果评估')
  
  // Click "查看档案" on bottom nav
  console.log('Clicking bottom nav next on VisionAdvice...')
  await clickBottomNav(page, 'next')

  // 7. UserProfile
  console.log('Checking UserProfile...')
  await page.waitForSelector('text=个人信息与康复档案')
  await page.waitForSelector('text=普通视力检查结果')

  console.log('=== Vision E2E Test Passed Successfully ===')
  
  await context.close()
  await browser.close()
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
