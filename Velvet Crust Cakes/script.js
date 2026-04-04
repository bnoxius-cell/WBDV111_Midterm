// Function to load the navbar into the page
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

// Highlight the active link in the navbar
function highlightCurrentPage() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// Dummy Auth Logic
function updateAuthButton() {
    const authBtn = document.getElementById('auth-btn');
    if (!authBtn) return;

    const user = localStorage.getItem('vc_user');
    if (user) {
        authBtn.innerText = "Logout";
        authBtn.href = "#";
        authBtn.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('vc_user');
            localStorage.removeItem('vc_role');
            window.location.reload();
        };
    } else {
        authBtn.innerText = "Login";
        authBtn.href = "login.html";
        authBtn.onclick = null;
    }
}

function handleLogin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('username').value.trim().toLowerCase();
    const passwordInput = document.getElementById('password').value.trim();

    // Hardcoded Database of Users & Roles
    const mockDatabase = {
        'admin': { password: 'adminpassword', role: 'admin' },
        'staff': { password: 'staffpassword', role: 'staff' },
        'user': { password: 'userpassword', role: 'user' }
    };

    const userRecord = mockDatabase[usernameInput];

    // Check if user exists and password matches
    if (userRecord && userRecord.password === passwordInput) {
        localStorage.setItem('vc_user', usernameInput);
        localStorage.setItem('vc_role', userRecord.role);
        
        alert(`Welcome to Velvet Crust Cakes, ${usernameInput}! [Role: ${userRecord.role}]`);
        window.location.href = 'index.html';
    } else {
        alert("Invalid credentials! Please try admin/adminpassword, staff/staffpassword, or user/userpassword.");
    }
}

// Mix & Match Preview Logic
function updatePreview() {
    const base = document.getElementById('cake-base').value;
    const frost = document.getElementById('cake-frosting').value;
    const top = document.getElementById('cake-toppings').value;
    document.getElementById('preview-text').innerText = 
        `Custom Design: ${base} base, frosted with ${frost}, topped with ${top}.`;
}

// Run navbar loader when page loads
document.addEventListener("DOMContentLoaded", loadNavbar);