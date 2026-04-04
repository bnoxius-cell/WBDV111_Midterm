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
        if (link.getAttribute('href') === currentPath && !link.classList.contains('btn-vintage')) {
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
        authBtn.classList.add('btn-outline');
        authBtn.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('libry_user');
            localStorage.removeItem('libry_role');
            window.location.reload();
        };
    } else {
        authBtn.innerText = "Log In";
        authBtn.classList.remove('btn-outline');
    }
    
    applyRoleBasedView();
}

function applyRoleBasedView() {
    const role = localStorage.getItem('libry_role') || 'guest';
    
    // Toggle Navbar links
    document.querySelectorAll('.role-restricted').forEach(el => {
        const allowedRoles = el.getAttribute('data-allowed').split(',');
        if (allowedRoles.includes(role)) {
            el.style.display = 'inline-block';
        } else {
            el.style.display = 'none';
        }
    });

}

function handleLogin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('username').value.trim().toLowerCase();
    const passwordInput = document.getElementById('password').value.trim();

    const mockDatabase = { 'admin': { password: 'adminpassword', role: 'admin' }, 'staff': { password: 'staffpassword', role: 'staff' }, 'user': { password: 'userpassword', role: 'user' } };
    const userRecord = mockDatabase[usernameInput];

    if (userRecord && userRecord.password === passwordInput) {
        localStorage.setItem('libry_user', usernameInput);
        localStorage.setItem('libry_role', userRecord.role);
        showToast(`Access Granted. Welcome Patron: ${usernameInput.toUpperCase()}`, 'success');
        setTimeout(() => window.location.href = 'index.html', 1000);
    } else { showToast("Invalid Patron ID or PIN.", "error"); }
}

/* --- CUSTOM UI NOTIFICATIONS --- */
function showToast(message, type = 'info') {
    let container = document.getElementById('libry-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'libry-toast-container';
        container.className = 'libry-toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `libry-toast ${type}`;
    toast.innerHTML = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

/* --- DATA LAYER INITIALIZATION --- */
function initLibryData() {
    if (!localStorage.getItem('libry_books')) {
        localStorage.setItem('libry_books', JSON.stringify([
            { id: 'B001', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', status: 'AVAILABLE', shelf: 'A-4' },
            { id: 'B002', title: 'El Filibusterismo', author: 'Jose Rizal', isbn: '9789710843573', status: 'ON LOAN', shelf: 'PH-1' },
            { id: 'B003', title: 'Dune', author: 'Frank Herbert', isbn: '9780441172719', status: 'AVAILABLE', shelf: 'SF-9' }
        ]));
    }
    if (!localStorage.getItem('libry_loans')) {
        localStorage.setItem('libry_loans', JSON.stringify([
            { id: 'L100', bookId: 'B002', title: 'El Filibusterismo', patron: 'user', dueDate: new Date(Date.now() + 864000000).toISOString(), status: 'ACTIVE', fines: 0 },
            { id: 'L099', bookId: 'B005', title: 'Florante at Laura', patron: 'user', dueDate: '2024-09-28T00:00:00Z', status: 'OVERDUE', fines: 250 }
        ]));
    }
    if (!localStorage.getItem('libry_members')) {
        localStorage.setItem('libry_members', JSON.stringify([
            { id: '100-4829', name: 'Juan Dela Cruz', status: 'Good Standing' },
            { id: '100-5931', name: 'Maria Clara', status: 'Fines Pending' }
        ]));
    }
}

/* --- DYNAMIC RENDERERS --- */
function performSearch(event) {
    event.preventDefault();
    const query = document.getElementById('search-query').value.trim().toLowerCase();
    const resultsArea = document.getElementById('search-results');
    
    if(query !== "") {
        resultsArea.style.display = "block";
        document.getElementById('search-term-display').innerText = `CATALOG QUERY: "${query.toUpperCase()}"`;
        renderCatalog(query);
    }
}

function renderCatalog(query) {
    const books = JSON.parse(localStorage.getItem('libry_books') || '[]');
    const role = localStorage.getItem('libry_role') || 'guest';
    const container = document.getElementById('catalog-container');
    if(!container) return;

    const filtered = books.filter(b => b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query));
    
    container.innerHTML = filtered.length ? '' : '<p style="margin-top: 1rem;">No records found matching query.</p>';
    
    filtered.forEach(book => {
        let actions = '';
        if (book.status === 'AVAILABLE') {
            if (role === 'admin' || role === 'staff') actions = `<button class="btn-vintage" onclick="openLoanModal('${book.id}', '${book.title}')">Process Loan</button>`;
            else if (role === 'user') actions = `<button class="btn-vintage btn-outline" onclick="placeHold('${book.title}')">Place Hold</button>`;
            else actions = `<span style="font-family: var(--vintage-mono); font-weight: bold;">Log in to borrow</span>`;
        } else {
            actions = `<span class="stamp-red" style="font-family: var(--vintage-mono); font-weight: bold;">CURRENTLY UNAVAILABLE</span>`;
        }

        container.innerHTML += `
            <div class="result-card">
                <div>
                    <h2 class="book-title">${book.title}</h2>
                    <p class="book-meta">AUTHOR: ${book.author} • ISBN: ${book.isbn}</p>
                    <span class="status-badge">${book.status} (SHELF ${book.shelf})</span>
                </div>
                <div>${actions}</div>
            </div>`;
    });
}

function renderLoans() {
    const container = document.getElementById('loans-container');
    if (!container) return;
    
    const loans = JSON.parse(localStorage.getItem('libry_loans') || '[]');
    const role = localStorage.getItem('libry_role');
    const user = localStorage.getItem('libry_user');
    
    let filtered = loans;
    if (role === 'user') filtered = loans.filter(l => l.patron === user);

    container.innerHTML = '';
    filtered.forEach(loan => {
        const isOverdue = loan.status === 'OVERDUE';
        const colorClass = isOverdue ? 'stamp-red' : 'faded-blue';
        const dateStr = new Date(loan.dueDate).toLocaleDateString();
        
        let actions = role === 'admin' || role === 'staff' 
            ? `<button class="btn-vintage btn-outline" style="padding: 4px 8px; font-size: 0.7rem;" onclick="returnBook('${loan.id}')">Return</button>`
            : '';

        container.innerHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding-right: 10px; margin-bottom: 8px;">
                <div>
                    <span style="font-weight: 600; display: block; line-height: 1.2;">${loan.title} ${isOverdue ? '(!)' : ''}</span>
                    ${role !== 'user' ? `<span style="font-size: 0.8rem; color: var(--ink);">Patron: ${loan.patron}</span>` : ''}
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span style="font-family: var(--vintage-mono); font-weight: bold;" class="${colorClass}">${dateStr}</span>
                    ${actions}
                </div>
            </div>
        `;
    });
}

function renderMembers() {
    const container = document.getElementById('members-container');
    if (!container) return;
    const members = JSON.parse(localStorage.getItem('libry_members') || '[]');
    
    container.innerHTML = '';
    members.forEach(m => {
        const isGood = m.status === 'Good Standing';
        container.innerHTML += `
            <div class="lib-card" style="padding: 2rem;">
                <h3 style="margin-bottom: 0.5rem; font-family: var(--vintage-serif);">${m.name}</h3>
                <p>Card #: <strong style="font-family: var(--vintage-mono);">${m.id}</strong></p>
                <p>Status: <span style="font-weight: bold; color: ${isGood ? '#27ae60' : 'var(--accent-red)'};">${m.status}</span></p>
                ${!isGood ? `<button class="btn-vintage btn-outline" style="margin-top: 1rem; width: 100%;" onclick="clearFines('${m.id}')">Clear Fines</button>` : ''}
            </div>`;
    });
}

function renderOverdue() {
    const container = document.getElementById('overdue-container');
    if (!container) return;
    const loans = JSON.parse(localStorage.getItem('libry_loans') || '[]').filter(l => l.status === 'OVERDUE');
    
    container.innerHTML = '';
    loans.forEach(l => {
        container.innerHTML += `
            <div class="lib-card" style="margin-top: 2rem; border-color: var(--accent-red); border-width: 3px;">
                <div style="position: absolute; top: 20px; right: 20px; border: 4px solid var(--accent-red); color: var(--accent-red); font-family: var(--vintage-mono); font-size: 1.5rem; font-weight: bold; padding: 5px 10px; transform: rotate(-15deg); opacity: 0.8;">PAST DUE</div>
                <h3 style="margin-bottom: 1rem; padding-right: 120px;">${l.title}</h3>
                <p><strong>Patron ID:</strong> ${l.patron}</p>
                <p><strong>Due Date:</strong> <span class="stamp-red" style="font-weight: bold;">${new Date(l.dueDate).toLocaleDateString()}</span></p>
                <p><strong>Accrued Fines:</strong> <span style="font-family: var(--vintage-mono); font-weight: bold; font-size: 1.1rem;">PHP ${l.fines}.00</span></p>
                <button class="btn-vintage" style="margin-top: 1.5rem; background: var(--accent-red); border-color: var(--accent-red);" onclick="showToast('Official Notice dispatched via Courier & Email.', 'success')">Send Notice</button>
            </div>`;
    });
}

/* --- SYSTEM ACTIONS --- */
function placeHold(bookTitle) { showToast(`Hold placed on: "${bookTitle}". Status: Pending.`, 'success'); }

let tempLoanBookId = '';
let tempLoanBookTitle = '';
function openLoanModal(id, title) {
    tempLoanBookId = id; tempLoanBookTitle = title;
    document.getElementById('loan-book-title').innerText = title;
    document.getElementById('loan-modal').style.display = 'flex';
}
function closeLoanModal() { document.getElementById('loan-modal').style.display = 'none'; }
function submitLoan(event) {
    event.preventDefault();
    const patronId = document.getElementById('loan-patron-id').value.trim();
    
    let books = JSON.parse(localStorage.getItem('libry_books') || '[]');
    let loans = JSON.parse(localStorage.getItem('libry_loans') || '[]');
    
    let book = books.find(b => b.id === tempLoanBookId);
    if(book) book.status = 'ON LOAN';
    
    loans.push({ id: 'L' + Math.floor(Math.random()*900+100), bookId: tempLoanBookId, title: tempLoanBookTitle, patron: patronId, dueDate: new Date(Date.now() + 12096e5).toISOString(), status: 'ACTIVE', fines: 0 });
    
    localStorage.setItem('libry_books', JSON.stringify(books));
    localStorage.setItem('libry_loans', JSON.stringify(loans));
    
    showToast(`Loan processed for ${patronId}.`, 'success');
    closeLoanModal();
    performSearch(new Event('submit')); // refresh catalog view
}

function returnBook(loanId) {
    let loans = JSON.parse(localStorage.getItem('libry_loans') || '[]');
    let books = JSON.parse(localStorage.getItem('libry_books') || '[]');
    let loanIndex = loans.findIndex(l => l.id === loanId);
    
    if(loanIndex > -1) {
        let book = books.find(b => b.id === loans[loanIndex].bookId);
        if(book) book.status = 'AVAILABLE';
        loans.splice(loanIndex, 1);
        localStorage.setItem('libry_books', JSON.stringify(books));
        localStorage.setItem('libry_loans', JSON.stringify(loans));
        showToast('Book registered as returned.', 'success');
        renderLoans();
    }
}

function clearFines(memberId) {
    let members = JSON.parse(localStorage.getItem('libry_members') || '[]');
    let member = members.find(m => m.id === memberId);
    if(member) { member.status = 'Good Standing'; localStorage.setItem('libry_members', JSON.stringify(members)); renderMembers(); showToast('Fines cleared successfully.', 'success'); }
}

document.addEventListener("DOMContentLoaded", () => {
    loadNavbar();
    initLibryData();
    setTimeout(() => {
        applyRoleBasedView();
        if(window.location.pathname.includes('loans.html')) renderLoans();
        if(window.location.pathname.includes('members.html')) renderMembers();
        if(window.location.pathname.includes('overdue.html')) renderOverdue();
    }, 100); 
});