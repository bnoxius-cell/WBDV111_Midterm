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
    const input = document.getElementById('username').value;
    localStorage.setItem('swiftcart_user', input);
    window.location.href = 'index.html';
}

function addToCart(itemName) {
    alert(`"${itemName}" has been added to your cart!`);
}

document.addEventListener("DOMContentLoaded", loadNavbar);