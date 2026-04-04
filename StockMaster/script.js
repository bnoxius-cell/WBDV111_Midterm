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
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

function updateAuthButton() {
    const authBtn = document.getElementById('auth-btn');
    if (!authBtn) return;

    const user = localStorage.getItem('stock_user');
    if (user) {
        authBtn.innerText = "SYS LOGOUT";
        authBtn.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('stock_user');
            window.location.reload();
        };
    } else {
        authBtn.innerText = "SYS LOGIN";
        authBtn.onclick = null;
    }
}

function handleLogin(event) {
    event.preventDefault();
    const input = document.getElementById('emp-id').value;
    localStorage.setItem('stock_user', input);
    window.location.href = 'index.html';
}

function scanItem() {
    const input = document.getElementById('scan-input').value;
    if(input) {
        alert(`ITEM SCANNED: ${input}\nAdded to inventory tracking.`);
        document.getElementById('scan-input').value = "";
    } else {
        alert("Awaiting scanner input. Please focus on the text field and scan barcode.");
    }
}

function setLimit(item) {
    let limit = prompt(`Set minimum stock alert limit for ${item}:`, "50");
    if (limit != null) {
        alert(`Stock limit for ${item} successfully updated to ${limit} units.`);
    }
}

function alertSupplier(supplier) {
    alert(`DISPATCH SENT:\nAutomated restock alert has been sent to ${supplier}.`);
}

function generateReport() {
    alert("GENERATING REPORT...\nCompiling Manila Region Q3 Inventory Data.\nReport will download as PDF shortly.");
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
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

function updateAuthButton() {
    const authBtn = document.getElementById('auth-btn');
    if (!authBtn) return;

    const user = localStorage.getItem('stock_user');
    if (user) {
        authBtn.innerText = "SYS LOGOUT";
        authBtn.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('stock_user');
            window.location.reload();
        };
    } else {
        authBtn.innerText = "SYS LOGIN";
        authBtn.onclick = null;
    }
}

function handleLogin(event) {
    event.preventDefault();
    const input = document.getElementById('emp-id').value;
    localStorage.setItem('stock_user', input);
    window.location.href = 'index.html';
}

function scanItem() {
    const input = document.getElementById('scan-input').value;
    if(input) {
        alert(`ITEM SCANNED: ${input}\nAdded to inventory tracking.`);
        document.getElementById('scan-input').value = "";
    } else {
        alert("Awaiting scanner input. Please focus on the text field and scan barcode.");
    }
}

function setLimit(item) {
    let limit = prompt(`Set minimum stock alert limit for ${item}:`, "50");
    if (limit != null) {
        alert(`Stock limit for ${item} successfully updated to ${limit} units.`);
    }
}

function alertSupplier(supplier) {
    alert(`DISPATCH SENT:\nAutomated restock alert has been sent to ${supplier}.`);
}

function generateReport() {
    alert("GENERATING REPORT...\nCompiling Manila Region Q3 Inventory Data.\nReport will download as PDF shortly.");
}

>>>>>>> 6dafc3840ef30180a2823879307c35705586c295
document.addEventListener("DOMContentLoaded", loadNavbar);