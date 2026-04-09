import { chromium } from 'playwright'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8003'

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

  console.log('=== E2E: Intro and Home ===')
  await page.goto(BASE_URL, { waitUntil: 'networkidle' })
  if (await page.locator('text=开始体验').count()) {
    await page.locator('button:has-text("开始体验")').click()
    await page.waitForLoadState('networkidle')
  }
  await page.waitForSelector('text=双眼视觉康复系统')

  console.log('=== E2E: Exam Flow ===')
  await page.locator('.cards-wrapper .elegant-card:has-text("斜视检查")').click()
  await page.waitForLoadState('networkidle')

  await clickBottomNav(page, 'next')

  await page.locator('button:has-text("左眼是红色")').click()
  await page.waitForTimeout(800)
  await page.waitForLoadState('networkidle')

  if (await page.locator('button:has-text("确认配置并进入下一步")').count()) {
    await page.locator('button:has-text("确认配置并进入下一步")').click()
  } else if (await page.locator('button:has-text("下一步")').count()) {
    await page.locator('button:has-text("下一步")').click()
  }
  await page.waitForTimeout(800)
  await page.waitForLoadState('networkidle')

  await page.waitForSelector('text=双眼抑制客观测试')
  await page.locator('.option-btn').nth(1).click()
  await page.waitForTimeout(500)

  if (await page.locator('button:has-text("继续进行十字准星对齐测试")').count()) {
    await page.locator('button:has-text("继续进行十字准星对齐测试")').click()
    await page.waitForLoadState('networkidle')
  }

  // 抑制测试现在只有选项按钮作为下一步入口，没有底部下一步导航了
  // 但可能存在过场动画或者直接跳转到了下一个Intro页面
  await page.waitForTimeout(1000)
  
  if (await page.locator('button:has-text("开始对齐测试")').count()) {
      await page.locator('button:has-text("开始对齐测试")').click()
  } else if (await page.locator('.v-bottom-navigation button[value="next"]').count()) {
      // 兼容可能跳到了 SectionIntroAlignment
      await clickBottomNav(page, 'next')
  }

  await page.waitForSelector('button:has-text("确认对齐")')
  await page.locator('button:has-text("确认对齐")').click()
  await page.waitForTimeout(800)
  await page.waitForLoadState('networkidle')

  if ((await page.content()).includes('建议') || (await page.content()).includes('偏移量')) {
    await clickBottomNav(page, 'next') // 回到主页现在用的是 next
  }

  console.log('=== E2E: Training Menu ===')
  await page.goto(`${BASE_URL}/training/menu`, { waitUntil: 'networkidle' })
  await page.waitForSelector('text=选择训练阶段')

  console.log('=== E2E: Theory and Paper ===')
  await page.goto(`${BASE_URL}/home`, { waitUntil: 'networkidle' })
  await page.locator('.cards-wrapper .elegant-card:has-text("原理解析与文献")').click()
  await page.waitForLoadState('networkidle')
  await page.waitForSelector('text=核心参考论文与临床指南')
  await page.locator('.clickable-item').first().click()
  await page.waitForLoadState('networkidle')
  await page.waitForSelector('text=摘要 (中文翻译)')

  console.log('=== E2E Passed ===')
  await context.close()
  await browser.close()
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})

