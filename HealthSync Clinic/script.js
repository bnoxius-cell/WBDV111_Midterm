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
        if (link.getAttribute('href') === currentPath && !link.classList.contains('btn')) {
            link.classList.add('active');
        }
    });
}

function updateAuthButton() {
    const authBtn = document.getElementById('auth-btn');
    if (!authBtn) return;

    const user = localStorage.getItem('health_user');
    if (user) {
        authBtn.innerHTML = `Sign Out <span class="verified-badge">✓ Verified Patient</span>`;
        authBtn.classList.replace('btn-primary', 'btn-outline');
        authBtn.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('health_user');
            localStorage.removeItem('health_role');
            window.location.reload();
        };
    } else {
        authBtn.innerHTML = `Log In`;
        authBtn.classList.add('btn-primary');
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

    if (userRecord && userRecord.password === passwordInput) {
        localStorage.setItem('health_user', usernameInput);
        localStorage.setItem('health_role', userRecord.role);
        
        alert(`Welcome to HealthSync, ${usernameInput}! [Role: ${userRecord.role}]`);
        window.location.href = 'index.html';
    } else {
        alert("Invalid credentials! Please try admin/adminpassword, staff/staffpassword, or user/userpassword.");
    }
}

let currentStep = 1;
const totalSteps = 4;

function nextStep(step, selectionContext = null) {
    document.querySelectorAll('.wizard-step').forEach(el => el.classList.remove('active'));
    
    currentStep = step;
    document.getElementById(`step-${currentStep}`).classList.add('active');
    
    document.querySelectorAll('.progress-dot').forEach((dot, index) => {
        if(index < currentStep) dot.classList.add('active');
        else dot.classList.remove('active');
    });

    if(selectionContext) {
        console.log("Selected:", selectionContext);
    }
}

function confirmAppointment() {
    const user = localStorage.getItem('health_user');
    if(!user) {
        alert("Please Log In or Register to confirm this appointment.");
        window.location.href = "login.html";
        return;
    }
    
    alert("Appointment Confirmed! A calendar invite has been sent to your secure email.");
    window.location.href = "index.html"; // Redirect to medical history
}

document.addEventListener("DOMContentLoaded", loadNavbar);