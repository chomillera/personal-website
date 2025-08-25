// Language translations
const translations = {
    en: {
        appTitle: 'Invoice Generator',
        appSubtitle: 'Create professional invoices easily',
        companyInfoTitle: 'Company Information',
        companyNameLabel: 'Company Name',
        companyAddressLabel: 'Address',
        companyPhoneLabel: 'Phone',
        companyEmailLabel: 'Email',
        clientInfoTitle: 'Client Information',
        clientNameLabel: 'Client Name',
        clientAddressLabel: 'Client Address',
        billToTitle: 'Bill To',
        invoiceNumberLabel: 'Invoice No.',
        invoiceDateLabel: 'Date',
        dueDateLabel: 'Due Date',
        companyLogoLabel: 'Company Logo:',
        itemsTitle: 'Invoice Items',
        descriptionLabel: 'Description',
        qtyLabel: 'Qty',
        priceLabel: 'Price',
        totalLabel: 'Total',
        addItemBtn: 'Add Item',
        totalSectionTitle: 'Total',
        subtotalLabel: 'Subtotal:',
        taxRateLabel: 'Tax (%):',
        totalFinalLabel: 'Total:',
        paymentInfoTitle: 'Payment Information',
        paymentMethodLabel: 'Payment Method:',
        paymentMethodPlaceholder: 'Bank Transfer to:\nAccount Name: Your Company\nAccount Number: 1234567890\nBank: Your Bank Name',
        descriptionPlaceholder: 'Item description',
        companyNamePlaceholder: 'PT. Example Company',
        companyAddressPlaceholder: 'Jl. Example No. 123\nJakarta 12345',
        companyPhonePlaceholder: '021-1234567',
        companyEmailPlaceholder: 'info@company.com',
        clientNamePlaceholder: 'Client Name',
        clientAddressPlaceholder: 'Complete client address',
        invoiceNumberPlaceholder: 'INV-001',
        previewBtn: 'Preview',
        exportBtn: 'Export PDF',
        previewPlaceholder1: 'Invoice preview will appear here',
        previewPlaceholder2: 'Click "Preview" button to view invoice',
        free: 'FREE'
    },
    id: {
        appTitle: 'Generator Invoice',
        appSubtitle: 'Buat invoice profesional dengan mudah',
        companyInfoTitle: 'Informasi Perusahaan',
        companyNameLabel: 'Nama Perusahaan',
        companyAddressLabel: 'Alamat',
        companyPhoneLabel: 'Telepon',
        companyEmailLabel: 'Email',
        clientInfoTitle: 'Informasi Klien',
        clientNameLabel: 'Nama Klien',
        clientAddressLabel: 'Alamat Klien',
        billToTitle: 'Tagihan Untuk',
        invoiceNumberLabel: 'No. Invoice',
        invoiceDateLabel: 'Tanggal',
        dueDateLabel: 'Jatuh Tempo',
        companyLogoLabel: 'Logo Perusahaan:',
        itemsTitle: 'Item Invoice',
        descriptionLabel: 'Deskripsi',
        qtyLabel: 'Qty',
        priceLabel: 'Harga',
        totalLabel: 'Total',
        addItemBtn: 'Tambah Item',
        totalSectionTitle: 'Total',
        subtotalLabel: 'Subtotal:',
        taxRateLabel: 'Pajak (%):',
        totalFinalLabel: 'Total:',
        paymentInfoTitle: 'Informasi Pembayaran',
        paymentMethodLabel: 'Metode Pembayaran:',
        paymentMethodPlaceholder: 'Transfer Bank ke:\nNama Rekening: Perusahaan Anda\nNo. Rekening: 1234567890\nBank: Nama Bank Anda',
        descriptionPlaceholder: 'Deskripsi item',
        companyNamePlaceholder: 'PT. Contoh Perusahaan',
        companyAddressPlaceholder: 'Jl. Contoh No. 123\nJakarta 12345',
        companyPhonePlaceholder: '021-1234567',
        companyEmailPlaceholder: 'info@perusahaan.com',
        clientNamePlaceholder: 'Nama Klien',
        clientAddressPlaceholder: 'Alamat lengkap klien',
        invoiceNumberPlaceholder: 'INV-001',
        previewBtn: 'Preview',
        exportBtn: 'Export PDF',
        previewPlaceholder1: 'Preview invoice akan muncul di sini',
        previewPlaceholder2: 'Klik tombol "Preview" untuk melihat invoice',
        free: 'GRATIS'
    }
};

// Currency symbols
const currencySymbols = {
    USD: '$',
    IDR: 'Rp ',
    EUR: '€',
    GBP: '£',
    JPY: '¥'
};

// Global variables
let itemCount = 1;
let currentLanguage = 'en';
let currentCurrency = 'USD';
let companyLogo = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set default dates
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    
    document.getElementById('invoiceDate').value = today.toISOString().split('T')[0];
    document.getElementById('dueDate').value = nextMonth.toISOString().split('T')[0];
    
    // Generate default invoice number
    document.getElementById('invoiceNumber').value = 'INV-' + Date.now().toString().slice(-6);
    
    // Add event listeners for automatic calculation
    addCalculationListeners();
    
    // Add event listeners for new features
    document.getElementById('language').addEventListener('change', changeLanguage);
    document.getElementById('currency').addEventListener('change', changeCurrency);
    document.getElementById('companyLogo').addEventListener('change', handleLogoUpload);
    
    // Set default values for dropdowns
    document.getElementById('language').value = currentLanguage;
    document.getElementById('currency').value = currentCurrency;
    
    // Initialize language and currency
    updateLanguage();
    updateCurrency();
    
    // Initial calculation for existing items
    const existingItems = document.querySelectorAll('.item-row');
    existingItems.forEach(row => {
        calculateItemTotal(row);
    });
    calculateTotals();
});

// Add event listeners for automatic calculation
function addCalculationListeners() {
    const container = document.getElementById('itemsContainer');
    container.addEventListener('input', function(e) {
        if (e.target.classList.contains('item-quantity') || e.target.classList.contains('item-price')) {
            calculateItemTotal(e.target.closest('.item-row'));
            calculateTotals();
        }
    });
    
    // Add listener for tax rate changes
    const taxRateInput = document.getElementById('taxRate');
    taxRateInput.addEventListener('input', calculateTotals);
}

// Add new item row
function addItem() {
    itemCount++;
    const container = document.getElementById('itemsContainer');
    const newItem = document.createElement('div');
    newItem.className = 'item-row';
    
    const placeholder = translations[currentLanguage].descriptionPlaceholder;
    
    newItem.innerHTML = `
        <div class="form-group">
            <label>Deskripsi</label>
            <input type="text" class="item-description" placeholder="${placeholder}">
        </div>
        <div class="form-group">
            <label>Qty</label>
            <input type="number" class="item-quantity" placeholder="1" min="0" value="1">
        </div>
        <div class="form-group">
            <label>Harga</label>
            <input type="number" class="item-price" placeholder="0" min="0" value="0">
        </div>
        <div class="form-group">
            <label>Total</label>
            <input type="text" class="item-total" readonly>
        </div>
        <button type="button" class="btn-remove-item" onclick="removeItem(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    container.appendChild(newItem);
    
    // Calculate total for the new item
    calculateItemTotal(newItem);
    
    // Focus on the new item description
    newItem.querySelector('.item-description').focus();
}

// Remove item row
function removeItem(button) {
    const itemRow = button.closest('.item-row');
    const container = document.getElementById('itemsContainer');
    
    // Don't remove if it's the last item
    if (container.children.length > 1) {
        itemRow.remove();
        calculateTotals();
    } else {
        alert('Minimal harus ada satu item!');
    }
}

// Calculate individual item total
function calculateItemTotal(itemRow) {
    const quantity = parseFloat(itemRow.querySelector('.item-quantity').value) || 0;
    const price = parseFloat(itemRow.querySelector('.item-price').value) || 0;
    const total = quantity * price;
    
    const totalElement = itemRow.querySelector('.item-total');
    
    // Store the actual numeric total as a data attribute
    totalElement.dataset.numericTotal = total;
    
    // Check if quantity is 0 and price is 0, then show FREE/GRATIS
    if (quantity === 0 && price === 0) {
        totalElement.value = translations[currentLanguage].free;
        totalElement.style.fontWeight = 'bold';
        totalElement.style.color = '#28a745';
        totalElement.dataset.numericTotal = 0;
    } else {
        totalElement.value = formatCurrency(total);
        totalElement.style.fontWeight = 'normal';
        totalElement.style.color = 'inherit';
    }
}

// Calculate all totals
function calculateTotals() {
    const itemRows = document.querySelectorAll('.item-row');
    let subtotal = 0;
    
    itemRows.forEach(row => {
         calculateItemTotal(row);
         const itemTotal = parseFloat(row.querySelector('.item-total').dataset.numericTotal) || 0;
         subtotal += itemTotal;
     });
    
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const tax = subtotal * (taxRate / 100);
    const grandTotal = subtotal + tax;
    
    // Update display
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('tax').textContent = formatCurrency(tax);
    document.getElementById('grandTotal').textContent = formatCurrency(grandTotal);
}

// Format currency based on selected currency
function formatCurrency(amount) {
    const symbol = currencySymbols[currentCurrency];
    const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
    
    if (currentCurrency === 'IDR') {
        return symbol + formatted.replace(/\.00$/, '');
    }
    return symbol + formatted;
}

// Change language function
function changeLanguage() {
    currentLanguage = document.getElementById('language').value;
    updateLanguage();
    calculateTotals(); // Recalculate to update FREE/GRATIS text
}

// Update language in UI
function updateLanguage() {
    const t = translations[currentLanguage];
    
    // Helper function to safely update element
    function safeUpdate(id, property, value) {
        const element = document.getElementById(id);
        if (element) {
            if (property === 'innerHTML') {
                element.innerHTML = value;
            } else if (property === 'textContent') {
                element.textContent = value;
            } else if (property === 'placeholder') {
                element.placeholder = value;
            }
        }
    }
    
    // Update main UI elements
    safeUpdate('app-title', 'innerHTML', '<i class="fas fa-file-invoice"></i> ' + t.appTitle);
    safeUpdate('app-subtitle', 'textContent', t.appSubtitle);
    safeUpdate('company-info-title', 'innerHTML', '<i class="fas fa-building"></i> ' + t.companyInfoTitle);
    safeUpdate('company-name-label', 'textContent', t.companyNameLabel);
    safeUpdate('company-address-label', 'textContent', t.companyAddressLabel);
    safeUpdate('company-phone-label', 'textContent', t.companyPhoneLabel);
    safeUpdate('company-email-label', 'textContent', t.companyEmailLabel);
    safeUpdate('client-info-title', 'innerHTML', '<i class="fas fa-user"></i> ' + t.clientInfoTitle);
    safeUpdate('client-name-label', 'textContent', t.clientNameLabel);
    safeUpdate('client-address-label', 'textContent', t.clientAddressLabel);
    safeUpdate('invoice-number-label', 'textContent', t.invoiceNumberLabel);
    safeUpdate('invoice-date-label', 'textContent', t.invoiceDateLabel);
    safeUpdate('due-date-label', 'textContent', t.dueDateLabel);
    safeUpdate('company-logo-label', 'textContent', t.companyLogoLabel);
    safeUpdate('items-title', 'innerHTML', '<i class="fas fa-list"></i> ' + t.itemsTitle);
    safeUpdate('description-label', 'textContent', t.descriptionLabel);
    safeUpdate('qty-label', 'textContent', t.qtyLabel);
    safeUpdate('price-label', 'textContent', t.priceLabel);
    safeUpdate('total-label', 'textContent', t.totalLabel);
    safeUpdate('addItemBtn', 'innerHTML', '<i class="fas fa-plus"></i> ' + t.addItemBtn);
    safeUpdate('total-section-title', 'innerHTML', '<i class="fas fa-calculator"></i> ' + t.totalSectionTitle);
    safeUpdate('subtotal-label', 'textContent', t.subtotalLabel);
    safeUpdate('tax-rate-label', 'textContent', t.taxRateLabel);
    safeUpdate('total-final-label', 'textContent', t.totalFinalLabel);
    safeUpdate('payment-info-title', 'textContent', t.paymentInfoTitle);
    safeUpdate('payment-method-label', 'textContent', t.paymentMethodLabel);
    safeUpdate('paymentMethod', 'placeholder', t.paymentMethodPlaceholder);
    
    // Update placeholders for form fields
    safeUpdate('companyName', 'placeholder', t.companyNamePlaceholder);
    safeUpdate('companyAddress', 'placeholder', t.companyAddressPlaceholder);
    safeUpdate('companyPhone', 'placeholder', t.companyPhonePlaceholder);
    safeUpdate('companyEmail', 'placeholder', t.companyEmailPlaceholder);
    safeUpdate('clientName', 'placeholder', t.clientNamePlaceholder);
    safeUpdate('clientAddress', 'placeholder', t.clientAddressPlaceholder);
    safeUpdate('invoiceNumber', 'placeholder', t.invoiceNumberPlaceholder);
    
    const previewBtn = document.getElementById('previewBtn');
    if (previewBtn) {
        previewBtn.innerHTML = '<i class="fas fa-eye"></i> ' + t.previewBtn;
    }
    
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.innerHTML = '<i class="fas fa-download"></i> ' + t.exportBtn;
    }
    
    const previewPlaceholder1 = document.getElementById('preview-placeholder-1');
    if (previewPlaceholder1) {
        previewPlaceholder1.textContent = t.previewPlaceholder1;
    }
    
    const previewPlaceholder2 = document.getElementById('preview-placeholder-2');
    if (previewPlaceholder2) {
        previewPlaceholder2.textContent = t.previewPlaceholder2;
    }
    
    // Update placeholders for all existing item description fields
    const itemDescriptions = document.querySelectorAll('.item-description');
    itemDescriptions.forEach(input => {
        input.placeholder = t.descriptionPlaceholder;
    });
}

// Change currency function
function changeCurrency() {
    currentCurrency = document.getElementById('currency').value;
    updateCurrency();
    calculateTotals(); // Recalculate to update currency symbols
}

// Update currency in UI
function updateCurrency() {
    // Update all currency displays
    calculateTotals();
}

// Handle logo upload
function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            companyLogo = e.target.result;
            // Show preview
            const preview = document.getElementById('logoPreview');
            if (preview) {
                preview.innerHTML = `<img src="${companyLogo}" alt="Company Logo">`;
                preview.classList.add('has-logo');
            }
        };
        reader.readAsDataURL(file);
    }
}

// Generate invoice preview
function generatePreview() {
    const data = getFormData();
    const t = translations[data.language];
    
    // Validate required fields
    if (!validateData(data)) {
        return;
    }
    
    let itemsHTML = '';
    data.items.forEach(item => {
        const totalDisplay = item.isFree ? t.free : formatCurrency(item.total);
        itemsHTML += `
            <tr>
                <td>${item.description}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">${item.isFree ? t.free : formatCurrency(item.price)}</td>
                <td style="text-align: right; ${item.isFree ? 'font-weight: bold; color: #28a745;' : ''}">${totalDisplay}</td>
            </tr>
        `;
    });
    
    const logoHTML = data.logo ? `<img src="${data.logo}" alt="Company Logo" style="max-height: 80px; margin-bottom: 20px;">` : '';
    const paymentHTML = data.paymentMethod ? `
        <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">${t.paymentInfoTitle}</h3>
            <p style="white-space: pre-line; margin: 0;">${data.paymentMethod}</p>
        </div>
    ` : '';
    
    const previewHTML = `
        <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 30px;">
                ${logoHTML}
                <h1 style="color: #00BFFF; margin: 0;">INVOICE</h1>
                <p style="margin: 5px 0; color: #666;">#${data.invoice.number}</p>
                <p style="margin: 5px 0; color: #666;">${new Date(data.invoice.date).toLocaleDateString()}</p>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h3 style="color: #333; border-bottom: 2px solid #00BFFF; padding-bottom: 5px;">${t.billToTitle}:</h3>
                <p style="margin: 5px 0; font-weight: bold;">${data.client.name}</p>
                <p style="margin: 5px 0; white-space: pre-line;">${data.client.address}</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr style="background-color: #00BFFF; color: white;">
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">${data.language === 'id' ? 'Deskripsi' : 'Description'}</th>
                        <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Qty</th>
                        <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">${data.language === 'id' ? 'Harga' : 'Price'}</th>
                        <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>
            
            <div style="text-align: right; margin-top: 30px;">
                <div style="display: inline-block; text-align: right;">
                    <p style="margin: 5px 0;"><strong>${t.subtotalLabel} ${formatCurrency(data.totals.subtotal)}</strong></p>
                    <p style="margin: 5px 0;"><strong>${data.language === 'id' ? 'Pajak' : 'Tax'} (${data.totals.taxRate}%): ${formatCurrency(data.totals.tax)}</strong></p>
                    <p style="margin: 10px 0; font-size: 1.2em; color: #00BFFF; border-top: 2px solid #00BFFF; padding-top: 10px;"><strong>${t.totalLabel} ${formatCurrency(data.totals.grandTotal)}</strong></p>
                </div>
            </div>
            
            ${paymentHTML}
        </div>
    `;
    
    // Display preview in the preview section
    const previewElement = document.getElementById('invoicePreview');
    if (previewElement) {
        previewElement.innerHTML = previewHTML;
        previewElement.style.display = 'block';
    }
}

// Get all form data
function getFormData() {
    const items = [];
    const itemRows = document.querySelectorAll('.item-row');
    
    itemRows.forEach(row => {
        const description = row.querySelector('.item-description').value;
        const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const total = parseFloat(row.querySelector('.item-total').dataset.numericTotal) || 0;
        const isFree = quantity === 0 && price === 0;
        
        if (description || quantity > 0 || price > 0) {
            items.push({ description, quantity, price, total, isFree });
        }
    });
    
    const subtotal = items.reduce((sum, item) => sum + (item.isFree ? 0 : item.total), 0);
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const tax = subtotal * (taxRate / 100);
    const grandTotal = subtotal + tax;
    
    return {
        company: {
            name: document.getElementById('companyName').value,
            address: document.getElementById('companyAddress').value,
            phone: document.getElementById('companyPhone').value,
            email: document.getElementById('companyEmail').value
        },
        client: {
            name: document.getElementById('clientName').value,
            address: document.getElementById('clientAddress').value
        },
        invoice: {
            number: document.getElementById('invoiceNumber').value,
            date: document.getElementById('invoiceDate').value,
            dueDate: document.getElementById('dueDate').value
        },
        items,
        totals: {
            subtotal,
            tax,
            taxRate,
            grandTotal
        },
        language: currentLanguage,
        currency: currentCurrency,
        logo: companyLogo,
        paymentMethod: document.getElementById('paymentMethod').value
    };
}

// Validate form data
function validateData(data) {
    const required = [
        { field: data.company.name, name: 'Nama Perusahaan' },
        { field: data.client.name, name: 'Nama Klien' },
        { field: data.invoice.number, name: 'Nomor Invoice' },
        { field: data.invoice.date, name: 'Tanggal Invoice' }
    ];
    
    for (let item of required) {
        if (!item.field || item.field.trim() === '') {
            alert(`${item.name} harus diisi!`);
            return false;
        }
    }
    
    if (data.items.length === 0) {
        alert('Minimal harus ada satu item yang valid!');
        return false;
    }
    
    return true;
}

// Generate invoice HTML
function generateInvoiceHTML(data) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    return `
        <div class="invoice-content">
            <div class="invoice-header">
                <div class="company-info">
                    <h3>${data.company.name}</h3>
                    <p>${data.company.address.replace(/\n/g, '<br>')}</p>
                    ${data.company.phone ? `<p>Tel: ${data.company.phone}</p>` : ''}
                    ${data.company.email ? `<p>Email: ${data.company.email}</p>` : ''}
                </div>
                <div class="invoice-meta">
                    <h2>INVOICE</h2>
                    <p><strong>${data.invoice.number}</strong></p>
                    <p>Tanggal: ${formatDate(data.invoice.date)}</p>
                    ${data.invoice.dueDate ? `<p>Jatuh Tempo: ${formatDate(data.invoice.dueDate)}</p>` : ''}
                </div>
            </div>
            
            <div class="client-info">
                <h4>Tagihan Kepada:</h4>
                <p><strong>${data.client.name}</strong></p>
                <p>${data.client.address.replace(/\n/g, '<br>')}</p>
            </div>
            
            <table class="invoice-table">
                <thead>
                    <tr>
                        <th>Deskripsi</th>
                        <th>Qty</th>
                        <th>Harga</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.items.map(item => `
                        <tr>
                            <td>${item.description}</td>
                            <td>${item.quantity}</td>
                            <td>${formatCurrency(item.price)}</td>
                            <td>${formatCurrency(item.total)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="invoice-totals">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>${formatCurrency(data.totals.subtotal)}</span>
                </div>
                <div class="total-row">
                    <span>Pajak (${data.totals.taxRate}%):</span>
                    <span>${formatCurrency(data.totals.tax)}</span>
                </div>
                <div class="total-final">
                    <span>Total:</span>
                    <span>${formatCurrency(data.totals.grandTotal)}</span>
                </div>
            </div>
        </div>
    `;
}

// Export to PDF
function exportToPDF() {
    const data = getFormData();
    const t = translations[data.language];
    
    if (!validateData(data)) {
        return;
    }
    
    // Show loading state
    const exportBtn = document.querySelector('.btn-export');
    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengexport...';
    exportBtn.disabled = true;
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set font
        doc.setFont('helvetica');
        
        let currentY = 30;
        
        // Add logo if available
        if (data.logo) {
            try {
                doc.addImage(data.logo, 'JPEG', 20, 20, 40, 20);
                currentY = 50;
            } catch (e) {
                console.warn('Could not add logo to PDF:', e);
            }
        }
        
        // Header
        doc.setFontSize(20);
        doc.setTextColor(0, 191, 255);
        doc.text('INVOICE', 20, currentY);
        
        // Company info
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(data.company.name, 20, currentY + 20);
        
        doc.setFont('helvetica', 'normal');
        const companyAddress = data.company.address.split('\n');
        let yPos = currentY + 30;
        companyAddress.forEach(line => {
            doc.text(line, 20, yPos);
            yPos += 7;
        });
        
        if (data.company.phone) {
            doc.text(`Tel: ${data.company.phone}`, 20, yPos);
            yPos += 7;
        }
        if (data.company.email) {
            doc.text(`Email: ${data.company.email}`, 20, yPos);
        }
        
        // Invoice details
        doc.setFont('helvetica', 'bold');
        doc.text(`No: ${data.invoice.number}`, 140, currentY + 20);
        doc.setFont('helvetica', 'normal');
        doc.text(`${data.language === 'id' ? 'Tanggal' : 'Date'}: ${new Date(data.invoice.date).toLocaleDateString(data.language === 'id' ? 'id-ID' : 'en-US')}`, 140, currentY + 30);
        if (data.invoice.dueDate) {
            doc.text(`${data.language === 'id' ? 'Jatuh Tempo' : 'Due Date'}: ${new Date(data.invoice.dueDate).toLocaleDateString(data.language === 'id' ? 'id-ID' : 'en-US')}`, 140, currentY + 40);
        }
        
        // Client info
        yPos = currentY + 70;
        doc.setFont('helvetica', 'bold');
        doc.text(`${t.billToTitle}:`, 20, yPos);
        yPos += 10;
        doc.text(data.client.name, 20, yPos);
        yPos += 7;
        
        doc.setFont('helvetica', 'normal');
        const clientAddress = data.client.address.split('\n');
        clientAddress.forEach(line => {
            doc.text(line, 20, yPos);
            yPos += 7;
        });
        
        // Items table
        yPos += 10;
        const tableStartY = yPos;
        
        // Table header
        doc.setFillColor(0, 191, 255);
        doc.rect(20, yPos, 170, 12, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(data.language === 'id' ? 'Deskripsi' : 'Description', 25, yPos + 8);
        doc.text('Qty', 115, yPos + 8, { align: 'center' });
        doc.text(data.language === 'id' ? 'Harga' : 'Price', 140, yPos + 8, { align: 'right' });
        doc.text('Total', 185, yPos + 8, { align: 'right' });
        
        yPos += 12;
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        
        // Table rows
        data.items.forEach((item, index) => {
            if (index % 2 === 0) {
                doc.setFillColor(248, 250, 252);
                doc.rect(20, yPos, 170, 12, 'F');
            }
            
            // Truncate description if too long
            let description = item.description;
            if (description.length > 35) {
                description = description.substring(0, 32) + '...';
            }
            
            doc.text(description, 25, yPos + 8);
            doc.text(item.quantity.toString(), 115, yPos + 8, { align: 'center' });
            
            if (item.isFree) {
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(40, 167, 69);
                doc.text(t.free, 140, yPos + 8, { align: 'right' });
                doc.text(t.free, 185, yPos + 8, { align: 'right' });
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(0, 0, 0);
            } else {
                doc.text(formatCurrency(item.price), 140, yPos + 8, { align: 'right' });
                doc.text(formatCurrency(item.total), 185, yPos + 8, { align: 'right' });
            }
            yPos += 12;
        });
        
        // Totals section
        yPos += 15;
        
        // Draw totals box
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.rect(120, yPos - 5, 70, 35);
        
        // Subtotal
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`${t.subtotalLabel}`, 125, yPos + 2);
        doc.text(formatCurrency(data.totals.subtotal), 185, yPos + 2, { align: 'right' });
        yPos += 8;
        
        // Tax
        doc.text(`${data.language === 'id' ? 'Pajak' : 'Tax'} (${data.totals.taxRate}%):`, 125, yPos + 2);
        doc.text(formatCurrency(data.totals.tax), 185, yPos + 2, { align: 'right' });
        yPos += 8;
        
        // Draw line before total
        doc.setDrawColor(0, 191, 255);
        doc.setLineWidth(1);
        doc.line(125, yPos, 185, yPos);
        yPos += 5;
        
        // Grand Total
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(0, 191, 255);
        doc.text(`${t.totalLabel}`, 125, yPos + 2);
        doc.text(formatCurrency(data.totals.grandTotal), 185, yPos + 2, { align: 'right' });
        
        // Reset font size
        doc.setFontSize(12);
        
        // Payment information
        if (data.paymentMethod) {
            yPos += 20;
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text(`${t.paymentInfoTitle}:`, 20, yPos);
            
            doc.setFont('helvetica', 'normal');
            const paymentLines = data.paymentMethod.split('\n');
            let paymentY = yPos + 8;
            paymentLines.forEach(line => {
                if (paymentY < 280) { // Check if we have space
                    doc.text(line, 20, paymentY);
                    paymentY += 6;
                }
            });
        }
        
        // Save PDF
        doc.save(`Invoice-${data.invoice.number}.pdf`);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Terjadi kesalahan saat mengexport PDF. Silakan coba lagi.');
    } finally {
        // Reset button
        exportBtn.innerHTML = originalText;
        exportBtn.disabled = false;
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + Enter to generate preview
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        generatePreview();
    }
    
    // Ctrl + S to export PDF
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        exportToPDF();
    }
    
    // Ctrl + N to add new item
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        addItem();
    }
});

// Auto-save to localStorage
function autoSave() {
    const data = getFormData();
    localStorage.setItem('invoiceData', JSON.stringify(data));
}

// Load from localStorage
function loadSavedData() {
    const savedData = localStorage.getItem('invoiceData');
    if (savedData) {
        const data = JSON.parse(savedData);
        // Populate form with saved data
        // Implementation can be added here if needed
    }
}

// Auto-save every 30 seconds
setInterval(autoSave, 30000);

// Save on form change
document.addEventListener('input', function() {
    clearTimeout(window.autoSaveTimeout);
    window.autoSaveTimeout = setTimeout(autoSave, 2000);
});