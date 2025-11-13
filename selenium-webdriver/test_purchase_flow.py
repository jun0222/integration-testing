from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from pathlib import Path

BASE_URL = Path.cwd().joinpath("selenium-webdriver/mock_site/index.html").as_uri()

# ブラウザを起動
driver = webdriver.Chrome()
driver.get(BASE_URL)
time.sleep(2)

print("1. 商品一覧ページに移動完了")

# 2. 商品をカートに追加
print("2. ノートパソコンをカートに追加...")
laptop_button = driver.find_element(By.XPATH, "//button[contains(@onclick, 'laptop-001')]")
laptop_button.click()
time.sleep(1)

# 3. カートアイコンをクリック
print("3. カートページに移動...")
cart_icon = driver.find_element(By.CLASS_NAME, "cart-icon")
cart_icon.click()
time.sleep(2)

# 4. レジに進む
print("4. レジに進む...")
checkout_btn = driver.find_element(By.ID, "checkout-btn")
checkout_btn.click()
time.sleep(2)

# 5. フォームに入力
print("5. 注文フォームに入力...")
driver.find_element(By.ID, "name").send_keys("田中太郎")
driver.find_element(By.ID, "email").send_keys("test@example.com")
driver.find_element(By.ID, "phone").send_keys("090-1234-5678")
driver.find_element(By.ID, "postal").send_keys("123-4567")

# 都道府県を選択
prefecture = driver.find_element(By.ID, "prefecture")
prefecture.send_keys("東京都")

driver.find_element(By.ID, "city").send_keys("渋谷区")
driver.find_element(By.ID, "address").send_keys("1-2-3")

# 利用規約チェック
terms = driver.find_element(By.ID, "terms")
terms.click()

# 6. 注文確定
print("6. 注文を確定...")
submit_btn = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
submit_btn.click()
time.sleep(3)

# 7. 完了ページの確認
print("7. 注文完了ページを確認...")
current_url = driver.current_url
if "complete.html" in current_url:
    print("✅ 購入フロー完了！")
else:
    print("❌ 購入フロー失敗")

time.sleep(3)
driver.quit()