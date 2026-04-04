/* --- TOAST NOTIFICATIONS --- */
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

/* --- AUTHENTICATION & ROLES --- */
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
        localStorage.setItem('freshbite_user', usernameInput);
        localStorage.setItem('freshbite_role', userRecord.role);
        document.getElementById('loginToggle').checked = false;
        showToast(`Welcome back, ${usernameInput}! [Role: ${userRecord.role.toUpperCase()}]`, 'success');
        setTimeout(() => window.location.reload(), 1000);
    } else {
        showToast("Invalid credentials! Try admin/adminpassword.", "error");
    }
}

function handleLogout() {
    localStorage.removeItem('freshbite_user');
    localStorage.removeItem('freshbite_role');
    showToast("Logged out successfully", "info");
    setTimeout(() => window.location.reload(), 1000);
}

function applyRoleRestrictions() {
    const user = localStorage.getItem('freshbite_user');
    const role = localStorage.getItem('freshbite_role') || 'guest';

    if (user) {
        document.getElementById('auth-btn-label').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'block';
    }

    if (role === 'admin' || role === 'staff') {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
    }
}

/* --- DELIVERY GATEKEEPER --- */
function checkDeliveryAccess(event) {
    event.preventDefault();
    const user = localStorage.getItem('freshbite_user');
    if (!user) {
        document.getElementById('loginToggle').checked = true;
        showToast('Please log in to finalize your meal plan.', 'error');
    } else {
        window.location.href = 'delivery.html';
    }
}

function submitDelivery(event) {
    event.preventDefault();
    showToast("Meal Plan Confirmed! Your order is being processed.", "success");
    localStorage.removeItem('freshbite_cart');
    setTimeout(() => window.location.href = "index.html", 3000);
}

/* --- MEAL FLOW & MACROS --- */
function selectDiet(event, diet) {
    event.preventDefault();
    localStorage.setItem("selectedDiet", diet);
    showToast(`Diet Preference updated to: ${diet.toUpperCase()}`, 'info');
    
    setTimeout(() => window.location.href = 'meals.html', 1000);
}

function addToPlan(name, calories, protein, carbs, fats) {
    let cart = JSON.parse(localStorage.getItem('freshbite_cart') || '[]');
    cart.push({ name, calories, protein, carbs, fats });
    localStorage.setItem('freshbite_cart', JSON.stringify(cart));
    showToast(`Added ${name} to Plan`, 'success');
}

function loadMacros() {
    const cart = JSON.parse(localStorage.getItem('freshbite_cart') || '[]');
    let cals = 0, pro = 0, carb = 0, fat = 0;
    
    cart.forEach(m => {
        cals += m.calories; pro += m.protein; carb += m.carbs; fat += m.fats;
    });

    const elCals = document.getElementById('total-cals');
    if (elCals) {
        elCals.innerText = `${cals} kcal`;
        document.getElementById('total-pro').innerText = `${pro} g`;
        document.getElementById('total-carbs').innerText = `${carb} g`;
        document.getElementById('total-fats').innerText = `${fat} g`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    applyRoleRestrictions();
    loadMacros();
});