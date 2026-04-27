import { chromium } from 'playwright'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8006'

const clickBottomNav = async (page, value) => {
  await page.locator(`.v-bottom-navigation button[value="${value}"]`).click({ timeout: 5000 })
  await page.waitForTimeout(800)
  await page.waitForLoadState('networkidle')
}

// 模拟普通视力检查
const playVisionTest = async (page) => {
  console.log('\n--- Starting Vision Test ---')
  await page.goto(`${BASE_URL}/#/home`, { waitUntil: 'networkidle' })
  await page.locator('.cards-wrapper .elegant-card:has-text("普通视力检查")').click()
  await page.waitForLoadState('networkidle')

  await page.waitForSelector('text=普通视力检查')
  await clickBottomNav(page, 'next')

  await page.waitForSelector('text=视力测试距离提示')
  await clickBottomNav(page, 'next')

  await page.waitForSelector('text=普通视力测试')
  
  // Left eye
  for (let i = 0; i < 15; i++) {
    if (await page.locator('text=左眼测试已完成').count() > 0) break;
    const upBtn = page.locator('button .mdi-arrow-up-bold').locator('..')
    if (await upBtn.count() > 0) {
      await upBtn.click()
      await page.waitForTimeout(200)
    }
  }

  if (await page.locator('text=左眼测试已完成').count() > 0) {
    await page.locator('button:has-text("开始右眼测试")').click()
    await page.waitForTimeout(500)
  }

  // Right eye
  for (let i = 0; i < 15; i++) {
    if (await page.locator('text=您的初步视力测试已结束').count() > 0) break;
    const upBtn = page.locator('button .mdi-arrow-up-bold').locator('..')
    if (await upBtn.count() > 0) {
      await upBtn.click()
      await page.waitForTimeout(200)
    }
  }

  await page.waitForSelector('text=您的初步视力测试已结束', { timeout: 10000 })
  // The button says "继续下一步", we should click it directly
  await page.locator('button:has-text("继续下一步")').click()
  await page.waitForLoadState('networkidle')

  // Astigmatism Test
  await page.waitForSelector('text=客观散光筛查')
  for (let i = 0; i < 8; i++) {
    await page.locator('button:has-text("看不清")').click()
    await page.waitForTimeout(300)
  }

  // Color Vision Test
  await page.waitForSelector('text=客观色觉筛查')
  for (let i = 0; i < 6; i++) {
    await page.locator('button:has-text("看不清")').click()
    await page.waitForTimeout(300)
  }

  // Amsler Grid Test
  await page.waitForSelector('text=客观黄斑功能筛查')
  for (let i = 0; i < 4; i++) {
    await page.locator('button:has-text("我看不出哪里扭曲")').click()
    await page.waitForTimeout(300)
  }

  // Contrast Sensitivity Test
  await page.waitForSelector('text=客观对比敏感度筛查')
  await page.locator('button:has-text("看不清")').click()
  await page.waitForTimeout(500)

  await page.waitForSelector('text=视力评估报告')
  console.log('Vision Test Completed.')
}

// 模拟弱视/抑制检查 (Left Suppression scenario)
const playAmblyopiaTest = async (page) => {
  console.log('\n--- Starting Amblyopia Test ---')
  await page.goto(`${BASE_URL}/#/home`, { waitUntil: 'networkidle' })
  await page.locator('.cards-wrapper .elegant-card:has-text("弱视/抑制检查")').click()
  await page.waitForLoadState('networkidle')

  // SectionIntroAmblyopia has a start button
  await page.waitForSelector('text=弱视 / 抑制检查')
  await page.locator('button:has-text("我已准备好，开始")').click()
  await page.waitForLoadState('networkidle')

  // LensSelection
  await page.waitForSelector('text=系统需要确认您的镜片方向')
  await page.locator('.lens-btn').first().click()

  // LensConfirmation
  await page.waitForSelector('text=系统校准成功')
  await clickBottomNav(page, 'next')

  // DistanceAdvice
  await page.waitForSelector('text=测试距离提示')
  await clickBottomNav(page, 'next')

  // SuppressionTest Intro -> Start
  await page.waitForSelector('text=客观双眼抑制测试')
  await clickBottomNav(page, 'next')

  // Play 10 trials for Left Suppression
  await page.waitForSelector('.e-symbol')
  
  for (let i = 0; i < 10; i++) {
    await page.waitForSelector('.e-symbol')
    const classAttr = await page.locator('.e-symbol').getAttribute('class')
    
    let actualDir = 'up'
    if (classAttr.includes('dir-down')) actualDir = 'down'
    else if (classAttr.includes('dir-left')) actualDir = 'left'
    else if (classAttr.includes('dir-right')) actualDir = 'right'

    const isLeftEye = classAttr.includes('color-cyan')
    const isRightEye = classAttr.includes('color-red')

    let shouldCorrect = false
    if (isLeftEye) shouldCorrect = false // Left eye suppressed (wrong answers)
    if (isRightEye) shouldCorrect = true // Right eye good (correct answers)

    let clickDir = actualDir
    if (!shouldCorrect) {
      const dirs = ['up', 'down', 'left', 'right'].filter(d => d !== actualDir)
      clickDir = dirs[0]
    }

    const btnSelector = `button .mdi-arrow-${clickDir}-bold`
    await page.locator(btnSelector).locator('..').click()
    await page.waitForTimeout(600)
  }

  await page.waitForSelector('text=左眼存在视觉抑制', { timeout: 10000 })
  await clickBottomNav(page, 'next')

  // Should go to Contrast Test
  await page.waitForSelector('text=客观暗光惩罚阈值测定')
  await clickBottomNav(page, 'next') // Start contrast test
  await page.waitForSelector('.e-symbol')
  
  for(let j = 0; j < 15; j++) {
    if (await page.locator('text=临界阈值测定成功').count() > 0) {
      break;
    }
    await page.locator('button .mdi-arrow-up-bold').locator('..').click()
    await page.waitForTimeout(500)
  }
  await page.waitForSelector('text=临界阈值测定成功')
  await clickBottomNav(page, 'next') // -> AmblyopiaAdvice

  await page.waitForSelector('text=弱视与抑制评估报告')
  console.log('Amblyopia Test Completed.')
}

const verifyProfileAndTraining = async (page) => {
  console.log('\n--- Verifying Profile & Training Badges ---')
  // Go to Profile
  await page.goto(`${BASE_URL}/#/profile`, { waitUntil: 'networkidle' })
  await page.waitForSelector('text=视觉健康档案与训练进度概览')
  
  // Verify data is populated (Left eye suppression)
  const suppressionText = await page.locator('text=双眼抑制状态').locator('..').innerText()
  if (!suppressionText.includes('左眼抑制')) {
    throw new Error(`Expected 左眼抑制, got: ${suppressionText}`)
  }
  console.log('Profile Verification Passed.')

  // Go to Training Menu
  await page.goto(`${BASE_URL}/#/training/menu`, { waitUntil: 'networkidle' })
  await page.waitForSelector('text=综合训练建议')

  // Verify Badges
  // For Left Suppression, the shuffle and boxes cards should have the "针对弱视" badge
  const amblyopiaBadgeCount = await page.locator('.v-chip:has-text("针对弱视")').count()
  if (amblyopiaBadgeCount < 2) {
    throw new Error(`Expected at least 2 amblyopia badges, got ${amblyopiaBadgeCount}`)
  }
  
  // Since we also did Vision Test (with likely poor acuity if we just clicked UP), there might be "缓解疲劳/近视" badges
  // We just check if the badges are correctly rendered.
  console.log('Training Badges Verification Passed.')
}

const run = async () => {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  page.on('pageerror', err => {
    console.error('PAGE EXCEPTION:', err)
  })

  console.log('=== Start Full Linkage E2E Test ===')
  
  await playVisionTest(page)
  await playAmblyopiaTest(page)
  await verifyProfileAndTraining(page)

  console.log('\n=== Full Linkage Flow Passed Successfully ===')
  
  await context.close()
  await browser.close()
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
