from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    print("Navigating to Home...")
    page.goto('http://localhost:8002/home')
    page.wait_for_load_state('networkidle')

    print("Testing Secret Debug Mode...")
    # Click the title 5 times to trigger debug mode
    title = page.locator('.title').first
    for _ in range(5):
        title.click()
        page.wait_for_timeout(100) # Small delay to ensure click registers

    # Handle the alert dialogue
    page.on("dialog", lambda dialog: dialog.accept())
    
    # Wait for the dialog to appear
    page.wait_for_selector('.v-dialog')

    # Click the 'Unlock All Stages' button
    unlock_btn = page.locator('button:has-text("一键解锁所有训练阶段")')
    unlock_btn.click()

    page.wait_for_timeout(500) # Give time for state to update

    print("Navigating to Training Menu...")
    # Navigate to Training Menu (Second card in Home Menu)
    training_card = page.locator('text="康复训练"')
    training_card.click()
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(500)

    print("Verifying Stages Unlock Status...")
    # Verify stages are unlocked
    cards = page.locator('.cards-wrapper .elegant-card')
    count = cards.count()
    print(f"Found {count} stage cards.")

    all_unlocked = True
    for i in range(count):
        card = cards.nth(i)
        is_locked = "locked-card" in card.get_attribute("class")
        stage_name = card.locator('.card-title').inner_text()
        status = "Locked" if is_locked else "Unlocked"
        print(f"Stage {i+1} ({stage_name}): {status}")
        if is_locked:
            all_unlocked = False

    if all_unlocked:
        print("SUCCESS: All stages unlocked correctly!")
    else:
        print("ERROR: Not all stages unlocked!")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
