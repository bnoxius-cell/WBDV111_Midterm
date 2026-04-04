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
        if (link.getAttribute('href') === currentPath && !link.classList.contains('lib-btn')) {
            link.classList.add('active');
        }
    });
}

function updateAuthButton() {
    const authBtn = document.getElementById('auth-btn');
    if (!authBtn) return;

    const user = localStorage.getItem('libry_user');
    if (user) {
        authBtn.innerText = "Log Out";
        authBtn.classList.replace('btn-primary', 'lib-btn');
        authBtn.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('libry_user');
            window.location.reload();
        };
    } else {
        authBtn.innerText = "Log In / Register";
        authBtn.classList.add('btn-primary');
        authBtn.onclick = null;
    }
}

function handleLogin(event) {
    event.preventDefault();
    const input = document.getElementById('patron-id').value;
    localStorage.setItem('libry_user', input);
    window.location.href = 'index.html';
}

function performSearch(event) {
    event.preventDefault();
    const query = document.getElementById('search-query').value;
    const resultsArea = document.getElementById('search-results');
    
    if(query.trim() !== "") {
        resultsArea.style.display = "block";
        document.getElementById('search-term-display').innerText = `Results for: "${query}"`;
    }
}

function placeHold(bookTitle) {
    const user = localStorage.getItem('libry_user');
    if(!user) {
        alert("Please log in to place a hold on items.");
        window.location.href = "login.html";
    } else {
        alert(`Hold placed successfully on: "${bookTitle}". We will notify you when it's ready.`);
    }
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
        if (link.getAttribute('href') === currentPath && !link.classList.contains('lib-btn')) {
            link.classList.add('active');
        }
    });
}

function updateAuthButton() {
    const authBtn = document.getElementById('auth-btn');
    if (!authBtn) return;

    const user = localStorage.getItem('libry_user');
    if (user) {
        authBtn.innerText = "Log Out";
        authBtn.classList.replace('btn-primary', 'lib-btn');
        authBtn.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('libry_user');
            window.location.reload();
        };
    } else {
        authBtn.innerText = "Log In / Register";
        authBtn.classList.add('btn-primary');
        authBtn.onclick = null;
    }
}

function handleLogin(event) {
    event.preventDefault();
    const input = document.getElementById('patron-id').value;
    localStorage.setItem('libry_user', input);
    window.location.href = 'index.html';
}

function performSearch(event) {
    event.preventDefault();
    const query = document.getElementById('search-query').value;
    const resultsArea = document.getElementById('search-results');
    
    if(query.trim() !== "") {
        resultsArea.style.display = "block";
        document.getElementById('search-term-display').innerText = `Results for: "${query}"`;
    }
}

function placeHold(bookTitle) {
    const user = localStorage.getItem('libry_user');
    if(!user) {
        alert("Please log in to place a hold on items.");
        window.location.href = "login.html";
    } else {
        alert(`Hold placed successfully on: "${bookTitle}". We will notify you when it's ready.`);
    }
}

>>>>>>> 6dafc3840ef30180a2823879307c35705586c295
document.addEventListener("DOMContentLoaded", loadNavbar);