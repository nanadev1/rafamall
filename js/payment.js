// ============================================
// RafaMall - Payment Page JavaScript
// Payment methods, form validation, order processing
// ============================================

let cartItems = [];
let orderTotal = 0;
let shippingData = {};

// ============================================
// Load Cart and Shipping Data
// ============================================

function loadPaymentData() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('rafamall_cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
    }
    
    // Load shipping data from checkout
    const savedShipping = localStorage.getItem('rafamall_shipping');
    if (savedShipping) {
        shippingData = JSON.parse(savedShipping);
    }
    
    // Check if cart is empty
    if (cartItems.length === 0) {
        const emptyPayment = document.getElementById('emptyPayment');
        const paymentContent = document.getElementById('paymentContent');
        if (emptyPayment) emptyPayment.style.display = 'block';
        if (paymentContent) paymentContent.style.display = 'none';
        return;
    }
    
    displayOrderItems();
    updatePaymentTotals();
}

// ============================================
// Display Order Items
// ============================================

function displayOrderItems() {
    const container = document.getElementById('paymentOrderItems');
    if (!container) return;
    
    container.innerHTML = cartItems.map(item => `
        <div class="order-item">
            <div class="order-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="order-item-info">
                <h4>${escapeHtml(item.name)}</h4>
                <p>Qty: ${item.quantity}</p>
            </div>
            <div class="order-item-price">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');
}

// ============================================
// Update Payment Totals
// ============================================

function updatePaymentTotals() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = shippingData.shippingCost || 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    orderTotal = total;
    
    const subtotalEl = document.getElementById('paymentSubtotal');
    const shippingEl = document.getElementById('paymentShipping');
    const taxEl = document.getElementById('paymentTax');
    const totalEl = document.getElementById('paymentTotal');
    const payButton = document.getElementById('payButtonText');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    if (payButton) payButton.textContent = `Pay $${total.toFixed(2)}`;
}

// ============================================
// Payment Method Tabs
// ============================================

function setupPaymentTabs() {
    const tabs = document.querySelectorAll('.payment-tab');
    const forms = {
        card: document.getElementById('cardForm'),
        paypal: document.getElementById('paypalForm'),
        bank: document.getElementById('bankForm')
    };
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const method = tab.dataset.method;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            Object.values(forms).forEach(form => {
                if (form) form.classList.remove('active');
            });
            
            if (forms[method]) forms[method].classList.add('active');
        });
    });
}

// ============================================
// Card Input Formatting
// ============================================

function setupCardFormatting() {
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');
    
    if (cardNumber) {
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            if (value.length > 16) value = value.slice(0, 16);
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = value;
        });
    }
    
    if (expiryDate) {
        expiryDate.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\//g, '');
            if (value.length > 4) value = value.slice(0, 4);
            if (value.length >= 3) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
            e.target.value = value;
        });
    }
    
    if (cvv) {
        cvv.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 4) value = value.slice(0, 4);
            e.target.value = value;
        });
    }
}

// ============================================
// Billing Address Toggle
// ============================================

function setupBillingAddress() {
    const sameAsShipping = document.getElementById('sameAsShipping');
    const billingAddress = document.getElementById('billingAddress');
    
    if (sameAsShipping) {
        sameAsShipping.addEventListener('change', (e) => {
            billingAddress.style.display = e.target.checked ? 'none' : 'block';
        });
    }
}

// ============================================
// Validate Card Details
// ============================================

function validateCardDetails() {
    const cardNumber = document.getElementById('cardNumber')?.value.replace(/\s/g, '');
    const expiry = document.getElementById('expiryDate')?.value;
    const cvv = document.getElementById('cvv')?.value;
    const cardName = document.getElementById('cardName')?.value.trim();
    const email = document.getElementById('paymentEmail')?.value.trim();
    
    if (!cardNumber || cardNumber.length < 16) {
        showNotification('Please enter a valid card number', 'error');
        return false;
    }
    
    if (!expiry || expiry.length < 5) {
        showNotification('Please enter a valid expiry date', 'error');
        return false;
    }
    
    const expiryParts = expiry.split('/');
    if (expiryParts.length === 2) {
        const month = parseInt(expiryParts[0]);
        const year = parseInt(expiryParts[1]);
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        
        if (month < 1 || month > 12) {
            showNotification('Please enter a valid month (01-12)', 'error');
            return false;
        }
        
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            showNotification('Card has expired', 'error');
            return false;
        }
    }
    
    if (!cvv || cvv.length < 3) {
        showNotification('Please enter a valid CVV', 'error');
        return false;
    }
    
    if (!cardName) {
        showNotification('Please enter the name on card', 'error');
        return false;
    }
    
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    return true;
}

// ============================================
// Process Payment
// ============================================

function processPayment() {
    const activeTab = document.querySelector('.payment-tab.active');
    const method = activeTab ? activeTab.dataset.method : 'card';
    
    // Validate based on payment method
    if (method === 'card') {
        if (!validateCardDetails()) return;
    }
    
    // Show processing overlay
    const overlay = document.getElementById('processingOverlay');
    if (overlay) overlay.style.display = 'flex';
    
    // Simulate payment processing (2 seconds delay)
    setTimeout(() => {
        // Hide overlay
        if (overlay) overlay.style.display = 'none';
        
        // Create order
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = shippingData.shippingCost || 5.99;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;
        
        const order = {
            orderNumber: 'RM' + Date.now().toString().slice(-8),
            date: new Date().toLocaleString(),
            items: [...cartItems],
            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            total: total,
            paymentMethod: method,
            shippingAddress: shippingData,
            status: 'confirmed'
        };
        
        // Save order
        const orders = JSON.parse(localStorage.getItem('rafamall_orders')) || [];
        orders.push(order);
        localStorage.setItem('rafamall_orders', JSON.stringify(orders));
        
        // Save as last order for confirmation page
        localStorage.setItem('rafamall_last_order', JSON.stringify(order));
        
        // Clear cart
        localStorage.removeItem('rafamall_cart');
        localStorage.removeItem('rafamall_shipping');
        
        // Update cart count in header
        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }
        
        // Redirect to confirmation page
        window.location.href = 'confirmation.html';
        
    }, 2000);
}

// ============================================
// Show Notification
// ============================================

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ============================================
// Escape HTML
// ============================================

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ============================================
// Initialize Payment Page
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Payment page JS loaded');
    
    // Load data
    loadPaymentData();
    
    // Setup payment methods
    setupPaymentTabs();
    setupCardFormatting();
    setupBillingAddress();
    
    // Setup pay button
    const payBtn = document.getElementById('payNowBtn');
    if (payBtn) {
        payBtn.addEventListener('click', processPayment);
    }
    
    // Update cart count
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
    
    // Check if cart is empty and show/hide content
    const paymentContent = document.getElementById('paymentContent');
    const emptyPayment = document.getElementById('emptyPayment');
    
    if (cartItems.length === 0) {
        if (emptyPayment) emptyPayment.style.display = 'block';
        if (paymentContent) paymentContent.style.display = 'none';
    } else {
        if (emptyPayment) emptyPayment.style.display = 'none';
        if (paymentContent) paymentContent.style.display = 'block';
    }
});