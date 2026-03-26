// ============================================
// RafaMall - Cart Page JavaScript (UPDATED)
// Cart display, quantity updates, promo codes, checkout
// ============================================

// ============================================
// Cart State Variables
// ============================================

let cartItems = [];
let appliedPromo = null;
let shippingCost = 5.99;
let selectedShipping = 'standard';

// Promo codes data
const promoCodes = {
    'WELCOME10': { discount: 10, type: 'percentage', message: '10% off applied!' },
    'HERBAL20': { discount: 20, type: 'percentage', message: '20% off applied!' },
    'FREESHIP': { discount: 0, type: 'free_shipping', message: 'Free shipping applied!' },
    'SAVE15': { discount: 15, type: 'percentage', message: '15% off applied!' }
};

// ============================================
// Load Cart from localStorage
// ============================================

function loadCart() {
    const savedCart = localStorage.getItem('rafamall_cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        console.log('Cart loaded:', cartItems.length, 'items');
    } else {
        cartItems = [];
        console.log('No cart found');
    }
    return cartItems;
}

// ============================================
// Save Cart to localStorage
// ============================================

function saveCart() {
    localStorage.setItem('rafamall_cart', JSON.stringify(cartItems));
    console.log('Cart saved:', cartItems.length, 'items');
    
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
}

// ============================================
// Display Cart Items
// ============================================

function displayCartItems() {
    const cartContainer = document.getElementById('cartItems');
    const cartContent = document.getElementById('cartContent');
    const emptyCart = document.getElementById('emptyCart');
    
    if (!cartContainer) return;
    
    // Load fresh cart data
    loadCart();
    
    console.log('Displaying cart, items:', cartItems.length);
    
    if (cartItems.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartContent) cartContent.style.display = 'block';
    
    cartContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-product">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='https://placehold.co/400x400/000000/FFFFFF?text=Product'">
                </div>
                <div class="cart-item-info">
                    <h4>${escapeHtml(item.name)}</h4>
                    <span class="cart-item-category">Herbal Product</span>
                </div>
            </div>
            <div class="cart-item-price">
                $${item.price.toFixed(2)}
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn-cart minus" data-id="${item.id}">-</button>
                <input type="number" value="${item.quantity}" min="1" max="99" class="quantity-input-cart" data-id="${item.id}">
                <button class="quantity-btn-cart plus" data-id="${item.id}">+</button>
            </div>
            <div class="cart-item-total">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
            <button class="remove-item" data-id="${item.id}" aria-label="Remove item">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    updateCartTotals();
    attachCartEvents();
}

// ============================================
// Update Cart Totals
// ============================================

function updateCartTotals() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let shipping = shippingCost;
    let discountAmount = 0;
    
    if (appliedPromo) {
        if (appliedPromo.type === 'percentage') {
            discountAmount = subtotal * (appliedPromo.discount / 100);
        } else if (appliedPromo.type === 'free_shipping') {
            shipping = 0;
        }
    }
    
    const tax = (subtotal - discountAmount) * 0.08;
    const total = subtotal - discountAmount + shipping + tax;
    
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const cartTotalEl = document.getElementById('cartTotal');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;
    
    updateDiscountRow(discountAmount, appliedPromo);
}

function updateDiscountRow(discountAmount, promo) {
    let discountRow = document.querySelector('.summary-row.discount');
    
    if (discountAmount > 0 && promo) {
        if (!discountRow) {
            const taxRow = document.querySelector('.summary-row:has(#tax)');
            if (taxRow) {
                discountRow = document.createElement('div');
                discountRow.className = 'summary-row discount';
                discountRow.innerHTML = `
                    <span>Discount (${promo.discount}%)</span>
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
// Attach Cart Events
// ============================================

function attachCartEvents() {
    document.querySelectorAll('.quantity-btn-cart.minus').forEach(btn => {
        btn.removeEventListener('click', minusHandler);
        btn.addEventListener('click', minusHandler);
    });
    
    document.querySelectorAll('.quantity-btn-cart.plus').forEach(btn => {
        btn.removeEventListener('click', plusHandler);
        btn.addEventListener('click', plusHandler);
    });
    
    document.querySelectorAll('.quantity-input-cart').forEach(input => {
        input.removeEventListener('change', quantityChangeHandler);
        input.addEventListener('change', quantityChangeHandler);
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.removeEventListener('click', removeHandler);
        btn.addEventListener('click', removeHandler);
    });
}

function minusHandler(e) {
    const id = parseInt(this.dataset.id);
    const item = cartItems.find(i => i.id === id);
    if (item && item.quantity > 1) {
        updateQuantity(id, item.quantity - 1);
    } else if (item && item.quantity === 1) {
        removeFromCart(id);
    }
}

function plusHandler(e) {
    const id = parseInt(this.dataset.id);
    const item = cartItems.find(i => i.id === id);
    if (item && item.quantity < 99) {
        updateQuantity(id, item.quantity + 1);
    }
}

function quantityChangeHandler(e) {
    const id = parseInt(this.dataset.id);
    let newQty = parseInt(this.value);
    if (isNaN(newQty) || newQty < 1) newQty = 1;
    if (newQty > 99) newQty = 99;
    updateQuantity(id, newQty);
}

function removeHandler(e) {
    const id = parseInt(this.dataset.id);
    removeFromCart(id);
}

function updateQuantity(productId, newQuantity) {
    const item = cartItems.find(i => i.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        displayCartItems();
        showNotification(`Quantity updated to ${newQuantity}`, 'success');
    }
}

function removeFromCart(productId) {
    const item = cartItems.find(i => i.id === productId);
    const itemName = item ? item.name : '';
    
    cartItems = cartItems.filter(item => item.id !== productId);
    saveCart();
    displayCartItems();
    showNotification(`${itemName} removed from cart`, 'info');
}

// ============================================
// Apply Promo Code
// ============================================

function applyPromoCode(code) {
    const promo = promoCodes[code.toUpperCase()];
    const promoMessage = document.getElementById('promoMessage');
    
    if (!promo) {
        if (promoMessage) {
            promoMessage.textContent = 'Invalid promo code';
            promoMessage.className = 'promo-message error';
            setTimeout(() => {
                promoMessage.textContent = '';
            }, 3000);
        }
        return false;
    }
    
    appliedPromo = promo;
    
    if (promoMessage) {
        promoMessage.textContent = promo.message;
        promoMessage.className = 'promo-message success';
        setTimeout(() => {
            promoMessage.textContent = '';
        }, 3000);
    }
    
    updateCartTotals();
    return true;
}

function setupPromoCode() {
    const applyBtn = document.getElementById('applyPromo');
    const promoInput = document.getElementById('promoCode');
    
    if (!applyBtn) return;
    
    applyBtn.addEventListener('click', () => {
        const code = promoInput.value.trim();
        if (code) {
            applyPromoCode(code);
            promoInput.value = '';
        }
    });
}

// ============================================
// PROCEED TO PAYMENT - Save Cart Data
// ============================================

function proceedToPayment() {
    console.log('Proceeding to payment...');
    console.log('Cart items:', cartItems);
    
    if (cartItems.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    // Save cart to localStorage
    localStorage.setItem('rafamall_cart', JSON.stringify(cartItems));
    console.log('Cart saved to localStorage');
    
    // Save promo code if applied
    if (appliedPromo) {
        localStorage.setItem('rafamall_promo', JSON.stringify(appliedPromo));
        console.log('Promo saved:', appliedPromo);
    }
    
    // Create shipping data
    const shippingData = {
        shippingCost: shippingCost,
        shippingMethod: selectedShipping
    };
    localStorage.setItem('rafamall_shipping', JSON.stringify(shippingData));
    console.log('Shipping data saved:', shippingData);
    
    // Redirect to payment page
    window.location.href = 'payment.html';
}

// ============================================
// Setup Checkout Button
// ============================================

function setupCheckoutButton() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            proceedToPayment();
        });
        console.log('Checkout button setup complete');
    } else {
        console.log('Checkout button not found');
    }
}

// ============================================
// Display Recommended Products
// ============================================

function displayRecommendedProducts() {
    const grid = document.getElementById('recommendedProductsGrid');
    if (!grid) return;
    
    const cartIds = cartItems.map(item => item.id);
    let allProducts = [];
    
    if (typeof products !== 'undefined') {
        allProducts = products;
    } else if (typeof window.products !== 'undefined') {
        allProducts = window.products;
    }
    
    const recommended = allProducts
        .filter(p => !cartIds.includes(p.id))
        .slice(0, 4);
    
    if (recommended.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px;"><p style="color: var(--text-secondary);">All products are in your cart!</p></div>`;
        return;
    }
    
    grid.innerHTML = recommended.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="product-actions">
                    <button class="product-action-btn add-to-cart" data-id="${product.id}" 
                            data-name="${product.name}" data-price="${product.price}" 
                            data-image="${product.image}">
                        <i class="fas fa-shopping-bag"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category.replace(/-/g, ' ')}</div>
                <a href="product.html?id=${product.id}" class="product-title">${product.name}</a>
                <div class="product-price">
                    <span class="current-price">$${product.price}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    attachRecommendedCartEvents();
}

function attachRecommendedCartEvents() {
    document.querySelectorAll('#recommendedProductsGrid .add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(btn.dataset.id);
            const name = btn.dataset.name;
            const price = parseFloat(btn.dataset.price);
            const image = btn.dataset.image;
            
            const existingItem = cartItems.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({ id, name, price, image, quantity: 1 });
            }
            saveCart();
            displayCartItems();
            displayRecommendedProducts();
            showNotification(`${name} added to cart!`, 'success');
        });
    });
}

// ============================================
// Utility Functions
// ============================================

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// ============================================
// Initialize Cart Page
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Cart page JS loaded');
    
    loadCart();
    displayCartItems();
    displayRecommendedProducts();
    setupPromoCode();
    setupCheckoutButton();
    
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
    
    console.log('Cart initialized with', cartItems.length, 'items');
});