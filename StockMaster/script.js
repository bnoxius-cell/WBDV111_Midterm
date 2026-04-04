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
            localStorage.removeItem('stock_role');
            window.location.reload();
        };
    } else {
        authBtn.innerText = "SYS LOGIN";
        authBtn.onclick = null;
    }
}

function handleLogin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('emp-id').value.trim().toLowerCase();
    const passwordInput = document.getElementById('password').value.trim();

    // Hardcoded Database of Users & Roles
    const mockDatabase = {
        'admin': { password: 'adminpassword', role: 'admin' },
        'staff': { password: 'staffpassword', role: 'staff' },
        'user': { password: 'userpassword', role: 'user' }
    };

    const userRecord = mockDatabase[usernameInput];

    if (userRecord && userRecord.password === passwordInput) {
        localStorage.setItem('stock_user', usernameInput);
        localStorage.setItem('stock_role', userRecord.role);
        alert(`SYSTEM ACCESS GRANTED. Welcome, ${usernameInput.toUpperCase()} [Role: ${userRecord.role.toUpperCase()}]`);
        window.location.href = 'index.html';
    } else {
        alert("ACCESS DENIED! Invalid credentials.\nPlease try admin/adminpassword, staff/staffpassword, or user/userpassword.");
    }
}

// Proper UI: Toast Notification System
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = message;
    if (type === 'error') toast.style.borderLeftColor = '#ef4444';
    if (type === 'success') toast.style.borderLeftColor = '#16a34a';
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 4000);
}

function applyRoleRestrictions() {
    const role = localStorage.getItem('stock_role');
    if (role === 'user') {
        document.querySelectorAll('.auth-restricted').forEach(el => el.style.display = 'none');
    }
}

function scanItem() {
    const input = document.getElementById('scan-input').value.trim();
    if(input) {
        let inventory = JSON.parse(localStorage.getItem('stock_inventory') || '[]');
        let itemIndex = inventory.findIndex(i => i.sku.toLowerCase() === input.toLowerCase());
        if(itemIndex > -1) {
            inventory[itemIndex].qty += 1;
            showToast(`ITEM SCANNED: ${input}<br><span style="font-weight:normal;font-size:0.85rem;">Quantity increased by 1.</span>`, 'success');
        } else {
            inventory.unshift({ sku: input, desc: 'Scanned Item (Uncategorized)', qty: 1, limit: 10, price: 0 });
            showToast(`NEW ITEM SCANNED: ${input}<br><span style="font-weight:normal;font-size:0.85rem;">Added to inventory tracking.</span>`, 'success');
        }
        localStorage.setItem('stock_inventory', JSON.stringify(inventory));
        document.getElementById('scan-input').value = "";
        if (typeof loadInventory === 'function') loadInventory();
    } else {
        showToast("Awaiting scanner input. Please focus on the text field and scan barcode.", 'error');
    }
}

let currentItemForLimit = '';
function setLimit(item) {
    currentItemForLimit = item;
    const modal = document.getElementById('limit-modal');
    if(modal) {
        document.getElementById('limit-item-name').innerText = item;
        document.getElementById('limit-input').value = 50;
        modal.style.display = 'flex';
    }
}

function closeLimitModal() {
    document.getElementById('limit-modal').style.display = 'none';
}

function submitLimit(event) {
    event.preventDefault();
    const limit = document.getElementById('limit-input').value;
    
    let inventory = JSON.parse(localStorage.getItem('stock_inventory') || '[]');
    let itemIndex = inventory.findIndex(i => i.desc === currentItemForLimit);
    if(itemIndex > -1) {
        inventory[itemIndex].limit = parseInt(limit);
        localStorage.setItem('stock_inventory', JSON.stringify(inventory));
    }

    showToast(`Stock limit for ${currentItemForLimit} successfully updated to ${limit} units.`, 'success');
    closeLimitModal();
    if (typeof loadInventory === 'function') loadInventory();
}

function alertSupplier(supplier) {
    showToast(`DISPATCH SENT:<br><span style="font-weight:normal;font-size:0.85rem;">Automated restock alert has been sent to ${supplier}.</span>`, 'success');
}

function generateReport(btnElement) {
    let originalText = "GENERATE MASTER REPORT";
    if (btnElement) {
        originalText = btnElement.innerText;
        btnElement.innerText = "GENERATING...";
        btnElement.disabled = true;
    }

    const inventory = JSON.parse(localStorage.getItem('stock_inventory') || '[]');
    const totalValue = inventory.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const criticalCount = inventory.filter(i => i.qty <= i.limit).length;

    const element = document.createElement('div');
    element.innerHTML = `
        <div style="padding: 40px; font-family: 'Inter', sans-serif; color: #0f172a;">
            <h1 style="border-bottom: 3px solid #0f172a; padding-bottom: 10px; margin-bottom: 20px; font-size: 24px; text-transform: uppercase;">StockMaster Master Report</h1>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Region:</strong> Global Inventory Data</p>
            <hr style="border: 1px solid #cbd5e1; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead><tr style="background: #e2e8f0; text-align: left;"><th style="padding: 10px; border-bottom: 1px solid #cbd5e1;">Metric</th><th style="padding: 10px; border-bottom: 1px solid #cbd5e1;">Value</th></tr></thead>
                <tbody>
                    <tr><td style="padding: 10px; border-bottom: 1px solid #cbd5e1;">Total Inventory Value</td><td style="padding: 10px; border-bottom: 1px solid #cbd5e1;">PHP ${totalValue.toLocaleString()}</td></tr>
                    <tr><td style="padding: 10px; border-bottom: 1px solid #cbd5e1;">Critical Stock Items</td><td style="padding: 10px; border-bottom: 1px solid #cbd5e1; color: #ef4444;">${criticalCount}</td></tr>
                    <tr><td style="padding: 10px; border-bottom: 1px solid #cbd5e1;">Pending Deliveries</td><td style="padding: 10px; border-bottom: 1px solid #cbd5e1;">${JSON.parse(localStorage.getItem('stock_orders') || '[]').length}</td></tr>
                </tbody>
            </table>
            <p style="color: #64748b; font-size: 12px; margin-top: 50px;">Generated securely via StockMaster Inventory Platform.</p>
        </div>
    `;

    const downloadPDF = () => {
        html2pdf().from(element).save('StockMaster_Report.pdf').then(() => {
            if (btnElement) { btnElement.innerText = originalText; btnElement.disabled = false; }
            showToast("Master Report PDF Generated Successfully", 'success');
        });
    };

    if (typeof html2pdf === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = downloadPDF;
        document.head.appendChild(script);
    } else {
        downloadPDF();
    }
}

/* --- DATA LAYER INITIALIZATION --- */
function initData() {
    if (!localStorage.getItem('stock_inventory')) {
        localStorage.setItem('stock_inventory', JSON.stringify([
            { sku: 'SKU-MNL-8821', desc: 'Industrial Desk Fan 18"', qty: 245, limit: 50, price: 1500 },
            { sku: 'SKU-CEB-0992', desc: 'Heavy Duty Packing Tape 2"', qty: 12, limit: 50, price: 120 },
            { sku: 'SKU-DVO-4410', desc: 'Warehouse Utility Gloves (L)', qty: 890, limit: 100, price: 250 }
        ]));
    }
    if (!localStorage.getItem('stock_suppliers')) {
        localStorage.setItem('stock_suppliers', JSON.stringify([
            { code: 'SUP-001', name: 'Manila Logistics Corp.', region: 'Metro Manila', contact: 'Juan Dela Cruz' },
            { code: 'SUP-045', name: 'Cebu Hardware Suppliers Inc.', region: 'Visayas', contact: 'Maria Santos' },
            { code: 'SUP-088', name: 'Global Packaging PH', region: 'Laguna', contact: 'Carlos Reyes' }
        ]));
    }
    if (!localStorage.getItem('stock_orders')) {
        localStorage.setItem('stock_orders', JSON.stringify([
            { id: 'MNF-2024-8891', supplier: 'Global Packaging PH', date: 'Oct 15, 2024', value: 45500.00, status: 'IN TRANSIT' },
            { id: 'MNF-2024-8892', supplier: 'Manila Logistics Corp.', date: 'Oct 16, 2024', value: 128000.00, status: 'PREPARING' }
        ]));
    }
}

/* --- DYNAMIC RENDERERS --- */
function loadInventory() {
    const inventory = JSON.parse(localStorage.getItem('stock_inventory') || '[]');
    const tbody = document.getElementById('inventory-tbody');
    if(!tbody) return;
    tbody.innerHTML = '';
    inventory.forEach(item => {
        const isCritical = item.qty <= item.limit;
        const badge = isCritical ? '<span class="status-badge status-low">CRITICAL</span>' : '<span class="status-badge status-ok">OPTIMAL</span>';
        tbody.innerHTML += `<tr>
            <td style="font-family: monospace; font-weight: bold;">${item.sku}</td>
            <td>${item.desc}</td>
            <td>${item.qty} Units</td>
            <td>${badge}</td>
            <td style="display: flex; gap: 5px;">
                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="setLimit('${item.desc}')">Limit</button>
                <button class="btn btn-secondary auth-restricted" style="padding: 6px 12px; font-size: 0.8rem;" onclick="dispatchItem('${item.sku}')">Dispatch</button>
                <button class="btn btn-secondary auth-restricted" style="padding: 6px 12px; font-size: 0.8rem;" onclick="editItem('${item.sku}')">Edit</button>
                <button class="btn btn-alert auth-restricted" style="padding: 6px 12px; font-size: 0.8rem;" onclick="deleteItem('${item.sku}')">Delete</button>
            </td>
        </tr>`;
    });
    applyRoleRestrictions();
}

/* --- CRUD & DISPATCH FUNCTIONS --- */
let currentDispatchSku = '';
function dispatchItem(sku) {
    let inventory = JSON.parse(localStorage.getItem('stock_inventory') || '[]');
    let item = inventory.find(i => i.sku === sku);
    if (!item) return;
    
    currentDispatchSku = sku;
    const modal = document.getElementById('dispatch-modal');
    if (modal) {
        document.getElementById('dispatch-item-name').innerText = item.desc;
        document.getElementById('dispatch-current-qty').innerText = item.qty;
        document.getElementById('dispatch-qty').value = 1;
        document.getElementById('dispatch-qty').max = item.qty;
        modal.style.display = 'flex';
    }
}

function closeDispatchModal() { document.getElementById('dispatch-modal').style.display = 'none'; }
function submitDispatch(event) {
    event.preventDefault();
    let qtyToDeduct = parseInt(document.getElementById('dispatch-qty').value);
    let inventory = JSON.parse(localStorage.getItem('stock_inventory') || '[]');
    let item = inventory.find(i => i.sku === currentDispatchSku);
    if (!item) return;

    if (isNaN(qtyToDeduct) || qtyToDeduct <= 0) return showToast("Invalid quantity.", 'error');
    if (qtyToDeduct > item.qty) return showToast("Cannot dispatch more than current stock.", 'error');
    item.qty -= qtyToDeduct;
    localStorage.setItem('stock_inventory', JSON.stringify(inventory));
    showToast(`SUCCESS: ${qtyToDeduct} units of ${item.desc} dispatched.`, 'success');
    closeDispatchModal();
    loadInventory();
}

let currentEditSku = '';
function editItem(sku) {
    let inventory = JSON.parse(localStorage.getItem('stock_inventory') || '[]');
    let item = inventory.find(i => i.sku === sku);
    if (!item) return;
    currentEditSku = sku;
    document.getElementById('edit-desc').value = item.desc;
    document.getElementById('edit-qty').value = item.qty;
    document.getElementById('edit-price').value = item.price;
    document.getElementById('edit-modal').style.display = 'flex';
}
function closeEditModal() { document.getElementById('edit-modal').style.display = 'none'; }
function submitEdit(event) {
    event.preventDefault();
    let inventory = JSON.parse(localStorage.getItem('stock_inventory') || '[]');
    let item = inventory.find(i => i.sku === currentEditSku);
    if(item) {
        item.desc = document.getElementById('edit-desc').value.trim();
        item.qty = parseInt(document.getElementById('edit-qty').value);
        item.price = parseFloat(document.getElementById('edit-price').value);
        localStorage.setItem('stock_inventory', JSON.stringify(inventory));
        showToast("Item details updated successfully.", 'success');
        closeEditModal();
        loadInventory();
    }
}

let currentDeleteSku = '';
function deleteItem(sku) {
    currentDeleteSku = sku;
    const modal = document.getElementById('delete-modal');
    if (modal) {
        document.getElementById('delete-item-sku').innerText = sku;
        modal.style.display = 'flex';
    }
}
function closeDeleteModal() { document.getElementById('delete-modal').style.display = 'none'; }
function confirmDelete() {
    let inventory = JSON.parse(localStorage.getItem('stock_inventory') || '[]');
    inventory = inventory.filter(i => i.sku !== currentDeleteSku);
    localStorage.setItem('stock_inventory', JSON.stringify(inventory));
    showToast(`Item ${currentDeleteSku} has been removed.`, 'success');
    closeDeleteModal();
    loadInventory();
}

function loadSuppliers() {
    const suppliers = JSON.parse(localStorage.getItem('stock_suppliers') || '[]');
    const tbody = document.getElementById('suppliers-tbody');
    if(!tbody) return;
    tbody.innerHTML = '';
    suppliers.forEach(s => {
        tbody.innerHTML += `<tr>
            <td style="font-family: monospace;">${s.code}</td>
            <td><strong>${s.name}</strong></td>
            <td>${s.region}</td>
            <td>${s.contact}</td>
            <td><button class="btn btn-alert" onclick="alertSupplier('${s.name}')">ALERT RESTOCK</button></td>
        </tr>`;
    });
}

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('stock_orders') || '[]');
    const tbody = document.getElementById('orders-tbody');
    if(!tbody) return;
    tbody.innerHTML = '';
    orders.forEach(o => {
        tbody.innerHTML += `<tr>
            <td style="font-family: monospace; font-weight: bold;">${o.id}</td>
            <td>${o.supplier}</td>
            <td>${o.date}</td>
            <td>PHP ${o.value.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
            <td>
                <span class="status-badge ${o.status === 'DELIVERED' ? 'status-ok' : 'status-low'}" style="${o.status === 'DELIVERED' ? '' : 'background: #fef08a; color: #854d0e;'}">${o.status}</span>
            </td>
            <td>
                ${o.status === 'IN TRANSIT' ? `<button class="btn btn-action auth-restricted" style="padding: 6px 12px; font-size: 0.8rem;" onclick="receiveOrder('${o.id}')">Receive Shipment</button>` : ''}
            </td>
        </tr>`;
    });
    applyRoleRestrictions();
}

function receiveOrder(orderId) {
    let orders = JSON.parse(localStorage.getItem('stock_orders') || '[]');
    let order = orders.find(o => o.id === orderId);
    if(order) {
        order.status = 'DELIVERED';
        localStorage.setItem('stock_orders', JSON.stringify(orders));
        showToast(`Order ${orderId} received. Master inventory updated!`, 'success');
        loadOrders();
    }
}

let inventoryChartInstance = null;
function loadReports() {
    const inventory = JSON.parse(localStorage.getItem('stock_inventory') || '[]');
    const orders = JSON.parse(localStorage.getItem('stock_orders') || '[]');
    
    const totalValue = inventory.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const criticalCount = inventory.filter(i => i.qty <= i.limit).length;
    
    const elVal = document.getElementById('report-total-value');
    const elCrit = document.getElementById('report-critical-items');
    const elPend = document.getElementById('report-pending-deliveries');
    
    if(elVal) elVal.innerText = 'PHP ' + totalValue.toLocaleString();
    if(elCrit) elCrit.innerText = criticalCount;
    if(elPend) elPend.innerText = orders.length;

    // Render Chart.js visualization
    const ctx = document.getElementById('inventoryChart');
    if (ctx) {
        if (inventoryChartInstance) inventoryChartInstance.destroy();
        
        const labels = inventory.map(i => i.desc.length > 15 ? i.desc.substring(0, 15) + '...' : i.desc);
        const qtys = inventory.map(i => i.qty);
        const limits = inventory.map(i => i.limit);

        inventoryChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Current Quantity', data: qtys, backgroundColor: '#0f172a' },
                    { label: 'Minimum Limit', data: limits, backgroundColor: '#ff5722' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

/* --- MANUAL ENTRY & SUPPLIER MODALS --- */
function openManualEntryModal() { document.getElementById('manual-entry-modal').style.display = 'flex'; }
function closeManualEntryModal() { document.getElementById('manual-entry-modal').style.display = 'none'; }
function submitManualEntry(event) {
    event.preventDefault();
    const sku = document.getElementById('me-sku').value.trim();
    const desc = document.getElementById('me-desc').value.trim();
    const qty = parseInt(document.getElementById('me-qty').value);
    const inventory = JSON.parse(localStorage.getItem('stock_inventory') || '[]');
    inventory.unshift({ sku, desc, qty, limit: 10, price: 0 });
    localStorage.setItem('stock_inventory', JSON.stringify(inventory));
    closeManualEntryModal();
    showToast(`Successfully added ${qty} units of ${sku}.`, 'success');
    loadInventory();
    event.target.reset();
}

document.addEventListener("DOMContentLoaded", () => {
    loadNavbar();
    initData();
    const path = window.location.pathname;
    if (path.includes('index.html') || path === '/' || path === '') loadInventory();
    if (path.includes('suppliers.html')) loadSuppliers();
    if (path.includes('orders.html')) loadOrders();
    if (path.includes('reports.html')) loadReports();
    applyRoleRestrictions(); // Apply globally on load
});