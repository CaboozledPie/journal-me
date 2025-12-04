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
    wait_id(driver, id)
    element = WebDriverWait(driver, 10).until(
        EC.text_to_be_present_in_element((By.ID, id), text)
    )
    return element

def wait_class_text(driver, class_name, text):
    wait_class(driver, class_name)
    element = WebDriverWait(driver, 10).until(
        EC.text_to_be_present_in_element((By.CLASS_NAME, class_name), text)
    )
    return element
