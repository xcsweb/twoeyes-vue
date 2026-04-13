import { test, expect } from '@playwright/test';

test.describe('Bottom Navigation for Exercises', () => {
  test('Should display bottom nav on training menu', async ({ page }) => {
    // Navigate to the training menu
    await page.goto('/#/training/menu', { waitUntil: 'networkidle' });

    // Ensure bottom nav is visible
    const bottomNav = page.locator('.bottom-nav');
    await expect(bottomNav).toBeVisible();
  });

  const exercises = [
    { name: 'StereopsisExercise', path: '/#/exercises/stereopsis' },
    { name: 'TetrisExercise', path: '/#/training/tetris' },
    { name: 'ShuffleExercise', path: '/#/training/shuffle' },
    { name: 'BoxesExercise', path: '/#/training/boxes' },
    { name: 'SaccadicTrackingExercise', path: '/#/training/saccadic' },
    { name: 'SpiralExercise', path: '/#/training/spiral' },
    { name: 'ParticlesExercise', path: '/#/training/particles' },
    { name: 'VergenceCardsExercise', path: '/#/training/vergence-cards' },
    { name: 'BrockStringExercise', path: '/#/training/brock-string' }
  ];

  for (const exercise of exercises) {
    test(`Should navigate back and home for ${exercise.name}`, async ({ page }) => {
      // First go to a known page so we have history
      await page.goto('/#/training/menu', { waitUntil: 'networkidle' });
      // Then navigate to the exercise
      await page.goto(exercise.path, { waitUntil: 'networkidle' });

      // Ensure bottom nav is visible
      const bottomNav = page.locator('.bottom-nav');
      await expect(bottomNav).toBeVisible();

      // Check Back button and click it
      const backBtn = page.locator('.bottom-nav .v-btn[value="back"]');
      await expect(backBtn).toBeVisible();
      await backBtn.click();
      
      // Should go back to previous page in history (which is training menu)
      await expect(page).toHaveURL(/.*#\/training\/menu/);

      // Now test Home button
      await page.goto(exercise.path, { waitUntil: 'networkidle' });
      const homeBtn = page.locator('.bottom-nav .v-btn[value="home"]');
      await expect(homeBtn).toBeVisible();
      await homeBtn.click();
      
      // Should go to home
      await expect(page).toHaveURL(/.*#\/home/);
    });
  }
});
