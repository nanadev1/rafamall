/* ============================================
   RafaMall - Order Tracking JavaScript
   Standalone JS for Order Tracking
   ============================================ */

// Order Tracking System
const OrderTracker = (function() {
    // Sample order data (for demo purposes)
    const sampleOrders = [
        {
            orderNumber: "RM12345678",
            email: "customer@example.com",
            status: "shipped",
            date: "March 20, 2026",
            estimatedDelivery: "March 25, 2026",
            trackingNumber: "1Z999AA10123456784",
            carrier: "USPS",
            shippingAddress: {
                fullName: "John Doe",
                address: "123 Main St",
                city: "New York",
                state: "NY",
                zip: "10001",
                country: "United States"
            },
            items: [
                { name: "Organic Chamomile Tea", quantity: 2, price: 12.99, image: "https://placehold.co/60x60/000000/FFFFFF?text=Tea" },
                { name: "Lavender Essential Oil", quantity: 1, price: 24.99, image: "https://placehold.co/60x60/000000/FFFFFF?text=Oil" }
            ],
            subtotal: 50.97,
            shipping: 5.99,
            tax: 4.08,
            total: 61.04,
            timeline: [
                { status: "Order Placed", date: "March 20, 2026", time: "10:30 AM", completed: true },
                { status: "Order Confirmed", date: "March 20, 2026", time: "11:15 AM", completed: true },
                { status: "Processing", date: "March 21, 2026", time: "09:00 AM", completed: true },
                { status: "Shipped", date: "March 22, 2026", time: "02:45 PM", completed: true },
                { status: "Out for Delivery", date: "March 25, 2026", time: "08:00 AM", completed: false },
                { status: "Delivered", date: "", time: "", completed: false }
            ]
        },
        {
            orderNumber: "RM87654321",
            email: "jane@example.com",
            status: "processing",
            date: "March 23, 2026",
            estimatedDelivery: "March 28, 2026",
            trackingNumber: null,
            carrier: null,
            shippingAddress: {
                fullName: "Jane Smith",
                address: "456 Oak Ave",
                city: "Los Angeles",
                state: "CA",
                zip: "90001",
                country: "United States"
            },
            items: [
                { name: "Moringa Powder", quantity: 1, price: 19.99, image: "https://placehold.co/60x60/000000/FFFFFF?text=Moringa" },
                { name: "Ashwagandha Capsules", quantity: 2, price: 28.99, image: "https://placehold.co/60x60/000000/FFFFFF?text=Ashwagandha" }
            ],
            subtotal: 77.97,
            shipping: 0,
            tax: 6.24,
            total: 84.21,
            timeline: [
                { status: "Order Placed", date: "March 23, 2026", time: "03:15 PM", completed: true },
                { status: "Order Confirmed", date: "March 23, 2026", time: "04:00 PM", completed: true },
                { status: "Processing", date: "March 24, 2026", time: "10:30 AM", completed: true },
                { status: "Shipped", date: "", time: "", completed: false },
                { status: "Out for Delivery", date: "", time: "", completed: false },
                { status: "Delivered", date: "", time: "", completed: false }
            ]
        }
    ];
    
    // Load orders from localStorage
    function loadOrders() {
        let orders = JSON.parse(localStorage.getItem('rafamall_tracking_orders'));
        if (!orders) {
            orders = sampleOrders;
            localStorage.setItem('rafamall_tracking_orders', JSON.stringify(orders));
        }
        return orders;
    }
    
    // Track order by number and email
    function trackOrder(orderNumber, email) {
        const orders = loadOrders();
        const order = orders.find(o => o.orderNumber === orderNumber && o.email === email);
        
        if (order) {
            return order;
        }
        return null;
    }
    
    // Get status display text and class
    function getStatusInfo(status) {
        const statusMap = {
            'pending': { text: 'Pending', class: 'pending' },
            'confirmed': { text: 'Confirmed', class: 'confirmed' },
            'processing': { text: 'Processing', class: 'processing' },
            'shipped': { text: 'Shipped', class: 'shipped' },
            'out-for-delivery': { text: 'Out for Delivery', class: 'out-for-delivery' },
            'delivered': { text: 'Delivered', class: 'delivered' },
            'cancelled': { text: 'Cancelled', class: 'cancelled' }
        };
        return statusMap[status] || { text: status, class: '' };
    }
    
    // Generate timeline HTML
    function generateTimeline(order) {
        let timelineHtml = '<div class="timeline-steps">';
        
        order.timeline.forEach((step, index) => {
            const isCompleted = step.completed;
            const isActive = !isCompleted && index === order.timeline.findIndex(s => !s.completed);
            
            timelineHtml += `
                <div class="timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
                    <div class="step-icon">
                        <i class="fas ${getStepIcon(step.status)}"></i>
                    </div>
                    <div class="step-label">${step.status}</div>
                    ${step.date ? `<span class="step-date">${step.date}</span>` : ''}
                </div>
            `;
        });
        
        timelineHtml += '</div>';
        return timelineHtml;
    }
    
    // Get icon for each step
    function getStepIcon(status) {
        const iconMap = {
            'Order Placed': 'fa-shopping-cart',
            'Order Confirmed': 'fa-check-circle',
            'Processing': 'fa-cogs',
            'Shipped': 'fa-truck',
            'Out for Delivery': 'fa-truck-moving',
            'Delivered': 'fa-home'
        };
        return iconMap[status] || 'fa-circle';
    }
    
    // Generate tracking result HTML
    function generateTrackingResult(order) {
        const statusInfo = getStatusInfo(order.status);
        
        return `
            <div class="order-header">
                <div class="order-number">Order #${order.orderNumber}</div>
                <div class="order-status-badge">${statusInfo.text.toUpperCase()}</div>
            </div>
            
            <div class="order-info">
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Order Date</span>
                        <span class="info-value">${order.date}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Estimated Delivery</span>
                        <span class="info-value">${order.estimatedDelivery}</span>
                    </div>
                    ${order.trackingNumber ? `
                        <div class="info-item">
                            <span class="info-label">Tracking Number</span>
                            <span class="info-value">${order.trackingNumber}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Carrier</span>
                            <span class="info-value">${order.carrier}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="tracking-timeline">
                <h4>Order Status Timeline</h4>
                ${generateTimeline(order)}
            </div>
            
            <div class="order-items">
                <h4>Items Ordered</h4>
                <div class="items-list">
                    ${order.items.map(item => `
                        <div class="item-row">
                            <div class="item-image">
                                <img src="${item.image}" alt="${item.name}">
                            </div>
                            <div class="item-details">
                                <div class="item-name">${item.name}</div>
                                <div class="item-meta">Qty: ${item.quantity}</div>
                            </div>
                            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="order-info">
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Shipping Address</span>
                        <span class="info-value">
                            ${order.shippingAddress.fullName}<br>
                            ${order.shippingAddress.address}<br>
                            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}<br>
                            ${order.shippingAddress.country}
                        </span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Order Summary</span>
                        <span class="info-value">
                            Subtotal: $${order.subtotal.toFixed(2)}<br>
                            Shipping: ${order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}<br>
                            Tax: $${order.tax.toFixed(2)}<br>
                            <strong>Total: $${order.total.toFixed(2)}</strong>
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="order-actions">
                <a href="contact.html" class="btn btn-outline">
                    <i class="fas fa-question-circle"></i> Need Help?
                </a>
                <a href="shop.html" class="btn btn-primary">
                    <i class="fas fa-shopping-bag"></i> Shop Again
                </a>
            </div>
        `;
    }
    
    // Show not found message
    function showNotFound() {
        return `
            <div class="order-not-found">
                <i class="fas fa-search"></i>
                <h3>Order Not Found</h3>
                <p>We couldn't find an order with that number and email address. Please check your information and try again.</p>
                <button onclick="location.reload()" class="btn btn-primary">Try Again</button>
            </div>
        `;
    }
    
    // Show loading
    function showLoading() {
        return `
            <div class="tracking-loading">
                <div class="spinner"></div>
                <p>Tracking your order...</p>
            </div>
        `;
    }
    
    // Setup form submission
    function setupTrackingForm() {
        const form = document.getElementById('trackingForm');
        const resultContainer = document.getElementById('trackingResult');
        const formContainer = document.getElementById('trackingFormContainer');
        
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const orderNumber = document.getElementById('orderNumber').value.trim().toUpperCase();
            const orderEmail = document.getElementById('orderEmail').value.trim();
            
            if (!orderNumber || !orderEmail) {
                alert('Please enter both order number and email address');
                return;
            }
            
            // Show loading
            resultContainer.style.display = 'block';
            resultContainer.innerHTML = showLoading();
            formContainer.style.display = 'none';
            
            // Simulate API call delay
            setTimeout(() => {
                const order = trackOrder(orderNumber, orderEmail);
                
                if (order) {
                    resultContainer.innerHTML = generateTrackingResult(order);
                } else {
                    resultContainer.innerHTML = showNotFound();
                }
                
                // Scroll to result
                resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 800);
        });
    }
    
    // Setup FAQ accordion
    function setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });
    }
    
    // Initialize tracking page
    function init() {
        console.log('Order Tracking system initialized');
        setupTrackingForm();
        setupFAQ();
    }
    
    // Public API
    return {
        init: init,
        trackOrder: trackOrder
    };
})();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    OrderTracker.init();
    
    // Update cart count
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
});

// Make globally available
window.OrderTracker = OrderTracker;