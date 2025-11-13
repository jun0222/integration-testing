from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from pathlib import Path

BASE_URL = Path.cwd().joinpath("selenium-webdriver/mock_site/index.html").as_uri()

# ブラウザを起動
driver_chrome = webdriver.Chrome()
driver_chrome.get(BASE_URL)

time.sleep(3)