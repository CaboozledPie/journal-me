from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

import selenium_tools

from uuid import uuid4
import time


def test_search():
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
        title_input = driver.find_element(By.ID, "title").send_keys("Search Test 1 " + test_id)
        content_input = driver.find_element(By.ID, "content").send_keys("i love cs35l! " + test_id)
        submit_button = driver.find_element(By.CLASS_NAME, "add-post-btn").click()

        time.sleep(1) # forms can get overloaded

        title_input = driver.find_element(By.ID, "title").send_keys("Search Test 2 " + test_id)
        content_input = driver.find_element(By.ID, "content").send_keys("i hate cs35l! " + test_id)
        submit_button = driver.find_element(By.CLASS_NAME, "add-post-btn").click()

        # reload and try search filtering
        driver.refresh()
        selenium_tools.wait_id(driver, "skip-google-btn")
        login_button = driver.find_element(By.ID, "skip-google-btn").click()
        
        # query for search test 1
        search_input = selenium_tools.wait_class(driver, "search-input").send_keys("love")
        time.sleep(0.5)
        search_button = selenium_tools.wait_class(driver, "search-btn").click()

        # verify query
        assert selenium_tools.wait_class_text(driver, "post-title", "Search Test 1 " + test_id)
        assert selenium_tools.wait_class_text(driver, "post-content", "i love cs35l! " + test_id)
        assert len(driver.find_elements(By.XPATH, f"//h3[@class='post-content' and text()='i hate cs35l! {test_id}']")) == 0

        # query for search test 2
        search_input = selenium_tools.wait_class(driver, "search-input")
        time.sleep(0.5)
        search_input.clear()
        search_input.send_keys("hate")
        time.sleep(0.5)
        search_button = selenium_tools.wait_class(driver, "search-btn").click()
    
        # verify query
        assert selenium_tools.wait_class_text(driver, "post-title", "Search Test 2 " + test_id)
        assert selenium_tools.wait_class_text(driver, "post-content", "i hate cs35l! " + test_id)
        assert len(driver.find_elements(By.XPATH, f"//h3[@class='post-content' and text()='i love cs35l! {test_id}']")) == 0
        
        # reset query again
        search_input = selenium_tools.wait_class(driver, "search-input")
        time.sleep(0.5)
        search_input.clear()
        search_input.send_keys("A") # looks sus but js doesnt handle .clear() well
        search_input.send_keys(Keys.BACKSPACE)
        time.sleep(0.5)
        search_button = selenium_tools.wait_class(driver, "search-btn").click()

        # verify query
        assert selenium_tools.wait_class_text(driver, "post-content", "i love cs35l! " + test_id)
        assert selenium_tools.wait_class_text(driver, "post-content", "i hate cs35l! " + test_id)

        # delete them and log out
        delete_button1 = driver.find_element(By.XPATH, "//button[@class='delete-post-btn' and @id='delete-0']")
        delete_button2 = driver.find_element(By.XPATH, "//button[@class='delete-post-btn' and @id='delete-1']")
        delete_button1.click()
        delete_button2.click()
        time.sleep(1) # just in case deletes take a bit

        # logout
        selenium_tools.wait_class(driver, "logout-btn").click()
        assert selenium_tools.wait_class(driver, "login-title")

    finally:
        driver.quit()
