from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

def test_basic():
    # Start Chrome
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

    try:
        # Navigate to localhost browser page 
        driver.get("http://localhost:5001")
        main_window = browser.current_window_handle
        
        # find google login button
        login_button = driver.find_element(By.ID, "google-login-btn").click()

        # navigate to new window
        WebDriverWait(browser, 10).until(lambda d: len(d.window_handles) > 1)

        # Find the window that actually has the Google login URL
        for handle in browser.window_handles:
            browser.switch_to.window(handle)
            if "accounts.google.com" in browser.current_url:
                break

        # login by typing in username
        email_input = browser.find_element(By.ID, "identifierId")
        email_input.send_keys("testc7484@gmail.com")
        next_button = driver.find_element(By.ID, "identifierNext").click()
        
        assert True

    finally:
        time.sleep(1)  # optional debug pause
        driver.quit()
