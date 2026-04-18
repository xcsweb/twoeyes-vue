from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:5173/twoeyes-vue/#/home')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)
    
    print("Clicking Diplopia card...")
    try:
        page.locator('.elegant-card', has_text='复视检查').click()
        page.wait_for_timeout(1000)
        
        print("In SectionIntroDiplopia, clicking next...")
        page.locator('button', has_text='我已准备好，开始').click()
        page.wait_for_timeout(1000)
        
        print("In MonocularDiplopiaTest - Right eye")
        page.locator('button', has_text='有重影').click()
        page.wait_for_timeout(500)
        page.locator('.mdi-arrow-right').locator('..').click()
        page.locator('button', has_text='完成调整').click()
        page.wait_for_timeout(1000)
        
        print("In MonocularDiplopiaTest - Left eye")
        page.locator('button', has_text='无重影').click()
        page.wait_for_timeout(1000)
        
        print("In BinocularDiplopiaTest")
        page.locator('button', has_text='有分离').click()
        page.wait_for_timeout(500)
        page.locator('button', has_text='完成调整').click()
        page.wait_for_timeout(1000)
        
        print("In DiplopiaAdvice")
        content = page.content()
        if '测试数据分析' in content and '复视诊断结果报告' in content:
            print("SUCCESS: Reached DiplopiaAdvice and it rendered correctly.")
        else:
            print("FAILED: Did not reach DiplopiaAdvice or it did not render correctly.")
            
    except Exception as e:
        print("Error:", e)
        page.screenshot(path="error.png")
        
    browser.close()
