import { test, expect } from '@playwright/test'

test.describe('Global Flow and Navigation', () => {
  test('back button should fallback to Home if no history', async ({ page }) => {
    // Go directly to a deep link to bypass history
    await page.goto('/#/theory')
    
    // Look for back button and click it
    const backBtn = page.locator('.global-back-btn')
    await backBtn.click()
    
    // Should fallback to home
    await expect(page).toHaveURL(/#\/$/)
  })
})
