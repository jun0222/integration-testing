// グローバル変数
let cart = [];

// ローカルストレージからカートデータを読み込み
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartCount();
}

// ローカルストレージにカートデータを保存
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// カートのアイテム数を更新
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// 商品をカートに追加
function addToCart(productId, name, price, image) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showAlert('商品がカートに追加されました', 'success');
}

// カートから商品を削除
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
}

// 商品の数量を更新
function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartCount();
        if (window.location.pathname.includes('cart.html')) {
            displayCartItems();
        }
    }
}

// アラート表示
function showAlert(message, type = 'success') {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    const main = document.querySelector('main');
    main.insertBefore(alert, main.firstChild);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// カートページ用：カートアイテムを表示
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>カートは空です</p>';
        updateOrderSummary();
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
            <div class="cart-item-image" style="background-image: url('${item.image}'); width: 80px; height: 80px; background-size: cover; background-position: center; border-radius: 4px;"></div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">¥${item.price.toLocaleString()}</div>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="btn btn-danger" onclick="removeFromCart('${item.id}')">削除</button>
        </div>
    `).join('');
    
    updateOrderSummary();
}

// 注文サマリーを更新
function updateOrderSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 5000 ? 0 : 500;
    const tax = Math.floor((subtotal + shipping) * 0.1);
    const total = subtotal + shipping + tax;
    
    const summaryContainer = document.querySelector('.order-summary');
    if (summaryContainer) {
        summaryContainer.innerHTML = `
            <h3 class="summary-title">注文内容</h3>
            <div class="summary-row">
                <span>小計</span>
                <span>¥${subtotal.toLocaleString()}</span>
            </div>
            <div class="summary-row">
                <span>送料</span>
                <span>¥${shipping.toLocaleString()}</span>
            </div>
            <div class="summary-row">
                <span>税金</span>
                <span>¥${tax.toLocaleString()}</span>
            </div>
            <div class="summary-row summary-total">
                <span>合計</span>
                <span>¥${total.toLocaleString()}</span>
            </div>
        `;
    }
    
    // チェックアウトページ用の更新
    const checkoutSummary = document.getElementById('checkout-summary');
    if (checkoutSummary) {
        checkoutSummary.innerHTML = `
            <h3>注文内容</h3>
            ${cart.map(item => `
                <div class="summary-row">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>¥${(item.price * item.quantity).toLocaleString()}</span>
                </div>
            `).join('')}
            <hr>
            <div class="summary-row">
                <span>小計</span>
                <span>¥${subtotal.toLocaleString()}</span>
            </div>
            <div class="summary-row">
                <span>送料</span>
                <span>¥${shipping.toLocaleString()}</span>
            </div>
            <div class="summary-row">
                <span>税金</span>
                <span>¥${tax.toLocaleString()}</span>
            </div>
            <div class="summary-row summary-total">
                <strong>合計: ¥${total.toLocaleString()}</strong>
            </div>
        `;
    }
}

// フォーム送信処理
function submitOrder(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // 簡単なバリデーション
    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'postal'];
    const missingFields = requiredFields.filter(field => !formData.get(field));
    
    if (missingFields.length > 0) {
        showAlert('必須項目をすべて入力してください', 'error');
        return;
    }
    
    // ローディング表示
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> 処理中...';
    submitBtn.disabled = true;
    
    // 模擬的な処理時間
    setTimeout(() => {
        // 注文データを保存
        const orderData = {
            id: Date.now().toString(),
            items: [...cart],
            customer: Object.fromEntries(formData),
            total: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
            date: new Date().toISOString()
        };
        
        localStorage.setItem('lastOrder', JSON.stringify(orderData));
        
        // カートをクリア
        cart = [];
        saveCart();
        
        // 完了ページにリダイレクト
        window.location.href = 'complete.html';
    }, 2000);
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    
    // カートページの場合
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
    
    // チェックアウトページの場合
    if (window.location.pathname.includes('checkout.html')) {
        updateOrderSummary();
        
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', submitOrder);
        }
    }
    
    // 完了ページの場合
    if (window.location.pathname.includes('complete.html')) {
        const lastOrder = localStorage.getItem('lastOrder');
        if (lastOrder) {
            const orderData = JSON.parse(lastOrder);
            const orderSummary = document.getElementById('order-summary');
            if (orderSummary) {
                orderSummary.innerHTML = `
                    <h3>注文番号: ${orderData.id}</h3>
                    <p>注文日時: ${new Date(orderData.date).toLocaleString()}</p>
                    <div class="order-items">
                        ${orderData.items.map(item => `
                            <div class="summary-row">
                                <span>${item.name} x ${item.quantity}</span>
                                <span>¥${(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="summary-total">
                        <strong>合計: ¥${orderData.total.toLocaleString()}</strong>
                    </div>
                `;
            }
        }
    }
});

// カートアイコンクリック時の処理
function goToCart() {
    window.location.href = 'cart.html';
}