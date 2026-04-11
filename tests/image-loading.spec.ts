import { test, expect } from '@playwright/test';

test.describe('Image Loading Tests', () => {

  test('HomeMenuLevel should load all images successfully', async ({ page }) => {
    // Navigate and bypass the intro screen
    await page.goto('/#/');
    
    // Check if we are on the intro screen (which might block the cards)
    const startBtnCount = await page.locator('.start-btn').count();
    if (startBtnCount > 0) {
       await page.locator('.start-btn').click();
    }

    await page.waitForSelector('.elegant-card', { timeout: 10000 });
    
    await page.waitForTimeout(500);

    const images = await page.locator('.card-img-wrapper img').all();
    expect(images.length).toBeGreaterThan(0);
    
    for (const img of images) {
      await img.scrollIntoViewIfNeeded();
      const isLoaded = await img.evaluate(async (el: HTMLImageElement) => {
        if (!el.complete) {
            await new Promise(resolve => {
                el.onload = resolve;
                el.onerror = resolve;
            });
        }
        return el.naturalWidth > 0;
      });
      expect(isLoaded).toBeTruthy();
    }
  });

  test('TrainingMenuLevel should load all stage images successfully', async ({ page }) => {
    await page.goto('/#/');
    const startBtnCount = await page.locator('.start-btn').count();
    if (startBtnCount > 0) {
       await page.locator('.start-btn').click();
    }
    
    // In our app, sometimes user must go to home then click Training to load properly due to store
    await page.goto('/#/');
    await page.waitForSelector('.elegant-card', { timeout: 10000 });
    // Click the Training card
    await page.locator('.elegant-card:has-text("康复训练")').click();

    await page.waitForSelector('.elegant-card', { timeout: 10000 });

    const images = await page.locator('.card-img-wrapper img').all();
    expect(images.length).toBeGreaterThan(0);

    for (const img of images) {
      await img.scrollIntoViewIfNeeded();
      const isLoaded = await img.evaluate(async (el: HTMLImageElement) => {
        if (!el.complete) {
            await new Promise(resolve => {
                el.onload = resolve;
                el.onerror = resolve;
            });
        }
        return el.naturalWidth > 0;
      });
      expect(isLoaded).toBeTruthy();
    }
  });

  test('SectionIntroLevel (Stage 2) should load all game images successfully', async ({ page }) => {
    await page.goto('/#/');
    const startBtnCount = await page.locator('.start-btn').count();
    if (startBtnCount > 0) {
       await page.locator('.start-btn').click();
    }
    
    await page.goto('/#/training/intro-2', { waitUntil: 'networkidle' });
    await page.waitForSelector('.elegant-card', { timeout: 10000 });

    const images = await page.locator('.card-img-wrapper img').all();
    expect(images.length).toBeGreaterThan(0);

    for (const img of images) {
      await img.scrollIntoViewIfNeeded();
      const isLoaded = await img.evaluate(async (el: HTMLImageElement) => {
        if (!el.complete) {
            await new Promise(resolve => {
                el.onload = resolve;
                el.onerror = resolve;
            });
        }
        return el.naturalWidth > 0;
      });
      expect(isLoaded).toBeTruthy();
    }
  });

});