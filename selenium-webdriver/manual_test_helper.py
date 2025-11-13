from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from pathlib import Path

BASE_URL = Path.cwd().joinpath("selenium-webdriver/mock_site/index.html").as_uri()

def fill_checkout_form(driver):
    """チェックアウトフォームを自動入力"""
    try:
        # お客様情報
        name_field = driver.find_element(By.ID, "name")
        if name_field.get_attribute("value") == "":
            name_field.send_keys("田中太郎")
            
        email_field = driver.find_element(By.ID, "email")
        if email_field.get_attribute("value") == "":
            email_field.send_keys("test@example.com")
            
        phone_field = driver.find_element(By.ID, "phone")
        if phone_field.get_attribute("value") == "":
            phone_field.send_keys("090-1234-5678")
            
        # 配送先住所
        postal_field = driver.find_element(By.ID, "postal")
        if postal_field.get_attribute("value") == "":
            postal_field.send_keys("123-4567")
            
        prefecture_field = driver.find_element(By.ID, "prefecture")
        if prefecture_field.get_attribute("value") == "":
            prefecture_field.send_keys("東京都")
            
        city_field = driver.find_element(By.ID, "city")
        if city_field.get_attribute("value") == "":
            city_field.send_keys("渋谷区")
            
        address_field = driver.find_element(By.ID, "address")
        if address_field.get_attribute("value") == "":
            address_field.send_keys("1-2-3 テストビル101")
            
        # クレジットカード情報
        card_number_field = driver.find_element(By.ID, "card-number")
        if card_number_field.get_attribute("value") == "":
            card_number_field.send_keys("1234 5678 9012 3456")
            
        expiry_field = driver.find_element(By.ID, "expiry")
        if expiry_field.get_attribute("value") == "":
            expiry_field.send_keys("12/25")
            
        cvv_field = driver.find_element(By.ID, "cvv")
        if cvv_field.get_attribute("value") == "":
            cvv_field.send_keys("123")
            
        print("✅ チェックアウトフォームを自動入力しました")
        
    except Exception as e:
        print(f"チェックアウトフォーム入力エラー: {e}")

def auto_fill_current_page(driver):
    """現在のページの種類を判定して適切な自動入力を実行"""
    current_url = driver.current_url
    
    if "checkout.html" in current_url:
        print("📝 チェックアウトページを検出 - フォームを自動入力します...")
        time.sleep(1)  # レンダリング待ち
        fill_checkout_form(driver)
    elif "index.html" in current_url:
        print("🏠 商品一覧ページです - 手動で商品をカートに追加してください")
    elif "cart.html" in current_url:
        print("🛒 カートページです - 手動でレジに進んでください")
    elif "complete.html" in current_url:
        print("✅ 注文完了ページです")
    else:
        print("❓ 不明なページです")

def main():
    print("🚀 手動テスト補助ツールを開始します...")
    print(f"📱 ブラウザを開いて {BASE_URL} にアクセスします")
    
    # ブラウザを起動
    driver = webdriver.Chrome()
    driver.get(BASE_URL)
    
    print("\n📋 使い方:")
    print("- 手動でページを遷移してください")
    print("- このツールが自動でフォームを埋めます")
    print("- 20分後に自動終了します")
    print("- 手動で終了する場合はCtrl+Cを押してください")
    
    try:
        # 1200秒間（20分）監視を続ける
        start_time = time.time()
        last_url = ""
        
        while time.time() - start_time < 1200:
            current_url = driver.current_url
            
            # URLが変わったら新しいページの処理を実行
            if current_url != last_url:
                print(f"\n🔄 ページ遷移を検出: {current_url}")
                auto_fill_current_page(driver)
                last_url = current_url
            
            time.sleep(2)  # 2秒間隔でチェック
            
    except KeyboardInterrupt:
        print("\n⏹️  ユーザーにより終了されました")
    except Exception as e:
        print(f"\n❌ エラーが発生しました: {e}")
    
    print("\n🏁 手動テスト補助ツールを終了します...")
    print("ブラウザは開いたままにします。手動で閉じてください。")

if __name__ == "__main__":
    main()