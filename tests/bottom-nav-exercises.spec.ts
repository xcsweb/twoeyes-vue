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
    test(`Should display bottom nav with back and home buttons for ${exercise.name}`, async ({ page }) => {
      // Navigate directly to the exercise
      await page.goto(exercise.path, { waitUntil: 'networkidle' });

      // Ensure bottom nav is visible
      const bottomNav = page.locator('.bottom-nav');
      await expect(bottomNav).toBeVisible();

      // Check Back button
      const backBtn = page.locator('.bottom-nav .v-btn[value="back"]');
      await expect(backBtn).toBeVisible();
      // Verify text (default is '上一步' based on App.vue, but checking existence is primary)
      // await expect(backBtn).toContainText('上一步');

      // Check Home button
      const homeBtn = page.locator('.bottom-nav .v-btn[value="home"]');
      await expect(homeBtn).toBeVisible();
      // await expect(homeBtn).toContainText('回到主页');
    });
  }
});
