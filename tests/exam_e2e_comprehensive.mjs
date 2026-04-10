import { chromium } from 'playwright'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8006'

const clickBottomNav = async (page, value) => {
  await page.locator(`.v-bottom-navigation button[value="${value}"]`).click({ timeout: 5000 })
  await page.waitForTimeout(800)
  await page.waitForLoadState('networkidle')
}

// 模拟答题过程
const playObjectiveTest = async (page, scenario) => {
  console.log(`\n--- Starting Scenario: ${scenario} ---`)
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
    
    // Parse direction
    let actualDir = 'up'
    if (classAttr.includes('dir-down')) actualDir = 'down'
    else if (classAttr.includes('dir-left')) actualDir = 'left'
    else if (classAttr.includes('dir-right')) actualDir = 'right'

    // Parse eye (Left eye red config -> left is color-cyan, right is color-red)
    const isLeftEye = classAttr.includes('color-cyan')
    const isRightEye = classAttr.includes('color-red')

    let shouldCorrect = true

    if (scenario === 'normal') {
      shouldCorrect = true // All correct
    } else if (scenario === 'left_suppression') {
      // Left eye bad, Right eye good
      if (isLeftEye) shouldCorrect = false
      if (isRightEye) shouldCorrect = true
    } else if (scenario === 'right_suppression') {
      // Right eye bad, Left eye good
      if (isLeftEye) shouldCorrect = true
      if (isRightEye) shouldCorrect = false
    } else if (scenario === 'diplopia') {
      // Both bad
      shouldCorrect = false
    }

    let clickDir = actualDir
    if (!shouldCorrect) {
      // Pick a wrong direction
      const dirs = ['up', 'down', 'left', 'right'].filter(d => d !== actualDir)
      clickDir = dirs[0]
    }

    // click the button for that direction
    const btnSelector = `button .mdi-arrow-${clickDir}-bold`
    await page.locator(btnSelector).locator('..').click()
    await page.waitForTimeout(600)
  }

  // Wait for result section
  await page.waitForSelector('text=客观测试结果分析', { timeout: 10000 })
  
  // Verify Result text
  if (scenario === 'normal') {
    await page.waitForSelector('text=没有明显的单眼抑制现象')
    console.log('Result validated: Normal')
  } else if (scenario === 'left_suppression') {
    await page.waitForSelector('text=左眼存在视觉抑制')
    console.log('Result validated: Left Suppression')
  } else if (scenario === 'right_suppression') {
    await page.waitForSelector('text=右眼存在视觉抑制')
    console.log('Result validated: Right Suppression')
  } else if (scenario === 'diplopia') {
    await page.waitForSelector('text=严重的复视')
    console.log('Result validated: Diplopia')
  }

  // Click confirm
  await clickBottomNav(page, 'next')

  // Check next route
  if (scenario === 'normal' || scenario === 'diplopia') {
    // Should skip contrast test and go to Alignment Intro
    await page.waitForSelector('text=十字准星对齐测试')
    console.log('Skipped Contrast Test successfully.')
  } else {
    // Should go to Contrast Test
    await page.waitForSelector('text=客观暗光惩罚阈值测定')
    console.log('Entered Contrast Test successfully.')
    
    // Quick play contrast test to finish
    await clickBottomNav(page, 'next') // Start contrast test
    await page.waitForSelector('.e-symbol')
    
    // Just click randomly until maxTrials or threshold
    for(let j = 0; j < 15; j++) {
      if (await page.locator('text=临界阈值测定成功').count() > 0) {
        break;
      }
      await page.locator('button .mdi-arrow-up-bold').locator('..').click()
      await page.waitForTimeout(500)
    }
    await page.waitForSelector('text=临界阈值测定成功')
    await clickBottomNav(page, 'next') // confirm result
    
    // Now should be at Alignment
    await page.waitForSelector('text=十字准星对齐测试')
    console.log('Finished Contrast Test successfully.')
  }
}

const run = async () => {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  page.on('pageerror', err => {
    console.error('PAGE EXCEPTION:', err)
  })

  console.log('=== Start Comprehensive Exam E2E Test ===')
  
  await playObjectiveTest(page, 'normal')
  await playObjectiveTest(page, 'left_suppression')
  await playObjectiveTest(page, 'right_suppression')
  await playObjectiveTest(page, 'diplopia')

  console.log('\n=== All Scenarios Passed Successfully ===')
  
  await context.close()
  await browser.close()
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
