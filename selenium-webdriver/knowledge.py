# todo: スクリーンショット
# todo: 複数ブラウザ対応
# todo: 適切な関数化やaiの統合で複数ブラウザ、複数テストケースに簡単に対応

from selenium import webdriver
from selenium.webdriver.common.by import By

BASE_URL = "https://develop.example.com/"

# ブラウザを起動
driver_chrome = webdriver.Chrome()
driver_chrome.get(BASE_URL)

# 要素を見つけてクリック(name属性)
name_attr = driver_chrome.find_element(By.NAME, "name属性の値")
name_attr.click()

# 要素を見つけてクリック(hrefの内容)
href_attr = driver_chrome.find_element(By.CSS_SELECTOR, "a[href='{BASE_URL}path/to/page']")
href_attr.click()

# 要素を見つけてクリック(リンクテキスト)
link_text = driver_chrome.find_element(By.LINK_TEXT, "リンクの中の文字")
link_text.click()

# 要素を見つけてクリック、type='submit'のbuttonタグ
button_type_submit =  driver_chrome.find_element(By.CSS_SELECTOR, "button[type='submit']")
button_type_submit.click()

# inputに文字を入力
custname_field = driver_chrome.find_element(By.NAME, "namae")
custname_field.send_keys("テストタロウ")

# pulldownメニューから選択
payment_method = driver_chrome.find_element(By.NAME, "selectのname属性")
for option in payment_method.find_elements(By.TAG_NAME, "option"):
    if option.text == "選択したいものの文字":
        option.click()
        break

# button type buttonのbuttonタグをクリック
button_type_button = driver_chrome.find_element(By.CSS_SELECTOR, "button[id='order-submit']")
button_type_button.click()

# chrome webdriverを終了
driver_chrome.quit()

# # safari
# driver_safari = webdriver.Safari()
# driver_safari.get(BASE_URL)

# # 要素を見つけてクリック
# element = driver_safari.find_element(By.ID, "submit-button")
# element.click()

# driver_safari.quit()
