// ============================================
// RafaMall - Order Confirmation Page JavaScript
// Display order details, tracking, recommendations
// ============================================

let currentOrder = null;

// ============================================
// Load Order from localStorage
// ============================================

function loadOrderConfirmation() {
    const savedOrder = localStorage.getItem('rafamall_last_order');
    
    if (!savedOrder) {
        // Try to get from checkout flow
        const orders = JSON.parse(localStorage.getItem('rafamall_orders')) || [];
        if (orders.length > 0) {
            currentOrder = orders[orders.length - 1];
            localStorage.setItem('rafamall_last_order', JSON.stringify(currentOrder));
        } else {
            showEmptyState();
            return;
        }
    } else {
        currentOrder = JSON.parse(savedOrder);
    }
    
    displayOrderConfirmation();
    updateOrderTracker();
    displayRecommendedProducts();
}

// ============================================
// Display Order Confirmation
// ============================================

function displayOrderConfirmation() {
    const container = document.getElementById('confirmationContent');
    if (!container) return;
    
    if (!currentOrder) {
        showEmptyState();
        return;
    }
    
    container.innerHTML = `
        <div class="order-summary-card">
            <h3>Order Summary</h3>
            <div class="order-info-grid">
                <div class="info-item">
                    <span class="info-label">Order Number</span>
                    <span class="info-value">#${currentOrder.orderNumber}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Order Date</span>
                    <span class="info-value">${currentOrder.date}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Payment Method</span>
                    <span class="info-value">${formatPaymentMethod(currentOrder.paymentMethod)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Order Status</span>
                    <span class="info-value">${currentOrder.status || 'Confirmed'}</span>
                </div>
            </div>
            
            <div class="order-items-list">
                <h4>Items Ordered</h4>
                ${currentOrder.items.map(item => `
                    <div class="order-item-row">
                        <div class="order-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="order-item-details">
                            <div class="order-item-name">${escapeHtml(item.name)}</div>
                            <div class="order-item-meta">Qty: ${item.quantity}</div>
                        </div>
                        <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-totals">
                <div class="total-row">
                    <span>Subtotal</span>
                    <span>$${currentOrder.subtotal.toFixed(2)}</span>
                </div>
                ${currentOrder.discount ? `
                    <div class="total-row discount">
                        <span>Discount (${currentOrder.discountCode || 'Promo'})</span>
                        <span>-$${currentOrder.discount.toFixed(2)}</span>
                    </div>
                ` : ''}
                <div class="total-row">
                    <span>Shipping</span>
                    <span>${currentOrder.shipping === 0 ? 'Free' : `$${currentOrder.shipping.toFixed(2)}`}</span>
                </div>
                <div class="total-row">
                    <span>Tax (8%)</span>
                    <span>$${currentOrder.tax.toFixed(2)}</span>
                </div>
                <div class="total-row grand-total">
                    <span>Total</span>
                    <span>$${currentOrder.total.toFixed(2)}</span>
                </div>
            </div>
        </div>
        
        <div class="shipping-info-card">
            <h3>Shipping Information</h3>
            <div class="info-item">
                <span class="info-label">Shipping Address</span>
                <span class="info-value">
                    ${currentOrder.fullName}<br>
                    ${currentOrder.address}<br>
                    ${currentOrder.city}, ${currentOrder.state} ${currentOrder.zip}<br>
                    ${currentOrder.country}
                </span>
            </div>
            ${currentOrder.notes ? `
                <div class="info-item">
                    <span class="info-label">Order Notes</span>
                    <span class="info-value">${escapeHtml(currentOrder.notes)}</span>
                </div>
            ` : ''}
        </div>
    `;
}

// ============================================
// Update Order Tracker
// ============================================

function updateOrderTracker() {
    const steps = document.querySelectorAll('.tracker-step');
    if (!steps.length) return;
    
    const orderStatus = currentOrder?.status || 'confirmed';
    let activeIndex = 0;
    
    switch(orderStatus.toLowerCase()) {
        case 'confirmed':
            activeIndex = 0;
            break;
        case 'processing':
            activeIndex = 1;
            break;
        case 'shipped':
            activeIndex = 2;
            break;
        case 'delivered':
            activeIndex = 3;
            break;
        default:
            activeIndex = 0;
    }
    
    steps.forEach((step, index) => {
        step.classList.remove('completed', 'active');
        if (index < activeIndex) {
            step.classList.add('completed');
        } else if (index === activeIndex) {
            step.classList.add('active');
        }
    });
}

// ============================================
// Display Recommended Products
// ============================================

function displayRecommendedProducts() {
    const container = document.getElementById('recommendedProducts');
    if (!container) return;
    
    // Get product categories from order to recommend similar items
    const orderedCategories = currentOrder?.items.map(item => {
        // Find product category from global products
        const product = window.products?.find(p => p.name === item.name);
        return product?.category;
    }).filter(c => c) || [];
    
    // Get unique categories
    const uniqueCategories = [...new Set(orderedCategories)];
    
    // Find recommended products (not in order)
    let recommended = [];
    if (window.products) {
        const orderedProductNames = currentOrder?.items.map(i => i.name) || [];
        
        if (uniqueCategories.length > 0) {
            recommended = window.products.filter(p => 
                uniqueCategories.includes(p.category) && 
                !orderedProductNames.includes(p.name)
            );
        }
        
        // If not enough, add top-rated products
        if (recommended.length < 4) {
            const additional = window.products
                .filter(p => !orderedProductNames.includes(p.name) && !recommended.includes(p))
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 4 - recommended.length);
            recommended = [...recommended, ...additional];
        }
        
        recommended = recommended.slice(0, 4);
    }
    
    if (recommended.length === 0) {
        container.innerHTML = '<p class="empty-state">Check back later for personalized recommendations</p>';
        return;
    }
    
    container.innerHTML = recommended.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category.replace(/-/g, ' ')}</div>
                <a href="product.html?id=${product.id}" class="product-title">${product.name}</a>
                <div class="product-price">$${product.price}</div>
            </div>
        </div>
    `).join('');
}

// ============================================
// Show Empty State
// ============================================

function showEmptyState() {
    const container = document.getElementById('confirmationContent');
    if (container) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag" style="font-size: 48px; margin-bottom: 20px; color: var(--text-tertiary);"></i>
                <h3>No Order Found</h3>
                <p>We couldn't find any recent orders. Start shopping to see your order confirmation.</p>
                <a href="shop.html" class="btn btn-primary" style="margin-top: 20px;">Start Shopping</a>
            </div>
        `;
    }
}

// ============================================
// Format Payment Method
// ============================================

function formatPaymentMethod(method) {
    switch(method) {
        case 'card': return 'Credit / Debit Card';
        case 'paypal': return 'PayPal';
        case 'bank': return 'Bank Transfer';
        default: return method || 'Credit Card';
    }
}

// ============================================
// Print Order Receipt
// ============================================

function printOrderReceipt() {
    const printContent = document.getElementById('confirmationContent');
    const originalTitle = document.title;
    
    document.title = `Order #${currentOrder?.orderNumber} - RafaMall Receipt`;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Order #${currentOrder?.orderNumber} - RafaMall</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                .receipt-header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #333;
                    padding-bottom: 20px;
                }
                .receipt-header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .order-info {
                    margin-bottom: 30px;
                }
                .order-info table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .order-info td {
                    padding: 8px;
                    vertical-align: top;
                }
                .items-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                .items-table th,
                .items-table td {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: left;
                }
                .items-table th {
                    background: #f5f5f5;
                }
                .totals {
                    text-align: right;
                    margin-top: 20px;
                }
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    font-size: 12px;
                    color: #666;
                }
                @media print {
                    body {
                        padding: 20px;
                    }
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="receipt-header">
                <h1>RafaMall</h1>
                <p>Herbal & Natural Products</p>
            </div>
            
            <div class="order-info">
                <h3>Order Confirmation</h3>
                <table>
                    <tr><td width="30%"><strong>Order Number:</strong></td><td>#${currentOrder?.orderNumber}</td></tr>
                    <tr><td><strong>Order Date:</strong></td><td>${currentOrder?.date}</td></tr>
                    <tr><td><strong>Payment Method:</strong></td><td>${formatPaymentMethod(currentOrder?.paymentMethod)}</td></tr>
                    <tr><td><strong>Order Status:</strong></td><td>${currentOrder?.status || 'Confirmed'}</td></tr>
                </table>
            </div>
            
            <h3>Items Ordered</h3>
            <table class="items-table">
                <thead>
                    <tr><th>Product</th><th>Quantity</th><th>Price</th><th>Total</th></tr>
                </thead>
                <tbody>
                    ${currentOrder?.items.map(item => `
                        <tr>
                            <td>${escapeHtml(item.name)}</td>
                            <td>${item.quantity}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>$${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="totals">
                <p><strong>Subtotal:</strong> $${currentOrder?.subtotal.toFixed(2)}</p>
                ${currentOrder?.discount ? `<p><strong>Discount:</strong> -$${currentOrder?.discount.toFixed(2)}</p>` : ''}
                <p><strong>Shipping:</strong> ${currentOrder?.shipping === 0 ? 'Free' : `$${currentOrder?.shipping.toFixed(2)}`}</p>
                <p><strong>Tax:</strong> $${currentOrder?.tax.toFixed(2)}</p>
                <h3><strong>Total:</strong> $${currentOrder?.total.toFixed(2)}</h3>
            </div>
            
            <div class="shipping-info">
                <h3>Shipping Information</h3>
                <p>
                    ${currentOrder?.fullName}<br>
                    ${currentOrder?.address}<br>
                    ${currentOrder?.city}, ${currentOrder?.state} ${currentOrder?.zip}<br>
                    ${currentOrder?.country}
                </p>
            </div>
            
            <div class="footer">
                <p>Thank you for shopping with RafaMall!</p>
                <p>For any questions, contact us at support@rafamall.com</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
    
    document.title = originalTitle;
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
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ============================================
// Initialize Confirmation Page
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Confirmation page JS loaded');
    
    // Load order data
    loadOrderConfirmation();
    
    // Setup print button
    const printBtn = document.getElementById('printOrderBtn');
    if (printBtn) {
        printBtn.addEventListener('click', printOrderReceipt);
    }
    
    // Update cart count
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
});