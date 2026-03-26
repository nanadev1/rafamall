/* ============================================
   RafaMall - Quick View Modal JavaScript
   Standalone JS for Quick View Feature
   ============================================ */

// Quick View Module
const QuickView = (function() {
    // Private variables
    let modal = null;
    let overlay = null;
    let closeBtn = null;
    let contentContainer = null;
    let currentProduct = null;
    let currentQuantity = 1;
    let isOpen = false;
    
    // Product data (should be available globally)
    let productsData = [];
    
    // Initialize the modal
    function init() {
        // Create modal HTML
        createModal();
        
        // Get elements
        modal = document.getElementById('quickViewModal');
        overlay = document.querySelector('.quickview-overlay');
        closeBtn = document.getElementById('quickViewClose');
        contentContainer = document.getElementById('quickViewContent');
        
        // Set up event listeners
        if (closeBtn) {
            closeBtn.addEventListener('click', close);
        }
        
        if (overlay) {
            overlay.addEventListener('click', close);
        }
        
        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) {
                close();
            }
        });
        
        console.log('Quick View initialized');
    }
    
    // Create modal HTML structure
    function createModal() {
        // Check if modal already exists
        if (document.getElementById('quickViewModal')) return;
        
        const modalHTML = `
            <div id="quickViewModal" class="quickview-modal">
                <div class="quickview-overlay"></div>
                <div class="quickview-container">
                    <div class="quickview-content">
                        <button class="quickview-close" id="quickViewClose">
                            <i class="fas fa-times"></i>
                        </button>
                        <div id="quickViewContent" class="quickview-body">
                            <div class="quickview-loading">
                                <div class="spinner"></div>
                                <p>Loading product details...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Open quick view for a product
    function open(productId) {
        // Get products from global scope
        if (typeof window.products !== 'undefined') {
            productsData = window.products;
        } else if (typeof products !== 'undefined') {
            productsData = products;
        }
        
        // Find product
        const product = productsData.find(p => p.id === productId);
        if (!product) {
            console.error('Product not found:', productId);
            return;
        }
        
        currentProduct = product;
        currentQuantity = 1;
        
        // Get modal elements
        modal = document.getElementById('quickViewModal');
        contentContainer = document.getElementById('quickViewContent');
        
        if (!modal) {
            createModal();
            modal = document.getElementById('quickViewModal');
            contentContainer = document.getElementById('quickViewContent');
        }
        
        // Show modal
        modal.classList.add('active');
        isOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Load product content
        loadContent(product);
    }
    
    // Load product content into modal
    function loadContent(product) {
        if (!contentContainer) return;
        
        // Generate star rating
        const stars = generateStars(product.rating);
        
        // Generate thumbnails
        const thumbnails = generateThumbnails(product);
        
        // Stock status
        const stockStatus = product.inStock !== false 
            ? '<span class="quickview-stock in-stock"><i class="fas fa-check-circle"></i> In Stock</span>'
            : '<span class="quickview-stock out-of-stock"><i class="fas fa-times-circle"></i> Out of Stock</span>';
        
        contentContainer.innerHTML = `
            <div class="quickview-product">
                <div class="quickview-gallery">
                    <div class="quickview-main-image">
                        <img src="${product.image}" alt="${product.name}" id="quickViewMainImage">
                    </div>
                    <div class="quickview-thumbnails" id="quickViewThumbnails">
                        ${thumbnails}
                    </div>
                </div>
                <div class="quickview-info">
                    <span class="quickview-category">${product.category.replace(/-/g, ' ').toUpperCase()}</span>
                    <h2 class="quickview-title">${product.name}</h2>
                    <div class="quickview-rating">
                        <div class="quickview-stars">${stars}</div>
                        <span class="quickview-review-count">${product.reviewCount} Reviews</span>
                    </div>
                    <div class="quickview-price">
                        <span class="quickview-current-price">$${product.price}</span>
                        ${product.oldPrice ? `<span class="quickview-old-price">$${product.oldPrice}</span>` : ''}
                        ${stockStatus}
                    </div>
                    <p class="quickview-description">${product.description}</p>
                    <ul class="quickview-features">
                        <li><i class="fas fa-leaf"></i> 100% Organic Ingredients</li>
                        <li><i class="fas fa-flask"></i> Lab Tested for Purity</li>
                        <li><i class="fas fa-truck"></i> Free Shipping on Orders $50+</li>
                        <li><i class="fas fa-undo-alt"></i> 30-Day Money Back Guarantee</li>
                    </ul>
                    <div class="quickview-quantity">
                        <label>Quantity:</label>
                        <div class="quantity-control">
                            <button class="quantity-btn" id="quickViewDecrement">-</button>
                            <input type="number" id="quickViewQuantity" value="1" min="1" max="99" class="quantity-input">
                            <button class="quantity-btn" id="quickViewIncrement">+</button>
                        </div>
                    </div>
                    <div class="quickview-actions">
                        <button class="btn btn-primary" id="quickViewAddToCart">
                            <i class="fas fa-shopping-bag"></i> Add to Cart
                        </button>
                        <button class="btn btn-outline" id="quickViewViewProduct">
                            <i class="fas fa-eye"></i> View Full Details
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Setup event handlers
        setupGalleryEvents();
        setupQuantityEvents(product);
        setupButtonEvents(product);
    }
    
    // Generate star rating HTML
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        let starsHtml = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        if (halfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = starsHtml.length / 2; i < 5; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }
        
        return starsHtml;
    }
    
    // Generate thumbnail images
    function generateThumbnails(product) {
        const thumbnails = [
            product.image,
            "https://placehold.co/400x400/333333/FFFFFF?text=View+1",
            "https://placehold.co/400x400/444444/FFFFFF?text=View+2"
        ];
        
        return thumbnails.map((img, index) => `
            <div class="quickview-thumb ${index === 0 ? 'active' : ''}" data-image="${img}">
                <img src="${img}" alt="Product view ${index + 1}">
            </div>
        `).join('');
    }
    
    // Setup gallery thumbnail events
    function setupGalleryEvents() {
        const thumbnails = document.querySelectorAll('#quickViewThumbnails .quickview-thumb');
        const mainImage = document.getElementById('quickViewMainImage');
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const imageUrl = this.dataset.image;
                if (mainImage) mainImage.src = imageUrl;
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // Setup quantity controls
    function setupQuantityEvents(product) {
        const quantityInput = document.getElementById('quickViewQuantity');
        const decrementBtn = document.getElementById('quickViewDecrement');
        const incrementBtn = document.getElementById('quickViewIncrement');
        
        if (decrementBtn) {
            decrementBtn.addEventListener('click', () => {
                let value = parseInt(quantityInput.value);
                if (value > 1) {
                    quantityInput.value = value - 1;
                    currentQuantity = value - 1;
                }
            });
        }
        
        if (incrementBtn) {
            incrementBtn.addEventListener('click', () => {
                let value = parseInt(quantityInput.value);
                if (value < 99) {
                    quantityInput.value = value + 1;
                    currentQuantity = value + 1;
                }
            });
        }
        
        if (quantityInput) {
            quantityInput.addEventListener('change', () => {
                let value = parseInt(quantityInput.value);
                if (isNaN(value) || value < 1) value = 1;
                if (value > 99) value = 99;
                quantityInput.value = value;
                currentQuantity = value;
            });
        }
    }
    
    // Setup button events
    function setupButtonEvents(product) {
        const addToCartBtn = document.getElementById('quickViewAddToCart');
        const viewProductBtn = document.getElementById('quickViewViewProduct');
        
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const quantity = parseInt(document.getElementById('quickViewQuantity').value);
                
                // Use global addToCart function if available
                if (typeof addToCart === 'function') {
                    for (let i = 0; i < quantity; i++) {
                        addToCart(product.id, product.name, product.price, product.image);
                    }
                } else {
                    // Fallback: save directly to localStorage
                    let cart = JSON.parse(localStorage.getItem('rafamall_cart')) || [];
                    const existingItem = cart.find(item => item.id === product.id);
                    
                    if (existingItem) {
                        existingItem.quantity += quantity;
                    } else {
                        cart.push({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            quantity: quantity
                        });
                    }
                    
                    localStorage.setItem('rafamall_cart', JSON.stringify(cart));
                    
                    // Update cart count if function exists
                    if (typeof updateCartCount === 'function') {
                        updateCartCount();
                    }
                    
                    // Show notification
                    showNotification(`${product.name} added to cart!`, 'success');
                }
                
                close();
            });
        }
        
        if (viewProductBtn) {
            viewProductBtn.addEventListener('click', () => {
                window.location.href = `product.html?id=${product.id}`;
            });
        }
    }
    
    // Close modal
    function close() {
        if (modal) {
            modal.classList.remove('active');
            isOpen = false;
            document.body.style.overflow = '';
            currentProduct = null;
        }
    }
    
    // Show notification (fallback)
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #000;
            color: #fff;
            padding: 12px 20px;
            border-radius: 30px;
            z-index: 10000;
            font-size: 14px;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Public API
    return {
        init: init,
        open: open,
        close: close
    };
})();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    QuickView.init();
    
    // Add click handlers to all quick view buttons (for dynamically loaded content)
    document.body.addEventListener('click', function(e) {
        const quickViewBtn = e.target.closest('.quick-view-btn');
        if (quickViewBtn) {
            e.preventDefault();
            e.stopPropagation();
            const productId = parseInt(quickViewBtn.dataset.id);
            if (productId) {
                QuickView.open(productId);
            }
        }
    });
});

// Make QuickView available globally
window.QuickView = QuickView;