<<<<<<< HEAD
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
    const input = document.getElementById('email').value;
    localStorage.setItem('health_user', input);
    window.location.href = 'index.html';
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

=======
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
    const input = document.getElementById('email').value;
    localStorage.setItem('health_user', input);
    window.location.href = 'index.html';
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

>>>>>>> 6dafc3840ef30180a2823879307c35705586c295
document.addEventListener("DOMContentLoaded", loadNavbar);