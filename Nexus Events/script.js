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
            localStorage.removeItem('nexus_role');
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
    const usernameInput = document.getElementById('username').value.trim().toLowerCase();
    const passwordInput = document.getElementById('password').value.trim();

    // Hardcoded Database of Users & Roles
    const mockDatabase = {
        'admin': { password: 'adminpassword', role: 'admin' },
        'staff': { password: 'staffpassword', role: 'staff' },
        'guest': { password: 'guestpassword', role: 'guest' }
    };

    const userRecord = mockDatabase[usernameInput];

    // Check if user exists and password matches
    if (userRecord && userRecord.password === passwordInput) {
        localStorage.setItem('nexus_user', usernameInput);
        localStorage.setItem('nexus_role', userRecord.role);
        
        alert(`ACCESS GRANTED: WELCOME ${usernameInput.toUpperCase()} [ROLE: ${userRecord.role.toUpperCase()}]`);
        window.location.href = 'index.html';
    } else {
        alert("ACCESS DENIED: INVALID USERNAME OR PASSWORD.\n\nTry: admin/adminpassword or guest/guestpassword");
    }
}

// Generate random mock QR data
function generatePass() {
    event.preventDefault();
    alert('Attendee info saved! Generating your pass...');
    window.location.href = 'ticket-pass.html';
}

document.addEventListener("DOMContentLoaded", loadNavbar);