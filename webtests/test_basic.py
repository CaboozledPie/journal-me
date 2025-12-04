from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

import selenium_tools

from uuid import uuid4
import time


def test_basic():
    # unique id to avoid clashing tests
    test_id = str(uuid4())

    # Start Chrome
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

    try:
        # Navigate to localhost browser page 
        driver.get("http://localhost:5001")

        # login via test user
        selenium_tools.wait_id(driver, "skip-google-btn")
        login_button = driver.find_element(By.ID, "skip-google-btn").click()

        # add two new posts 
        selenium_tools.wait_id(driver, "title")
        title_input = driver.find_element(By.ID, "title").send_keys("Test 1 " + test_id)
        content_input = driver.find_element(By.ID, "content").send_keys("i love cs35l! " + test_id)
        submit_button = driver.find_element(By.CLASS_NAME, "add-post-btn").click()

        assert selenium_tools.wait_class_text(driver, "post-title", "Test 1 " + test_id)
        assert selenium_tools.wait_class_text(driver, "post-content", "i love cs35l! " + test_id)

        time.sleep(1) # forms can get overloaded

        title_input = driver.find_element(By.ID, "title").send_keys("Test 2 " + test_id)
        content_input = driver.find_element(By.ID, "content").send_keys("i hate cs35l! " + test_id)
        submit_button = driver.find_element(By.CLASS_NAME, "add-post-btn").click()

        assert selenium_tools.wait_class_text(driver, "post-title", "Test 2 " + test_id)
        assert selenium_tools.wait_class_text(driver, "post-content", "i hate cs35l! " + test_id)

        # assert items are still there
        driver.refresh()
        selenium_tools.wait_id(driver, "skip-google-btn")
        login_button = driver.find_element(By.ID, "skip-google-btn").click()
        
        assert selenium_tools.wait_class_text(driver, "post-title", "Test 1 " + test_id)
        assert selenium_tools.wait_class_text(driver, "post-content", "i love cs35l! " + test_id)

        assert selenium_tools.wait_class_text(driver, "post-title", "Test 2 " + test_id)
        assert selenium_tools.wait_class_text(driver, "post-content", "i hate cs35l! " + test_id)

        # test delete
        delete_button1 = driver.find_element(By.XPATH, "//button[@class='delete-post-btn' and @id='delete-0']")
        delete_button2 = driver.find_element(By.XPATH, "//button[@class='delete-post-btn' and @id='delete-1']")
        delete_button1.click()
        delete_button2.click()

        # assert removed from ui
        assert len(driver.find_elements(By.XPATH, f"//h3[@id='post-content-0' and text()='i hate cs35l! {test_id}']")) == 0
        assert len(driver.find_elements(By.XPATH, f"//h3[@id='post-content-1' and text()='i love cs35l! {test_id}']")) == 0

        # refresh and assert permanent removal
        driver.refresh()
        selenium_tools.wait_id(driver, "skip-google-btn")
        login_button = driver.find_element(By.ID, "skip-google-btn").click()
        selenium_tools.wait_id(driver, "title")
        assert len(driver.find_elements(By.XPATH, f"//h3[@id='post-content-0' and text()='i hate cs35l! {test_id}']")) == 0
        assert len(driver.find_elements(By.XPATH, f"//h3[@id='post-content-1' and text()='i love cs35l! {test_id}']")) == 0

        # logout
        selenium_tools.wait_class(driver, "logout-btn").click()
        assert selenium_tools.wait_class(driver, "login-title")

    finally:
        driver.quit()
