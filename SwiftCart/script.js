function loadNavbar() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            updateAuthButton();
            highlightCurrentPage();
        })
        .catch(error => console.error('Error loading navbar:', error));
}

function highlightCurrentPage() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

function updateAuthButton() {
    const authBtn = document.getElementById('auth-btn');
    if (!authBtn) return;

    const user = localStorage.getItem('swiftcart_user');
    if (user) {
        authBtn.innerText = "Logout";
        authBtn.href = "#";
        authBtn.classList.remove('btn-primary');
        authBtn.classList.add('btn-outline');
        authBtn.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('swiftcart_user');
            localStorage.removeItem('swiftcart_role');
            window.location.reload();
        };
    } else {
        authBtn.innerText = "Login";
        authBtn.href = "login.html";
        authBtn.classList.add('btn-primary');
        authBtn.onclick = null;
    }
}

function handleLogin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('username').value.trim().toLowerCase();
    const passwordInput = document.getElementById('password').value.trim();

    const mockDatabase = {
        'admin': { password: 'adminpassword', role: 'admin' },
        'staff': { password: 'staffpassword', role: 'staff' },
        'user': { password: 'userpassword', role: 'user' }
    };

    const userRecord = mockDatabase[usernameInput];

    if (userRecord && userRecord.password === passwordInput) {
        localStorage.setItem('swiftcart_user', usernameInput);
        localStorage.setItem('swiftcart_role', userRecord.role);
        alert(`Welcome back to SwiftCart, ${usernameInput}! [Role: ${userRecord.role.toUpperCase()}]`);
        window.location.href = 'index.html';
    } else {
        alert("Invalid credentials! Please try admin/adminpassword, staff/staffpassword, or user/userpassword.");
    }
}

// --- TOAST NOTIFICATIONS ---
function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// --- CART LOGIC ---
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem('swiftcart_cart') || '[]');
    let item = cart.find(i => i.name === name);
    if (item) {
        item.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    localStorage.setItem('swiftcart_cart', JSON.stringify(cart));
    showToast(`Added ${name} to cart!`);
    if (document.getElementById('quick-cart-items')) renderQuickCart();
}

function updateQty(name, delta) {
    let cart = JSON.parse(localStorage.getItem('swiftcart_cart') || '[]');
    let item = cart.find(i => i.name === name);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) cart = cart.filter(i => i.name !== name);
        localStorage.setItem('swiftcart_cart', JSON.stringify(cart));
        renderCartPage();
        if (document.getElementById('quick-cart-items')) renderQuickCart();
    }
}

function removeFromCart(name) {
    let cart = JSON.parse(localStorage.getItem('swiftcart_cart') || '[]');
    cart = cart.filter(i => i.name !== name);
    localStorage.setItem('swiftcart_cart', JSON.stringify(cart));
    renderCartPage();
    if (document.getElementById('quick-cart-items')) renderQuickCart();
}

// --- RENDERERS ---
function renderQuickCart() {
    const container = document.getElementById('quick-cart-items');
    if (!container) return;
    const cart = JSON.parse(localStorage.getItem('swiftcart_cart') || '[]');
    
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    document.getElementById('quick-cart-count').innerText = totalItems;
    document.getElementById('quick-cart-total').innerText = `$${subtotal.toFixed(2)}`;
}

function renderCartPage() {
    const itemsContainer = document.getElementById('cart-items-container');
    const summaryContainer = document.getElementById('cart-summary-container');
    if (!itemsContainer || !summaryContainer) return;

    const cart = JSON.parse(localStorage.getItem('swiftcart_cart') || '[]');

    if (cart.length === 0) {
        itemsContainer.innerHTML = `<div class="empty-cart"><h3>Your cart is currently empty</h3><p>Looks like you haven't added anything yet.</p><a href="index.html" class="btn-primary">Browse Catalog</a></div>`;
        summaryContainer.innerHTML = '';
        return;
    }

    let itemsHTML = '<div style="border: 1px solid var(--border); border-radius: 8px; margin-bottom: 2rem;">';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        const borderBottom = index < cart.length - 1 ? 'border-bottom: 1px solid var(--border);' : '';
        
        itemsHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; ${borderBottom}">
                <div style="flex: 1;">
                    <h3 style="margin-bottom: 0.2rem; font-size: 1.1rem;">${item.name}</h3>
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
                        <button class="qty-btn" onclick="updateQty('${item.name}', -1)">-</button>
                        <span style="font-weight: 600; width: 20px; text-align: center;">${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty('${item.name}', 1)">+</button>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: 10px;">$${itemTotal.toFixed(2)}</div>
                    <button class="remove-btn" onclick="removeFromCart('${item.name}')">×</button>
                </div>
            </div>
        `;
    });
    itemsHTML += '</div>';
    itemsContainer.innerHTML = itemsHTML;

    const shipping = 10.00;
    const tax = subtotal * 0.08;
    const grandTotal = subtotal + shipping + tax;

    summaryContainer.innerHTML = `
        <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border); margin-bottom: 2rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: var(--text-muted);"><span>Subtotal:</span> <span>$${subtotal.toFixed(2)}</span></div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: var(--text-muted);"><span>Shipping:</span> <span>$${shipping.toFixed(2)}</span></div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; color: var(--text-muted); border-bottom: 1px solid var(--border); padding-bottom: 15px;"><span>Tax (8%):</span> <span>$${tax.toFixed(2)}</span></div>
            <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: 700;"><span>Grand Total:</span> <span>$${grandTotal.toFixed(2)}</span></div>
        </div>
        <button class="btn-primary" style="width: 100%; font-size: 1.1rem; padding: 15px;" onclick="goToCheckout()">Proceed to Checkout</button>
    `;
}

// --- CHECKOUT GATEKEEPER ---
function goToCheckout() {
    const user = localStorage.getItem('swiftcart_user');
    if (!user) {
        sessionStorage.setItem('login_message', 'Please log in or register to complete your purchase.');
        window.location.href = 'login.html';
    } else {
        window.location.href = 'checkout.html';
    }
}

function processCheckout(event) {
    event.preventDefault();
    document.getElementById('checkout-modal').style.display = 'flex';
    localStorage.removeItem('swiftcart_cart');
}

// --- F-PATTERN FILTERING ---
function filterCategory(event, category, element) {
    event.preventDefault();
    document.querySelectorAll('.sidebar-nav a').forEach(el => el.classList.remove('active'));
    if(element) element.classList.add('active');

    document.querySelectorAll('.product-card').forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// --- INIT ---
document.addEventListener("DOMContentLoaded", () => {
    loadNavbar();
    const path = window.location.pathname;
    if (path.includes('cart.html')) renderCartPage();
    if (path.includes('index.html') || path === '/' || path === '') renderQuickCart();

    const msg = sessionStorage.getItem('login_message');
    const msgEl = document.getElementById('login-message');
    if (msg && msgEl) {
        msgEl.innerText = msg;
        msgEl.style.display = 'block';
        sessionStorage.removeItem('login_message');
    }
});