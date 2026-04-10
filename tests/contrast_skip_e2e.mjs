import { chromium } from 'playwright'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8006'

const clickBottomNav = async (page, value) => {
  await page.locator(`.v-bottom-navigation button[value="${value}"]`).click({ timeout: 5000 })
  await page.waitForTimeout(800)
  await page.waitForLoadState('networkidle')
}

// 模拟答题过程，专门测试是否跳过 ContrastTest
const testContrastSkip = async (page, scenario) => {
  console.log(`\n--- Starting Test: ContrastTest Skip Behavior for [${scenario}] ---`)
  // Home -> Intro
  await page.goto(`${BASE_URL}/#/home`, { waitUntil: 'networkidle' })
  await page.locator('.cards-wrapper .elegant-card:has-text("斜视检查")').click()
  await page.waitForLoadState('networkidle')
  
  // SectionIntroExam -> LensSelection
  await page.waitForSelector('text=临床级视功能检查')
  await clickBottomNav(page, 'next')

  // LensSelection -> LensConfirmation
  await page.waitForSelector('text=系统需要确认您的镜片方向')
  // We click the Red-Cyan button
  await page.locator('.lens-btn').first().click()

  // LensConfirmation -> DistanceAdvice
  await page.waitForSelector('text=系统校准成功')
  await clickBottomNav(page, 'next')

  // DistanceAdvice -> SuppressionTest
  await page.waitForSelector('text=测试距离提示')
  await clickBottomNav(page, 'next')

  // SuppressionTest Intro -> Start Test
  await page.waitForSelector('text=客观双眼抑制测试')
  await clickBottomNav(page, 'next') // Starts test

  // Play 10 trials
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

    let shouldCorrect = true

    if (scenario === 'normal_skip') {
      shouldCorrect = true // All correct -> No suppression -> Should Skip
    } else if (scenario === 'suppression_enter') {
      // Left eye bad, Right eye good -> Left suppression -> Should Enter
      if (isLeftEye) shouldCorrect = false
      if (isRightEye) shouldCorrect = true
    }

    let clickDir = actualDir
    if (!shouldCorrect) {
      const dirs = ['up', 'down', 'left', 'right'].filter(d => d !== actualDir)
      clickDir = dirs[0]
    }

    await page.locator(`button .mdi-arrow-${clickDir}-bold`).locator('..').click()
    await page.waitForTimeout(600)
  }

  // Wait for result section
  await page.waitForSelector('text=客观测试结果分析', { timeout: 10000 })
  
  if (scenario === 'normal_skip') {
    await page.waitForSelector('text=没有明显的单眼抑制现象')
    console.log('Suppression Result: Normal')
  } else if (scenario === 'suppression_enter') {
    await page.waitForSelector('text=左眼存在视觉抑制')
    console.log('Suppression Result: Left Suppression')
  }

  // Click confirm
  await clickBottomNav(page, 'next')

  // === CORE VERIFICATION ===
  if (scenario === 'normal_skip') {
    // Verify we skipped ContrastTest and went straight to AlignmentIntro
    try {
      await page.waitForSelector('text=十字准星对齐测试', { timeout: 5000 })
      console.log('SUCCESS: ContrastTest was successfully SKIPPED.')
    } catch (e) {
      console.error('FAILED: ContrastTest was NOT skipped, or did not reach Alignment Intro.')
      process.exit(1)
    }
  } else if (scenario === 'suppression_enter') {
    // Verify we entered ContrastTest
    try {
      await page.waitForSelector('text=客观暗光惩罚阈值测定', { timeout: 5000 })
      console.log('SUCCESS: ContrastTest was successfully ENTERED.')
    } catch (e) {
      console.error('FAILED: ContrastTest was SKIPPED incorrectly.')
      process.exit(1)
    }
  }
}

const run = async () => {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  page.on('pageerror', err => {
    console.error('PAGE EXCEPTION:', err)
  })

  console.log('=== Start ContrastTest Routing Logic E2E Test ===')
  
  // 1. Test Skip Logic (Normal)
  await testContrastSkip(page, 'normal_skip')
  
  // 2. Test Enter Logic (Suppression)
  await testContrastSkip(page, 'suppression_enter')

  console.log('\n=== Both Routing Scenarios Verified Successfully ===')
  
  await context.close()
  await browser.close()
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})