// faisalsugangga/personal-website/personal-website-6363c200c36524702db5ece80c792a7dc5ac90d0/public/invoice-generator/script.js
// Language translations
const translations = {
    en: {
        appTitle: 'Invoice Generator',
        appSubtitle: 'Create professional invoices easily',
        languageLabel: 'Language:',
        currencyLabel: 'Currency:',
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
        free: 'FREE',
        uploadBtnText: 'Choose File',
        noFileChosen: 'No file chosen',
        donationTitle: 'Like This App?',
        donationText: 'If this app is helpful, you can support further development with a donation. Thank you!',
        saweriaBtnText: 'Donate via Saweria',
        paypalBtnText: 'Donate via PayPal'
    },
    id: {
        appTitle: 'Generator Invoice',
        appSubtitle: 'Buat invoice profesional dengan mudah',
        languageLabel: 'Bahasa:',
        currencyLabel: 'Mata Uang:',
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
        free: 'GRATIS',
        uploadBtnText: 'Pilih Gambar',
        noFileChosen: 'Tidak ada file dipilih',
        donationTitle: 'Suka dengan Aplikasi Ini?',
        donationText: 'Jika aplikasi ini membantu, Anda bisa mendukung pengembangan lebih lanjut melalui donasi. Terima kasih!',
        saweriaBtnText: 'Donasi via Saweria',
        paypalBtnText: 'Donasi via PayPal'
    }
};

// Currency symbols
const currencySymbols = { USD: '$', IDR: 'Rp ', EUR: '€', GBP: '£', JPY: '¥' };

// Global variables
let itemCount = 1;
let currentLanguage = 'id';
let currentCurrency = 'IDR';
let companyLogo = null;

// Initialize the application
function initializeInvoiceGenerator() {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    document.getElementById('invoiceDate').value = today.toISOString().split('T')[0];
    document.getElementById('dueDate').value = nextMonth.toISOString().split('T')[0];
    document.getElementById('invoiceNumber').value = 'INV-' + Date.now().toString().slice(-6);
    addCalculationListeners();
    document.getElementById('language').addEventListener('change', changeLanguage);
    document.getElementById('currency').addEventListener('change', changeCurrency);
    document.getElementById('companyLogo').addEventListener('change', handleLogoUpload);
    document.getElementById('language').value = currentLanguage;
    document.getElementById('currency').value = currentCurrency;
    updateLanguage();
    updateCurrency();
    document.querySelectorAll('.item-row').forEach(row => calculateItemTotal(row));
    calculateTotals();
}

function addCalculationListeners() {
    const container = document.getElementById('itemsContainer');
    if (container) {
        container.addEventListener('input', (e) => {
            if (e.target.classList.contains('item-quantity') || e.target.classList.contains('item-price')) {
                calculateItemTotal(e.target.closest('.item-row'));
                calculateTotals();
            }
        });
    }
    const taxRateInput = document.getElementById('taxRate');
    if (taxRateInput) {
        taxRateInput.addEventListener('input', calculateTotals);
    }
}


function addItem() {
    const container = document.getElementById('itemsContainer');
    const newItem = document.createElement('div');
    newItem.className = 'item-row';
    const t = translations[currentLanguage];
    newItem.innerHTML = `
        <div class="form-group"><label>${t.descriptionLabel}</label><input type="text" class="item-description" placeholder="${t.descriptionPlaceholder}"></div>
        <div class="form-group"><label>${t.qtyLabel}</label><input type="number" class="item-quantity" placeholder="1" min="0" value="1"></div>
        <div class="form-group"><label>${t.priceLabel}</label><input type="number" class="item-price" placeholder="0" min="0" value="0"></div>
        <div class="form-group"><label>${t.totalLabel}</label><input type="text" class="item-total" readonly></div>
        <button type="button" class="btn-remove-item" onclick="removeItem(this)"><i class="fas fa-trash"></i></button>`;
    container.appendChild(newItem);
    calculateItemTotal(newItem);
    newItem.querySelector('.item-description').focus();
}

function removeItem(button) {
    const container = document.getElementById('itemsContainer');
    if (container.children.length > 1) {
        button.closest('.item-row').remove();
        calculateTotals();
    } else {
        alert('Minimal harus ada satu item!');
    }
}

function calculateItemTotal(itemRow) {
    const quantity = parseFloat(itemRow.querySelector('.item-quantity').value) || 0;
    const price = parseFloat(itemRow.querySelector('.item-price').value) || 0;
    const total = quantity * price;
    const totalElement = itemRow.querySelector('.item-total');
    totalElement.dataset.numericTotal = total;
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

function calculateTotals() {
    let subtotal = 0;
    document.querySelectorAll('.item-row').forEach(row => {
        subtotal += parseFloat(row.querySelector('.item-total')?.dataset.numericTotal) || 0;
    });
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const tax = subtotal * (taxRate / 100);
    const grandTotal = subtotal + tax;
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('tax').textContent = formatCurrency(tax);
    document.getElementById('grandTotal').textContent = formatCurrency(grandTotal);
}

function formatCurrency(amount) {
    const symbol = currencySymbols[currentCurrency];
    const formatted = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
    return (currentCurrency === 'IDR') ? symbol + formatted.replace(/\.00$/, '') : symbol + formatted;
}

function changeLanguage() {
    currentLanguage = document.getElementById('language').value;
    updateLanguage();
    calculateTotals();
}

// === FUNGSI DIPERBARUI DI SINI ===
function updateLanguage() {
    const t = translations[currentLanguage];
    const safeUpdate = (id, prop, val) => { const el = document.getElementById(id); if (el) el[prop] = val; };

    // Header
    safeUpdate('app-title', 'innerHTML', `<i class="fas fa-file-invoice"></i> ${t.appTitle}`);
    safeUpdate('app-subtitle', 'textContent', t.appSubtitle);
    safeUpdate('languageLabel', 'textContent', t.languageLabel);
    safeUpdate('currencyLabel', 'textContent', t.currencyLabel);

    // Card Titles
    safeUpdate('companyInfoTitle', 'innerHTML', `<i class="fas fa-building"></i> ${t.companyInfoTitle}`);
    safeUpdate('clientInfoTitle', 'innerHTML', `<i class="fas fa-user"></i> ${t.clientInfoTitle}`);
    safeUpdate('itemsTitle', 'innerHTML', `<i class="fas fa-list"></i> ${t.itemsTitle}`);
    safeUpdate('totalSectionTitle', 'innerHTML', `<i class="fas fa-calculator"></i> ${t.totalSectionTitle}`);
    safeUpdate('paymentInfoTitle', 'textContent', t.paymentInfoTitle);

    // Labels
    safeUpdate('companyLogoLabel', 'textContent', t.companyLogoLabel);
    safeUpdate('companyNameLabel', 'textContent', t.companyNameLabel);
    safeUpdate('companyAddressLabel', 'textContent', t.companyAddressLabel);
    safeUpdate('companyPhoneLabel', 'textContent', t.companyPhoneLabel);
    safeUpdate('companyEmailLabel', 'textContent', t.companyEmailLabel);
    safeUpdate('clientNameLabel', 'textContent', t.clientNameLabel);
    safeUpdate('clientAddressLabel', 'textContent', t.clientAddressLabel);
    safeUpdate('invoiceNumberLabel', 'textContent', t.invoiceNumberLabel);
    safeUpdate('invoiceDateLabel', 'textContent', t.invoiceDateLabel);
    safeUpdate('dueDateLabel', 'textContent', t.dueDateLabel);
    safeUpdate('subtotalLabel', 'textContent', t.subtotalLabel);
    safeUpdate('taxRateLabel', 'textContent', t.taxRateLabel);
    safeUpdate('totalFinalLabel', 'textContent', t.totalFinalLabel);
    safeUpdate('paymentMethodLabel', 'textContent', t.paymentMethodLabel);

    // Placeholders
    safeUpdate('companyName', 'placeholder', t.companyNamePlaceholder);
    safeUpdate('companyAddress', 'placeholder', t.companyAddressPlaceholder);
    safeUpdate('companyPhone', 'placeholder', t.companyPhonePlaceholder);
    safeUpdate('companyEmail', 'placeholder', t.companyEmailPlaceholder);
    safeUpdate('clientName', 'placeholder', t.clientNamePlaceholder);
    safeUpdate('clientAddress', 'placeholder', t.clientAddressPlaceholder);
    safeUpdate('invoiceNumber', 'placeholder', t.invoiceNumberPlaceholder);
    safeUpdate('paymentMethod', 'placeholder', t.paymentMethodPlaceholder);

    // Buttons and other text
    safeUpdate('uploadBtnText', 'textContent', t.uploadBtnText);
    safeUpdate('addItemBtn', 'innerHTML', `<i class="fas fa-plus"></i> ${t.addItemBtn}`);
    safeUpdate('previewBtn', 'innerHTML', `<i class="fas fa-eye"></i> ${t.previewBtn}`);
    safeUpdate('exportBtn', 'innerHTML', `<i class="fas fa-download"></i> ${t.exportBtn}`);
    
    // Donation Card
    safeUpdate('donationTitle', 'innerHTML', `<i class="fas fa-heart" style="color: #ff5e5e;"></i> ${t.donationTitle}`);
    safeUpdate('donationText', 'textContent', t.donationText);
    safeUpdate('saweriaBtnText', 'textContent', t.saweriaBtnText);
    safeUpdate('paypalBtnText', 'textContent', t.paypalBtnText);
    
    // Fallback text for file name
    const fileNameSpan = document.getElementById('fileName');
    if (fileNameSpan && (fileNameSpan.textContent === 'No file chosen' || fileNameSpan.textContent === 'Tidak ada file dipilih')) {
        fileNameSpan.textContent = t.noFileChosen;
    }
    
    // Item row labels & placeholders (for existing and new items)
    document.querySelectorAll('.item-row').forEach(row => {
        const descLabel = row.querySelector('label[id^="description-label"]');
        if (descLabel) descLabel.textContent = t.descriptionLabel;
        const qtyLabel = row.querySelector('label[id^="qty-label"]');
        if (qtyLabel) qtyLabel.textContent = t.qtyLabel;
        const priceLabel = row.querySelector('label[id^="price-label"]');
        if (priceLabel) priceLabel.textContent = t.priceLabel;
        const totalLabel = row.querySelector('label[id^="total-label"]');
        if (totalLabel) totalLabel.textContent = t.totalLabel;
        
        const descInput = row.querySelector('.item-description');
        if(descInput) descInput.placeholder = t.descriptionPlaceholder;
    });
}


function changeCurrency() {
    currentCurrency = document.getElementById('currency').value;
    updateCurrency();
}

function updateCurrency() {
    calculateTotals();
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    const fileNameSpan = document.getElementById('fileName');
    const preview = document.getElementById('logoPreview');

    if (file) {
        fileNameSpan.textContent = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
            companyLogo = e.target.result;
            if (preview) {
                preview.innerHTML = `<img src="${companyLogo}" alt="Company Logo">`;
                preview.classList.add('has-logo');
            }
        };
        reader.readAsDataURL(file);
    } else {
        fileNameSpan.textContent = translations[currentLanguage].noFileChosen;
        companyLogo = null;
        if (preview) {
            preview.innerHTML = '';
            preview.classList.remove('has-logo');
        }
    }
}


function generateInvoiceHTMLDocument(data) {
    const t = translations[data.language];

    let itemsHTML = '';
    data.items.forEach(item => {
        const totalDisplay = item.isFree ? `<span style="font-weight: bold; color: #28a745;">${t.free}</span>` : formatCurrency(item.total);
        const priceDisplay = item.isFree ? `<span style="font-weight: bold; color: #28a745;">${t.free}</span>` : formatCurrency(item.price);
        itemsHTML += `<tr><td>${item.description}</td><td style="text-align: center;">${item.quantity}</td><td style="text-align: right;">${priceDisplay}</td><td style="text-align: right;">${totalDisplay}</td></tr>`;
    });

    const logoHTML = data.logo ? `<img src="${data.logo}" alt="Company Logo" style="max-height: 80px; max-width: 200px; object-fit: contain; margin-bottom: 10px;">` : '';
    const companyNameHTML = `<h2>${data.company.name}</h2>`;

    const paymentHTML = data.paymentMethod ? `<div class="payment-info"><h3>${t.paymentInfoTitle}</h3><p>${data.paymentMethod.replace(/\n/g, '<br>')}</p></div>` : '';
    
    const previewStyles = `<style>body{font-family:'Poppins',sans-serif;margin:0;padding:0;background-color:#f8f9fa;color:#212529}.invoice-box{max-width:800px;margin:30px auto;padding:40px;border:1px solid #eee;background:white;box-shadow:0 0 10px rgba(0,0,0,.15)}.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:20px;border-bottom:3px solid #00BFFF}.company-details p,.invoice-details p{margin:0;line-height:1.6;color:#555}.company-details{text-align:left}.company-details h2{margin:0 0 5px 0;color:#333;font-size:1.5em;}.invoice-details{text-align:right}.invoice-details h1{margin:0;font-size:2.5em;color:#00BFFF}.billing-details{margin-bottom:40px}.billing-details p{margin:0;line-height:1.6}.invoice-table{width:100%;border-collapse:collapse}.invoice-table th,.invoice-table td{border-bottom:1px solid #eee;padding:12px 0}.invoice-table thead th{background-color:#00BFFF;color:white;padding:12px 15px;text-align:left;border:none}.invoice-table tbody td{padding:12px 15px}.invoice-table thead th:nth-child(2),.invoice-table tbody td:nth-child(2){text-align:center}.invoice-table thead th:nth-child(3),.invoice-table tbody td:nth-child(3),.invoice-table thead th:nth-child(4),.invoice-table tbody td:nth-child(4){text-align:right}.totals{margin-left:auto;width:40%;margin-top:30px}.totals table{width:100%}.totals td{padding:8px 0}.totals .total td{border-top:2px solid #00BFFF;padding-top:10px;font-weight:700;font-size:1.2em}.payment-info{margin-top:40px;padding:20px;background-color:#f8f9fa;border-radius:8px}.payment-info h3{margin-top:0;color:#333}.payment-info p{white-space:pre-wrap;margin:0}</style>`;

    return `<!DOCTYPE html><html lang="${data.language}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Invoice Preview - ${data.invoice.number}</title><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">${previewStyles}</head><body><div class="invoice-box"><div class="header"><div class="company-details">${logoHTML}${companyNameHTML}<p>${data.company.address.replace(/\n/g,'<br>')}</p>${data.company.phone?`<p>${data.company.phone}</p>`:''}${data.company.email?`<p>${data.company.email}</p>`:''}</div><div class="invoice-details"><h1>INVOICE</h1><p><strong>No:</strong> ${data.invoice.number}</p><p><strong>Date:</strong> ${new Date(data.invoice.date).toLocaleDateString()}</p><p><strong>Due Date:</strong> ${new Date(data.invoice.dueDate).toLocaleDateString()}</p></div></div><div class="billing-details"><h4>${t.billToTitle}:</h4><p><strong>${data.client.name}</strong></p><p>${data.client.address.replace(/\n/g,'<br>')}</p></div><table class="invoice-table"><thead><tr><th>${t.descriptionLabel}</th><th>${t.qtyLabel}</th><th>${t.priceLabel}</th><th>${t.totalLabel}</th></tr></thead><tbody>${itemsHTML}</tbody></table><div class="totals"><table><tr><td>${t.subtotalLabel}</td><td style="text-align:right">${formatCurrency(data.totals.subtotal)}</td></tr><tr><td>${t.taxRateLabel}</td><td style="text-align:right">${formatCurrency(data.totals.tax)}</td></tr><tr class="total"><td>${t.totalFinalLabel}</td><td style="text-align:right">${formatCurrency(data.totals.grandTotal)}</td></tr></table></div>${paymentHTML}</div></body></html>`;
}

function generatePreview() {
    const data = getFormData();
    if (!validateData(data)) return;
    const htmlContent = generateInvoiceHTMLDocument(data);
    const newTab = window.open();
    newTab.document.open();
    newTab.document.write(htmlContent);
    newTab.document.close();
}

function exportToPDF() {
    const data = getFormData();
    if (!validateData(data)) return;
    const htmlContent = generateInvoiceHTMLDocument(data);
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();
    iframe.onload = function() {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        setTimeout(() => { document.body.removeChild(iframe); }, 1000);
    };
}

function getFormData() {
    const items = [];
    document.querySelectorAll('.item-row').forEach(row => {
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
        company: { name: document.getElementById('companyName').value, address: document.getElementById('companyAddress').value, phone: document.getElementById('companyPhone').value, email: document.getElementById('companyEmail').value },
        client: { name: document.getElementById('clientName').value, address: document.getElementById('clientAddress').value },
        invoice: { number: document.getElementById('invoiceNumber').value, date: document.getElementById('invoiceDate').value, dueDate: document.getElementById('dueDate').value },
        items,
        totals: { subtotal, tax, taxRate, grandTotal },
        language: currentLanguage,
        currency: currentCurrency,
        logo: companyLogo,
        paymentMethod: document.getElementById('paymentMethod').value
    };
}

function validateData(data) {
    const required = [ { field: data.company.name, name: 'Nama Perusahaan' }, { field: data.client.name, name: 'Nama Klien' }, { field: data.invoice.number, name: 'Nomor Invoice' }, { field: data.invoice.date, name: 'Tanggal Invoice' } ];
    for (let item of required) { if (!item.field || item.field.trim() === '') { alert(`${item.name} harus diisi!`); return false; } }
    if (data.items.length === 0) { alert('Minimal harus ada satu item yang valid!'); return false; }
    return true;
}

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); generatePreview(); }
    if (e.ctrlKey && e.key === 's') { e.preventDefault(); exportToPDF(); }
    if (e.ctrlKey && e.key === 'n') { e.preventDefault(); addItem(); }
});

function autoSave() { localStorage.setItem('invoiceData', JSON.stringify(getFormData())); }
setInterval(autoSave, 30000);
document.addEventListener('input', () => { clearTimeout(window.autoSaveTimeout); window.autoSaveTimeout = setTimeout(autoSave, 2000); });

document.addEventListener('DOMContentLoaded', initializeInvoiceGenerator);
document.addEventListener('astro:page-load', initializeInvoiceGenerator);