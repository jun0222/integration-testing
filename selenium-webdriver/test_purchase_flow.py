from selenium import webdriver
from selenium.webdriver.common.by import By
import time

BASE_URL="/selenium-webdriver/mock_site/index.html"

# ブラウザを起動
driver_chrome = webdriver.Chrome()
driver_chrome.get(BASE_URL)

time.sleep(3)