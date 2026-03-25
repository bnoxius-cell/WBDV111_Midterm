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
        if (link.getAttribute('href') === currentPath && !link.classList.contains('neo-btn')) {
            link.classList.add('active');
        }
    });
}

function updateAuthButton() {
    const authBtn = document.getElementById('auth-btn');
    if (!authBtn) return;

    const user = localStorage.getItem('nexus_user');
    if (user) {
        authBtn.innerText = "LOGOUT";
        authBtn.classList.replace('btn-black', 'btn-pink');
        authBtn.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('nexus_user');
            window.location.reload();
        };
    } else {
        authBtn.innerText = "LOGIN";
        authBtn.classList.replace('btn-pink', 'btn-black');
        authBtn.onclick = null;
    }
}

function handleLogin(event) {
    event.preventDefault();
    const input = document.getElementById('username').value;
    localStorage.setItem('nexus_user', input);
    window.location.href = 'index.html';
}

// Generate random mock QR data
function generatePass() {
    event.preventDefault();
    alert('Attendee info saved! Generating your pass...');
    window.location.href = 'ticket-pass.html';
}

document.addEventListener("DOMContentLoaded", loadNavbar);