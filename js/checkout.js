// ============================================
// RafaMall - Checkout Page JavaScript
// Shipping form, payment methods, order summary, confirmation
// ============================================

// ============================================
// Checkout State Variables
// ============================================

let cartItems = [];
let shippingCost = 5.99;
let selectedShipping = 'standard';
let appliedPromo = null;
let currentStep = 1;

// ============================================
// Load Cart Data
// ============================================

function loadCheckoutCart() {
    const savedCart = localStorage.getItem('rafamall_cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        console.log('Cart loaded:', cartItems.length, 'items');
    } else {
        cartItems = [];
        console.log('No cart found');
    }
    
    // Load applied promo
    const savedPromo = localStorage.getItem('rafamall_promo');
    if (savedPromo) {
        appliedPromo = JSON.parse(savedPromo);
        console.log('Promo loaded:', appliedPromo);
    }
    
    return cartItems;
}

// ============================================
// Display Order Summary
// ============================================

function displayOrderSummary() {
    const orderItemsContainer = document.getElementById('orderItems');
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const shippingEl = document.getElementById('checkoutShipping');
    const taxEl = document.getElementById('checkoutTax');
    const totalEl = document.getElementById('checkoutTotal');
    
    if (!orderItemsContainer) return;
    
    if (cartItems.length === 0) {
        // Show empty cart message
        const emptyCheckout = document.getElementById('emptyCheckout');
        const checkoutContent = document.getElementById('checkoutContent');
        if (emptyCheckout) emptyCheckout.style.display = 'block';
        if (checkoutContent) checkoutContent.style.display = 'none';
        return;
    }
    
    // Display order items
    orderItemsContainer.innerHTML = cartItems.map(item => `
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
    
    // Calculate totals
    updateCheckoutTotals();
}

// ============================================
// Update Checkout Totals
// ============================================

function updateCheckoutTotals() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let shipping = shippingCost;
    let discountAmount = 0;
    
    // Apply promo discount
    if (appliedPromo) {
        if (appliedPromo.type === 'percentage') {
            discountAmount = subtotal * (appliedPromo.discount / 100);
        } else if (appliedPromo.type === 'free_shipping') {
            shipping = 0;
        }
    }
    
    const tax = (subtotal - discountAmount) * 0.08;
    const total = subtotal - discountAmount + shipping + tax;
    
    // Update DOM
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const shippingEl = document.getElementById('checkoutShipping');
    const taxEl = document.getElementById('checkoutTax');
    const totalEl = document.getElementById('checkoutTotal');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    
    // Update discount row if needed
    updateDiscountRow(discountAmount);
}

function updateDiscountRow(discountAmount) {
    let discountRow = document.querySelector('.order-totals .discount');
    
    if (discountAmount > 0 && appliedPromo) {
        if (!discountRow) {
            const taxRow = document.querySelector('.order-totals .summary-row:has(#checkoutTax)');
            if (taxRow) {
                discountRow = document.createElement('div');
                discountRow.className = 'summary-row discount';
                discountRow.innerHTML = `
                    <span>Discount (${appliedPromo.discount}%)</span>
                    <span>-$${discountAmount.toFixed(2)}</span>
                `;
                taxRow.parentNode.insertBefore(discountRow, taxRow);
            }
        } else {
            discountRow.querySelector('span:last-child').textContent = `-$${discountAmount.toFixed(2)}`;
            discountRow.style.display = 'flex';
        }
    } else if (discountRow) {
        discountRow.style.display = 'none';
    }
}

// ============================================
// Setup Shipping Methods
// ============================================

function setupShippingMethods() {
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    
    shippingOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            const value = e.target.value;
            switch(value) {
                case 'standard':
                    shippingCost = 5.99;
                    selectedShipping = 'standard';
                    break;
                case 'express':
                    shippingCost = 12.99;
                    selectedShipping = 'express';
                    break;
                case 'free':
                    shippingCost = 0;
                    selectedShipping = 'free';
                    break;
            }
            updateCheckoutTotals();
        });
    });
}

// ============================================
// Setup Payment Methods
// ============================================

function setupPaymentMethods() {
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const cardDetails = document.getElementById('cardDetails');
    
    if (!paymentRadios.length) return;
    
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'card') {
                if (cardDetails) cardDetails.style.display = 'block';
            } else {
                if (cardDetails) cardDetails.style.display = 'none';
            }
        });
    });
}

// ============================================
// Format Card Inputs
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
// Validate Shipping Form
// ============================================

function validateShippingForm() {
    const fullName = document.getElementById('fullName')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const address = document.getElementById('address')?.value.trim();
    const city = document.getElementById('city')?.value.trim();
    const state = document.getElementById('state')?.value.trim();
    const zip = document.getElementById('zip')?.value.trim();
    const country = document.getElementById('country')?.value;
    
    if (!fullName) {
        showNotification('Please enter your full name', 'error');
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
    
    if (!phone) {
        showNotification('Please enter your phone number', 'error');
        return false;
    }
    
    if (!address) {
        showNotification('Please enter your street address', 'error');
        return false;
    }
    
    if (!city) {
        showNotification('Please enter your city', 'error');
        return false;
    }
    
    if (!state) {
        showNotification('Please enter your state/province', 'error');
        return false;
    }
    
    if (!zip) {
        showNotification('Please enter your postal code', 'error');
        return false;
    }
    
    if (!country) {
        showNotification('Please select your country', 'error');
        return false;
    }
    
    return true;
}

// ============================================
// Validate Payment Form
// ============================================

function validatePaymentForm() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    
    if (!paymentMethod) {
        showNotification('Please select a payment method', 'error');
        return false;
    }
    
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber')?.value.replace(/\s/g, '');
        const expiry = document.getElementById('expiryDate')?.value;
        const cvv = document.getElementById('cvv')?.value;
        const cardName = document.getElementById('cardName')?.value.trim();
        
        if (!cardNumber || cardNumber.length < 16) {
            showNotification('Please enter a valid card number', 'error');
            return false;
        }
        
        if (!expiry || expiry.length < 5) {
            showNotification('Please enter a valid expiry date (MM/YY)', 'error');
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
    }
    
    return true;
}

// ============================================
// Process Order
// ============================================

function processOrder() {
    // Get shipping info
    const orderData = {
        orderNumber: 'RM' + Date.now().toString().slice(-8),
        date: new Date().toLocaleString(),
        orderDate: new Date().toISOString(),
        fullName: document.getElementById('fullName')?.value.trim(),
        email: document.getElementById('email')?.value.trim(),
        phone: document.getElementById('phone')?.value.trim(),
        address: document.getElementById('address')?.value.trim(),
        address2: document.getElementById('address2')?.value.trim(),
        city: document.getElementById('city')?.value.trim(),
        state: document.getElementById('state')?.value.trim(),
        zip: document.getElementById('zip')?.value.trim(),
        country: document.getElementById('country')?.value,
        notes: document.getElementById('notes')?.value.trim(),
        shippingMethod: selectedShipping,
        shippingCost: shippingCost,
        paymentMethod: document.querySelector('input[name="payment"]:checked')?.value,
        items: [...cartItems],
        subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        tax: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.08,
        total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + shippingCost + (cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.08),
        status: 'confirmed'
    };
    
    // Apply discount if promo applied
    if (appliedPromo && appliedPromo.type === 'percentage') {
        const discountAmount = orderData.subtotal * (appliedPromo.discount / 100);
        orderData.discount = discountAmount;
        orderData.discountCode = Object.keys(promoCodes || {}).find(key => promoCodes[key] === appliedPromo);
        orderData.total = orderData.subtotal - discountAmount + orderData.shippingCost + orderData.tax;
    } else if (appliedPromo && appliedPromo.type === 'free_shipping') {
        orderData.shippingCost = 0;
        orderData.total = orderData.subtotal + orderData.tax;
    }
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('rafamall_orders')) || [];
    orders.push(orderData);
    localStorage.setItem('rafamall_orders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem('rafamall_cart');
    localStorage.removeItem('rafamall_promo');
    
    // Update cart count in header
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
    
    // Show confirmation
    showOrderConfirmation(orderData);
}

// ============================================
// Show Order Confirmation
// ============================================

function showOrderConfirmation(order) {
    const shippingForm = document.getElementById('shippingForm');
    const paymentForm = document.getElementById('paymentForm');
    const confirmation = document.getElementById('confirmation');
    const steps = document.querySelectorAll('.step');
    const orderDetails = document.getElementById('orderDetails');
    
    if (shippingForm) shippingForm.style.display = 'none';
    if (paymentForm) paymentForm.style.display = 'none';
    if (confirmation) confirmation.style.display = 'block';
    
    // Update step indicators
    if (steps) {
        steps.forEach(step => step.classList.remove('active', 'completed'));
        if (steps[0]) steps[0].classList.add('completed');
        if (steps[1]) steps[1].classList.add('completed');
        if (steps[2]) steps[2].classList.add('active');
    }
    
    // Display order details
    if (orderDetails) {
        orderDetails.innerHTML = `
            <h4>Order #${order.orderNumber}</h4>
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Items:</strong> ${order.items.length} products</p>
            <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
            ${order.discount ? `<p><strong>Discount:</strong> -$${order.discount.toFixed(2)}</p>` : ''}
            <p><strong>Shipping:</strong> ${order.shippingCost === 0 ? 'Free' : `$${order.shippingCost.toFixed(2)}`}</p>
            <p><strong>Tax:</strong> $${order.tax.toFixed(2)}</p>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
            <p><strong>Shipping to:</strong> ${order.fullName}, ${order.address}, ${order.city}, ${order.state} ${order.zip}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod === 'card' ? 'Credit/Debit Card' : order.paymentMethod === 'paypal' ? 'PayPal' : 'Bank Transfer'}</p>
        `;
    }
    
    showNotification(`Order placed successfully! #${order.orderNumber}`, 'success');
    
    // Scroll to confirmation
    confirmation?.scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// Setup Checkout Navigation
// ============================================

function setupCheckoutNavigation() {
    const continueBtn = document.getElementById('continueToPayment');
    const backBtn = document.getElementById('backToShipping');
    const placeOrderBtn = document.getElementById('placeOrder');
    const shippingForm = document.getElementById('shippingForm');
    const paymentForm = document.getElementById('paymentForm');
    const steps = document.querySelectorAll('.step');
    
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            if (validateShippingForm()) {
                if (shippingForm) shippingForm.style.display = 'none';
                if (paymentForm) paymentForm.style.display = 'block';
                
                if (steps) {
                    if (steps[0]) steps[0].classList.remove('active');
                    if (steps[0]) steps[0].classList.add('completed');
                    if (steps[1]) steps[1].classList.add('active');
                }
            }
        });
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (shippingForm) shippingForm.style.display = 'block';
            if (paymentForm) paymentForm.style.display = 'none';
            
            if (steps) {
                if (steps[0]) steps[0].classList.add('active');
                if (steps[0]) steps[0].classList.remove('completed');
                if (steps[1]) steps[1].classList.remove('active');
            }
        });
    }
    
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', () => {
            if (validatePaymentForm()) {
                processOrder();
            }
        });
    }
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
// Show Notification
// ============================================

function showNotification(message, type = 'success') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// Initialize Checkout Page
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Checkout page JS loaded');
    
    // Load cart data
    loadCheckoutCart();
    
    // Display order summary
    displayOrderSummary();
    
    // Setup shipping methods
    setupShippingMethods();
    
    // Setup payment methods
    setupPaymentMethods();
    
    // Setup card input formatting
    setupCardFormatting();
    
    // Setup checkout navigation
    setupCheckoutNavigation();
    
    // Hide checkout content if cart is empty
    const checkoutContent = document.getElementById('checkoutContent');
    const emptyCheckout = document.getElementById('emptyCheckout');
    
    if (cartItems.length === 0) {
        if (emptyCheckout) emptyCheckout.style.display = 'block';
        if (checkoutContent) checkoutContent.style.display = 'none';
    } else {
        if (emptyCheckout) emptyCheckout.style.display = 'none';
        if (checkoutContent) checkoutContent.style.display = 'grid';
    }
    
    console.log('Checkout initialized with', cartItems.length, 'items');
});





// In checkout.js, after successful order
function processOrder() {
    // ... order processing code ...
    
    // Save order as last order
    localStorage.setItem('rafamall_last_order', JSON.stringify(orderData));
    
    // Redirect to confirmation page
    window.location.href = 'confirmation.html';
}