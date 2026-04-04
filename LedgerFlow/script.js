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
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath && link.id !== 'auth-btn') {
            link.classList.add('active');
        }
    });
}

function updateAuthButton() {
    const authBtn = document.getElementById('auth-btn');
    if (!authBtn) return;

    const user = localStorage.getItem('ledger_user');
    if (user) {
        authBtn.innerText = "Logout";
        authBtn.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('ledger_user');
            localStorage.removeItem('ledger_role');
            window.location.reload();
        };
    }
}

function handleLogin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('username').value.trim().toLowerCase();
    const passwordInput = document.getElementById('password').value.trim();

    const mockDatabase = { 'admin': { password: 'adminpassword', role: 'admin' }, 'staff': { password: 'staffpassword', role: 'staff' }, 'user': { password: 'userpassword', role: 'user' } };
    const userRecord = mockDatabase[usernameInput];

    if (userRecord && userRecord.password === passwordInput) { localStorage.setItem('ledger_user', usernameInput); localStorage.setItem('ledger_role', userRecord.role); alert(`Authentication Successful. Welcome, ${usernameInput} [Role: ${userRecord.role.toUpperCase()}]`); window.location.href = 'dashboard.html';
    } else { alert("Authentication Failed: Invalid credentials.\nPlease use admin/adminpassword, staff/staffpassword, or user/userpassword."); }
}

function initData() {
    if (!localStorage.getItem('ledger_clients')) {
        localStorage.setItem('ledger_clients', JSON.stringify([
            { id: 1, name: 'John Smith', email: 'john@email.com', company: 'Acme Corp' },
            { id: 2, name: 'Maria Cruz', email: 'maria@email.com', company: 'Nova Ltd' }
        ]));
    }
    if (!localStorage.getItem('ledger_invoices')) {
        localStorage.setItem('ledger_invoices', JSON.stringify([
            { id: 'INV-101', client: 'Acme Corp', date: '2023-05-12', amount: 1500.00, status: 'Pending' },
            { id: 'INV-102', client: 'Nova Ltd', date: '2023-05-16', amount: 3200.50, status: 'Paid' }
        ]));
    }
}

function loadDashboard() {
    const invoices = JSON.parse(localStorage.getItem('ledger_invoices') || '[]');
    const clients = JSON.parse(localStorage.getItem('ledger_clients') || '[]');
    
    document.getElementById('dash-invoices').innerText = invoices.length;
    document.getElementById('dash-clients').innerText = clients.length;
    
    const pending = invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + parseFloat(i.amount), 0);
    document.getElementById('dash-pending').innerText = '$' + pending.toLocaleString(undefined, {minimumFractionDigits: 2});
    
    const tbody = document.getElementById('dash-recent-tbody');
    if(!tbody) return;
    tbody.innerHTML = '';
    invoices.slice(-5).reverse().forEach(inv => {
        tbody.innerHTML += `<tr>
            <td>${inv.id}</td>
            <td>${inv.client}</td>
            <td><b>${inv.status}</b></td>
            <td><button class="btn btn-outline btn-sm" onclick="window.location.href='invoices.html'">View</button></td>
        </tr>`;
    });
}

function loadClients() {
    const clients = JSON.parse(localStorage.getItem('ledger_clients') || '[]');
    const tbody = document.getElementById('clients-tbody');
    if(!tbody) return;
    tbody.innerHTML = '';
    clients.forEach(c => {
        tbody.innerHTML += `<tr>
            <td>${c.name}</td>
            <td>${c.email}</td>
            <td>${c.company}</td>
            <td><button class="btn btn-outline btn-sm">Edit</button></td>
        </tr>`;
    });
}

function openAddClientModal() {
    const modal = document.getElementById('add-client-modal');
    if(modal) modal.style.display = 'flex';
}

function closeAddClientModal() {
    const modal = document.getElementById('add-client-modal');
    if(modal) modal.style.display = 'none';
}

function submitAddClient(event) {
    event.preventDefault();
    const name = document.getElementById('new-client-name').value.trim();
    const email = document.getElementById('new-client-email').value.trim();
    const company = document.getElementById('new-client-company').value.trim();
    
    const clients = JSON.parse(localStorage.getItem('ledger_clients') || '[]');
    clients.push({ id: Date.now(), name, email, company });
    localStorage.setItem('ledger_clients', JSON.stringify(clients));
    
    closeAddClientModal();
    loadClients();
    event.target.reset();
}

function loadInvoices() {
    const invoices = JSON.parse(localStorage.getItem('ledger_invoices') || '[]');
    const tbody = document.getElementById('invoices-tbody');
    if(!tbody) return;
    tbody.innerHTML = '';
    invoices.reverse().forEach(inv => {
        tbody.innerHTML += `<tr>
            <td>${inv.id}</td>
            <td>${inv.client}</td>
            <td>${inv.date}</td>
            <td><b>${inv.status}</b></td>
            <td><button class="btn btn-outline btn-sm" onclick="generatePDF('${inv.id}', this)">Generate PDF</button></td>
        </tr>`;
    });
}

function generatePDF(invId, btnElement) {
    const invoices = JSON.parse(localStorage.getItem('ledger_invoices') || '[]');
    const invoice = invoices.find(i => i.id === invId);
    if (!invoice) return alert('Invoice not found');

    const originalText = btnElement.innerText;
    btnElement.innerText = "Generating...";
    btnElement.disabled = true;

    const element = document.createElement('div');
    element.innerHTML = `
        <div style="padding: 40px; font-family: sans-serif; color: #111827;">
            <h1 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">LedgerFlow Invoice</h1>
            <h2>Invoice ID: ${invoice.id}</h2>
            <p><strong>Date:</strong> ${invoice.date}</p>
            <p><strong>Billed To:</strong> ${invoice.client}</p>
            <hr style="border: 1px solid #e5e7eb; margin: 30px 0;">
            <h2>Total Due: $${parseFloat(invoice.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
            <p><strong>Status:</strong> ${invoice.status.toUpperCase()}</p>
            <br><br><br>
            <p style="color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 10px;">Generated securely via LedgerFlow Financial Systems.</p>
        </div>
    `;
    
    // Dynamically inject html2pdf.js to generate a real PDF download
    if (typeof html2pdf === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = () => { 
            html2pdf().from(element).save(`${invoice.id}.pdf`).then(() => {
                btnElement.innerText = originalText;
                btnElement.disabled = false;
            });
        };
        document.head.appendChild(script);
    } else {
        html2pdf().from(element).save(`${invoice.id}.pdf`).then(() => {
            btnElement.innerText = originalText;
            btnElement.disabled = false;
        });
    }
}

function handleCreateInvoice(event) {
    event.preventDefault();
    const id = document.getElementById('inv-id').value;
    const client = document.getElementById('inv-client').value;
    const date = document.getElementById('inv-date').value;
    const amount = document.getElementById('inv-amount').value;

    const invoices = JSON.parse(localStorage.getItem('ledger_invoices') || '[]');
    invoices.push({ id, client, date, amount: parseFloat(amount), status: 'Pending' });
    localStorage.setItem('ledger_invoices', JSON.stringify(invoices));

    alert(`Invoice ${id} securely generated and logged to the ledger.`);
    window.location.href = 'invoices.html';
}

function populateClientDropdown() {
    const select = document.getElementById('inv-client');
    if (!select) return;
    const clients = JSON.parse(localStorage.getItem('ledger_clients') || '[]');
    select.innerHTML = '<option value="">Select Client</option>';
    clients.forEach(c => {
        select.innerHTML += `<option value="${c.company}">${c.company} (${c.name})</option>`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadNavbar();
    initData();
    
    const path = window.location.pathname;
    if (path.includes('dashboard.html')) loadDashboard();
    if (path.includes('clients.html')) loadClients();
    if (path.includes('invoices.html')) loadInvoices();
    if (path.includes('pay.html')) populateClientDropdown();
});