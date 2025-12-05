from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def wait_id (driver, id):
    element = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, id))
    )
    return element

def wait_class(driver, class_name):
    element = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.CLASS_NAME, class_name))
    )
    return element

def wait_id_text(driver, id, text):
    # waits for an element of a given id that contains the given text, times out after 10s
    xpath = f"//*[contains(@id, '{id}') and contains(., '{text}')]"
    element = WebDriverWait(driver, timeout).until(
        EC.presence_of_element_located((By.XPATH, xpath))
    )
    return element

def wait_class_text(driver, class_name, text):
    # waits for an element of a given class that contains the given text, times out after 10s
    xpath = f"//*[contains(@class, '{class_name}') and contains(., '{text}')]"
    element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, xpath))
    )
    return element
