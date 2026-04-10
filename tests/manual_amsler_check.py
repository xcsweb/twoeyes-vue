from playwright.sync_api import sync_playwright


def main() -> None:
    base_url = "http://localhost:5177/twoeyes-vue/#/vision/amsler-grid-test"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 720})

        page.goto(base_url)
        page.wait_for_load_state("networkidle")

        page.screenshot(path="/workspace/twoeyes-vue/tests/_amsler_01_loaded.png", full_page=True)

        # Try clicking 4 trials (quadrants) to complete the test.
        # Click the top-left quadrant each time (not necessarily correct).
        for i in range(4):
            page.locator(".q-tl").click()
            page.wait_for_timeout(200)
            page.screenshot(
                path=f"/workspace/twoeyes-vue/tests/_amsler_0{2+i}_after_click.png",
                full_page=True,
            )

        # After 4 trials, flow should navigate to Contrast Sensitivity test.
        page.wait_for_timeout(500)
        page.screenshot(path="/workspace/twoeyes-vue/tests/_amsler_06_after_finish.png", full_page=True)

        browser.close()


if __name__ == "__main__":
    main()

