from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

import selenium_tools

import time


def test_basic():
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
        title_input = driver.find_element(By.ID, "title").send_keys("Test 1")
        content_input = driver.find_element(By.ID, "content").send_keys("i love cs35l!")
        submit_button = driver.find_element(By.CLASS_NAME, "add-post-btn").click()

        assert selenium_tools.wait_class_text(driver, "post-title", "Test 1")
        assert selenium_tools.wait_class_text(driver, "post-content", "i love cs35l!")

        title_input = driver.find_element(By.ID, "title").send_keys("Test 2")
        content_input = driver.find_element(By.ID, "content").send_keys("i hate cs35l!")
        submit_button = driver.find_element(By.CLASS_NAME, "add-post-btn").click()

        assert selenium_tools.wait_class_text(driver, "post-title", "Test 2")
        assert selenium_tools.wait_class_text(driver, "post-content", "i hate cs35l!")

        # assert items are still there
        driver.refresh()
        selenium_tools.wait_id(driver, "skip-google-btn")
        login_button = driver.find_element(By.ID, "skip-google-btn").click()
        
        breakpoint()
        assert selenium_tools.wait_class_text(driver, "post-title", "Test 1")
        assert selenium_tools.wait_class_text(driver, "post-content", "i love cs35l!")

        assert selenium_tools.wait_class_text(driver, "post-title", "Test 2")
        assert selenium_tools.wait_class_text(driver, "post-content", "i hate cs35l!")

        # test delete
        delete_button1 = driver.find_element(By.XPATH, "//button[@class='delete-post-btn' and @id='block-0']")
        delete_button2 = driver.find_element(By.XPATH, "//button[@class='delete-post-btn' and @id='block-0']")
        delete_button1.click()
        delete_button2.click()

        # assert removed from ui
        assert driver.find_element(By.ID, 'post-title-0') == False
        assert driver.find_element(By.ID, 'post-title-1') == False

        # refresh and assert permanent removal
        driver.refresh()
        selenium_tools.wait_id(driver, "title")
        assert driver.find_element(By.XPATH, "//h3[@id='post-content-0' and text()='i love cs35l!']") == False
        assert driver.find_element(By.XPATH, "//h3[@id='post-content-1' and text()='i love cs35l!']") == False

        # logout
        selenium_tools.wait_class(driver, "logout-btn").click()
        assert selenium_tools.wait_class(driver, "login-title")

    finally:
        driver.quit()
