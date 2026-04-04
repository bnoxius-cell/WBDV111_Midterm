<<<<<<< HEAD
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
    const input = document.getElementById('username').value;
    localStorage.setItem('vc_user', input); // Accepts ANY string
    window.location.href = 'index.html'; // Redirect to home
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
=======
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
    const input = document.getElementById('username').value;
    localStorage.setItem('vc_user', input); // Accepts ANY string
    window.location.href = 'index.html'; // Redirect to home
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
>>>>>>> 6dafc3840ef30180a2823879307c35705586c295
document.addEventListener("DOMContentLoaded", loadNavbar);