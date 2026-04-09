from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    # Use a persistent context or just a fresh context
    context = browser.new_context()
    page = context.new_page()

    def handle_dialog(dialog):
        print(f"DIALOG APPEARED: {dialog.message}")
        dialog.accept()

    def handle_console(msg):
        if msg.type == "error":
            print(f"BROWSER ERROR: {msg.text}")

    page.on("console", handle_console)
    page.on("pageerror", lambda err: print(f"PAGE EXCEPTION: {err}"))
    page.on("dialog", handle_dialog)

    BASE_URL = 'http://localhost:8003' # Using port 8003 since the server is running on it
    
    print("=== Task 2: Intro and Home Navigation ===")
    page.goto(BASE_URL)
    page.wait_for_load_state('networkidle')
    
    # 1. Verify Intro page is loaded first time
    assert "欢迎来到双眼视觉康复系统" in page.content() or "本系统将通过红蓝分离" in page.content() or "请确保您已经准备好" in page.content()
    
    # Click start button
    start_btn = page.locator('button:has-text("开始体验")')
    start_btn.click()
    page.wait_for_load_state('networkidle')
    
    # Verify Home loaded
    assert "双眼视觉康复系统" in page.content()
    
    # 2. Verify redirect skips Intro on next visit
    page.goto(BASE_URL)
    page.wait_for_load_state('networkidle')
    # Should be on Home directly
    assert "临床级视功能检查" in page.content()

    print("=== Task 3: Exam Flow (Lens -> Alignment -> Suppression) ===")
    # Click Exam card
    exam_card = page.locator('.cards-wrapper .elegant-card:has-text("斜视检查")')
    exam_card.click()
    page.wait_for_load_state('networkidle')
    
    # Exam Intro
    page.wait_for_load_state('networkidle')
    page.locator('.v-bottom-navigation button[value="next"]').click()
    page.wait_for_timeout(1000)
    page.wait_for_load_state('networkidle')

    # Lens Selection
    print("Lens Selection content:", page.locator('body').inner_text()[:500])
    assert "左眼" in page.content() or "滤片" in page.content()
    # Select Red-Cyan
    page.locator('button:has-text("左眼是红色")').click()
    page.wait_for_timeout(1000)
    page.wait_for_load_state('networkidle')

    # Lens Confirmation
    if "确认" in page.content():
        # Usually it shows a confirmation page. We click next or continue.
        try:
            page.locator('button:has-text("确认配置并进入下一步")').click(timeout=3000)
        except:
            page.locator('button:has-text("下一步")').click(timeout=3000)
        page.wait_for_timeout(1000)
        page.wait_for_load_state('networkidle')
    
    # Section Intro for Suppression Test
    print("Looking for Suppression Intro...")
    if "点击继续" in page.content():
        page.locator('button:has-text("点击继续")').click()
        page.wait_for_timeout(1000)
        page.wait_for_load_state('networkidle')
        
    # Suppression Test
    print("Suppression Test content:", page.locator('body').inner_text()[:500])
    assert "双眼抑制客观测试" in page.content() or "四点" in page.content()
    # Select option 2 (Right eye suppression)
    page.locator('.option-btn').nth(1).click()
    # Wait for result to appear
    page.wait_for_selector('.v-alert--variant-tonal')
    assert "存在抑制现象" in page.content()
    
    # Click "继续进行十字准星对齐测试" to go to Alignment
    page.locator('button:has-text("继续进行十字准星对齐测试")').click(timeout=3000)
    page.wait_for_timeout(1000)
    page.wait_for_load_state('networkidle')

    # Section Intro for Alignment
    page.locator('.v-bottom-navigation button[value="next"]').click()
    page.wait_for_timeout(1000)
    page.wait_for_load_state('networkidle')

    # Alignment Exercise
    assert "十字准星" in page.content() or "对齐" in page.content()
    page.locator('button:has-text("确认对齐")').click()
    page.wait_for_timeout(1000)
    page.wait_for_load_state('networkidle')

    # Alignment Advice (if exists)
    if "建议" in page.content() or "偏移量" in page.content():
        page.locator('.v-bottom-navigation button[value="home"]').click(timeout=3000)
        page.wait_for_timeout(1000)
        page.wait_for_load_state('networkidle')


    print("=== Task 4: Training Menu & Debug Unlock ===")
    page.goto(BASE_URL + '/home')
    page.wait_for_load_state('networkidle')
    
    training_card = page.locator('.cards-wrapper .elegant-card').filter(has=page.locator('h2', has_text="康复训练")).first
    training_card.click()
    page.wait_for_load_state('networkidle')
    
    # Verify locks on stage 2,3,4
    page.wait_for_selector('.cards-wrapper .elegant-card')
    page.wait_for_timeout(1000)
    locked_cards = page.locator('.locked-card')
    print(f"Locked cards count: {locked_cards.count()}")
    assert locked_cards.count() == 3
    
    # Go back to home to use debug
    page.goto(BASE_URL + '/home')
    page.wait_for_load_state('networkidle')
    
    # Click title 5 times
    title = page.locator('.title').first
    for _ in range(5):
        title.click()
        page.wait_for_timeout(100)
        
    page.wait_for_selector('.v-dialog')
    
    # Click unlock
    unlock_btn = page.locator('button:has-text("一键解锁所有训练阶段")')
    unlock_btn.click()
    page.wait_for_timeout(500)
    
    # Go to training menu again
    page.goto(BASE_URL + '/training/menu')
    page.wait_for_load_state('networkidle')
    
    # Verify no locked cards
    assert page.locator('.locked-card').count() == 0

    print("=== Task 5: 3D Training Modules & Exit Button ===")
    
    stages_to_test = [
        ("阶段 1", "ShuffleExercise", "/training/shuffle"),
        ("阶段 2", "SaccadicTrackingExercise", "/training/saccadic"),
        ("阶段 3", "VergenceCardsExercise", "/training/vergence-cards"),
        ("阶段 4", "TetrisExercise", "/training/tetris")
    ]
    
    for stage_name, component_name, expected_url_part in stages_to_test:
        print(f"Testing {stage_name} ({component_name})...")
        page.goto(BASE_URL + '/training/menu')
        page.wait_for_load_state('networkidle')
        
        page.locator(f'h2:has-text("{stage_name}")').click()
        page.wait_for_timeout(1000)
        page.wait_for_load_state('networkidle')
        
        # Intro
        page.locator('.v-bottom-navigation button[value="next"]').click()
        page.wait_for_timeout(1000)
        page.wait_for_load_state('networkidle')
            
        assert expected_url_part in page.url
        page.wait_for_selector('.progress-hud')
        assert "累计训练" in page.content()
        
        # Test the newly added exit button
        page.locator('.exit-btn').click()
        page.wait_for_timeout(1000)
        page.wait_for_load_state('networkidle')
        assert "/training/menu" in page.url
        
    print("=== Task 6: Theory and Paper Navigation ===")
    page.goto(BASE_URL + '/home')
    page.wait_for_load_state('networkidle')
    
    # Click Theory card
    theory_card = page.locator('.cards-wrapper .elegant-card').filter(has=page.locator('h2', has_text="原理解析与文献")).first
    theory_card.click()
    page.wait_for_load_state('networkidle')
    
    # Verify TheoryLevel
    assert "参考文献" in page.content() or "原理解析" in page.content()
    
    # Click the first paper
    paper_card = page.locator('.clickable-item').first
    paper_card.click()
    page.wait_for_load_state('networkidle')
    
    # Verify PaperDetailLevel
    assert "摘要翻译" in page.content() or "原文链接" in page.content()
    
    # Check if the external link has correct href
    ext_link = page.locator('a.external-btn')
    assert "ncbi.nlm.nih.gov/pubmed" in ext_link.get_attribute("href") or "http" in ext_link.get_attribute("href")
    
    print("=== Task 7: Linkage and State Persistence ===")
    # Check if LocalStorage correctly saved the progress and settings
    settings_state = page.evaluate("window.localStorage.getItem('settings')")
    progress_state = page.evaluate("window.localStorage.getItem('progress')")
    
    assert settings_state is not None, "Settings state not persisted"
    assert progress_state is not None, "Progress state not persisted"
    assert "alignmentOffset" in settings_state, "Alignment offset linkage missing"
    assert "unlockedStage" in progress_state, "Unlocked stage linkage missing"

    print("=== All E2E Tests Passed! ===")

    context.close()
    browser.close()

if __name__ == '__main__':
    with sync_playwright() as playwright:
        run(playwright)
