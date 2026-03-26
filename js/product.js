// ============================================
// RafaMall - Product Detail Page JavaScript
// Product gallery, quantity selector, add to cart, related products
// ============================================

// ============================================
// Product State Variables
// ============================================

let currentProduct = null;
let currentQuantity = 1;
let selectedVariant = null;
let currentImageIndex = 0;
let productImages = [];

// ============================================
// Load Product by ID
// ============================================

function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    const productDetail = document.getElementById('productDetail');
    const relatedProductsSection = document.getElementById('relatedProducts');
    
    if (!productDetail) return;
    
    if (!productId || isNaN(productId)) {
        productDetail.innerHTML = `
            <div class="product-not-found">
                <i class="fas fa-leaf"></i>
                <h2>Product Not Found</h2>
                <p>The product you're looking for doesn't exist.</p>
                <a href="shop.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
        return;
    }
    
    // Find product in global products array
    if (typeof products === 'undefined') {
        productDetail.innerHTML = `
            <div class="product-not-found">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Error Loading Product</h2>
                <p>Unable to load product data. Please try again later.</p>
                <a href="shop.html" class="btn btn-primary">Back to Shop</a>
            </div>
        `;
        return;
    }
    
    currentProduct = products.find(p => p.id === productId);
    
    if (!currentProduct) {
        productDetail.innerHTML = `
            <div class="product-not-found">
                <i class="fas fa-search"></i>
                <h2>Product Not Found</h2>
                <p>Product with ID ${productId} doesn't exist.</p>
                <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        return;
    }
    
    // Generate product images array (main + variations)
    productImages = [currentProduct.image];
    // Add some variation images (in a real app, these would come from the product data)
    if (currentProduct.category === 'herbal-teas') {
        productImages.push(
            "https://placehold.co/400x400/333333/FFFFFF?text=Tea+Packaging",
            "https://placehold.co/400x400/444444/FFFFFF?text=Tea+Leaves"
        );
    } else if (currentProduct.category === 'essential-oils') {
        productImages.push(
            "https://placehold.co/400x400/333333/FFFFFF?text=Oil+Bottle",
            "https://placehold.co/400x400/444444/FFFFFF?text=Oil+Dropper"
        );
    } else {
        productImages.push(
            "https://placehold.co/400x400/333333/FFFFFF?text=Product+Detail",
            "https://placehold.co/400x400/444444/FFFFFF?text=Packaging"
        );
    }
    
    // Update page title and meta
    document.title = `${currentProduct.name} - RafaMall`;
    updateMetaTags();
    
    // Update breadcrumb
    updateBreadcrumb();
    
    // Generate product detail HTML
    generateProductHTML();
    
    // Load related products
    loadRelatedProducts();
    
    // Setup quantity selector
    setupQuantitySelector();
    
    // Setup image gallery
    setupImageGallery();
    
    // Setup add to cart button
    setupAddToCartButton();
    
    // Increment view count (for analytics)
    incrementProductView(productId);
}

// ============================================
// Update Meta Tags
// ============================================

function updateMetaTags() {
    if (!currentProduct) return;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
    }
    metaDescription.content = currentProduct.description.substring(0, 160);
}

// ============================================
// Update Breadcrumb
// ============================================

function updateBreadcrumb() {
    const breadcrumbCategory = document.getElementById('breadcrumbCategory');
    const breadcrumbProduct = document.getElementById('breadcrumbProduct');
    
    if (breadcrumbCategory) {
        breadcrumbCategory.textContent = currentProduct.category.replace(/-/g, ' ');
    }
    if (breadcrumbProduct) {
        breadcrumbProduct.textContent = currentProduct.name;
    }
}

// ============================================
// Generate Product HTML
// ============================================

function generateProductHTML() {
    const productDetail = document.getElementById('productDetail');
    if (!productDetail) return;
    
    // Generate star rating
    const fullStars = Math.floor(currentProduct.rating);
    const halfStar = currentProduct.rating % 1 >= 0.5;
    let starsHtml = '';
    for (let i = 0; i < fullStars; i++) starsHtml += '<i class="fas fa-star"></i>';
    if (halfStar) starsHtml += '<i class="fas fa-star-half-alt"></i>';
    for (let i = starsHtml.length / 2; i < 5; i++) starsHtml += '<i class="far fa-star"></i>';
    
    // Stock status
    const stockStatus = currentProduct.inStock 
        ? '<span class="stock-status in-stock"><i class="fas fa-check-circle"></i> In Stock</span>'
        : '<span class="stock-status out-of-stock"><i class="fas fa-times-circle"></i> Out of Stock</span>';
    
    productDetail.innerHTML = `
        <div class="product-detail-layout">
            <!-- Product Gallery -->
            <div class="product-gallery">
                <div class="product-main-image">
                    <img src="${productImages[0]}" alt="${currentProduct.name}" id="mainProductImage">
                </div>
                <div class="product-thumbnails" id="productThumbnails">
                    ${productImages.map((img, index) => `
                        <div class="product-thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <img src="${img}" alt="Product view ${index + 1}">
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Product Info -->
            <div class="product-info-detail">
                <div class="product-category-detail">${currentProduct.category.replace(/-/g, ' ').toUpperCase()}</div>
                <h1 class="product-title-detail">${currentProduct.name}</h1>
                <div class="product-rating-detail">
                    <div class="stars">${starsHtml}</div>
                    <span class="rating-count">${currentProduct.reviewCount} Reviews</span>
                </div>
                <div class="product-price-detail">
                    <span class="current-price-detail">$${currentProduct.price}</span>
                    ${currentProduct.oldPrice ? `<span class="old-price-detail">$${currentProduct.oldPrice}</span>` : ''}
                    ${stockStatus}
                </div>
                <div class="product-description">
                    <h3>Description</h3>
                    <p>${currentProduct.description}</p>
                </div>
                <div class="product-features">
                    <h3>Features</h3>
                    <ul>
                        <li><i class="fas fa-leaf"></i> 100% Organic Ingredients</li>
                        <li><i class="fas fa-flask"></i> Lab Tested for Purity</li>
                        <li><i class="fas fa-truck"></i> Free Shipping on Orders $50+</li>
                        <li><i class="fas fa-undo-alt"></i> 30-Day Money Back Guarantee</li>
                        <li><i class="fas fa-certificate"></i> GMP Certified Facility</li>
                    </ul>
                </div>
                <div class="quantity-selector">
                    <label>Quantity:</label>
                    <div class="quantity-control">
                        <button class="quantity-btn-detail" id="decrementQuantity">-</button>
                        <input type="number" id="quantityDetail" value="1" min="1" max="99" class="quantity-input-detail">
                        <button class="quantity-btn-detail" id="incrementQuantity">+</button>
                    </div>
                </div>
                <div class="product-actions-detail">
                    <button class="btn btn-primary" id="addToCartBtn" ${!currentProduct.inStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-bag"></i> ${currentProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <button class="btn btn-wishlist" id="wishlistBtn">
                        <i class="far fa-heart"></i> Wishlist
                    </button>
                </div>
                <div class="product-meta">
                    <p><i class="fas fa-tag"></i> Category: ${currentProduct.category.replace(/-/g, ' ')}</p>
                    <p><i class="fas fa-box"></i> SKU: RM-${currentProduct.id.toString().padStart(4, '0')}</p>
                    <p><i class="fas fa-shield-alt"></i> Secure checkout with encrypted payment</p>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// Setup Image Gallery
// ============================================

function setupImageGallery() {
    const thumbnails = document.querySelectorAll('.product-thumbnail');
    const mainImage = document.getElementById('mainProductImage');
    
    if (!thumbnails.length || !mainImage) return;
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const index = parseInt(thumb.dataset.index);
            const newImage = productImages[index];
            
            // Update main image with fade effect
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.src = newImage;
                mainImage.style.opacity = '1';
            }, 150);
            
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            currentImageIndex = index;
        });
    });
    
    // Add zoom effect on main image hover
    mainImage.addEventListener('mouseenter', () => {
        mainImage.style.transform = 'scale(1.05)';
        mainImage.style.transition = 'transform 0.3s ease';
    });
    
    mainImage.addEventListener('mouseleave', () => {
        mainImage.style.transform = 'scale(1)';
    });
}

// ============================================
// Setup Quantity Selector
// ============================================

function setupQuantitySelector() {
    const quantityInput = document.getElementById('quantityDetail');
    const decrementBtn = document.getElementById('decrementQuantity');
    const incrementBtn = document.getElementById('incrementQuantity');
    
    if (!quantityInput) return;
    
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
            } else {
                showNotification('Maximum quantity is 99', 'info');
            }
        });
    }
    
    quantityInput.addEventListener('change', () => {
        let value = parseInt(quantityInput.value);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 99) {
            value = 99;
            showNotification('Maximum quantity is 99', 'info');
        }
        quantityInput.value = value;
        currentQuantity = value;
    });
}

// ============================================
// Setup Add to Cart Button
// ============================================

function setupAddToCartButton() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (!addToCartBtn) return;
    
    addToCartBtn.addEventListener('click', () => {
        if (!currentProduct.inStock) {
            showNotification('This product is currently out of stock', 'error');
            return;
        }
        
        const quantity = parseInt(document.getElementById('quantityDetail').value);
        
        // Add to cart using global function
        if (typeof addToCart === 'function') {
            addToCart(currentProduct.id, currentProduct.name, currentProduct.price, currentProduct.image);
            
            // Add animation effect
            addToCartBtn.classList.add('btn-success');
            addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Added!';
            setTimeout(() => {
                addToCartBtn.innerHTML = '<i class="fas fa-shopping-bag"></i> Add to Cart';
                addToCartBtn.classList.remove('btn-success');
            }, 1500);
        } else {
            // Fallback if global function doesn't exist
            showNotification('Added to cart!', 'success');
        }
    });
    
    // Wishlist button
    const wishlistBtn = document.getElementById('wishlistBtn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', () => {
            const wishlist = JSON.parse(localStorage.getItem('rafamall_wishlist')) || [];
            
            if (!wishlist.includes(currentProduct.id)) {
                wishlist.push(currentProduct.id);
                localStorage.setItem('rafamall_wishlist', JSON.stringify(wishlist));
                wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> Added to Wishlist';
                wishlistBtn.style.background = 'var(--primary)';
                wishlistBtn.style.color = 'var(--bg-primary)';
                showNotification('Added to wishlist!', 'success');
            } else {
                showNotification('Already in wishlist', 'info');
            }
        });
    }
}

// ============================================
// Load Related Products
// ============================================

function loadRelatedProducts() {
    const grid = document.getElementById('relatedProductsGrid');
    const section = document.getElementById('relatedProducts');
    
    if (!grid) return;
    
    // Get related products from same category
    const related = (typeof products !== 'undefined' ? products : [])
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);
    
    if (related.length === 0) {
        if (section) section.style.display = 'none';
        return;
    }
    
    if (section) section.style.display = 'block';
    
    grid.innerHTML = related.map(product => `
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
                    <button class="product-action-btn wishlist">
                        <i class="far fa-heart"></i>
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
                <div class="product-rating">
                    <div class="stars">${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 ? '½' : ''}</div>
                    <span class="rating-count">(${product.reviewCount})</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Attach add-to-cart events for related products
    if (typeof attachAddToCartEvents === 'function') {
        attachAddToCartEvents();
    } else {
        document.querySelectorAll('#relatedProductsGrid .add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = parseInt(btn.dataset.id);
                const name = btn.dataset.name;
                const price = parseFloat(btn.dataset.price);
                const image = btn.dataset.image;
                if (typeof addToCart === 'function') {
                    addToCart(id, name, price, image);
                }
            });
        });
    }
}

// ============================================
// Increment Product View Count
// ============================================

function incrementProductView(productId) {
    const views = JSON.parse(localStorage.getItem('rafamall_product_views')) || {};
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    if (!views[productId] || (now - views[productId].lastView) > oneHour) {
        views[productId] = {
            count: (views[productId]?.count || 0) + 1,
            lastView: now
        };
        localStorage.setItem('rafamall_product_views', JSON.stringify(views));
    }
}

// ============================================
// Show Notification
// ============================================

function showNotification(message, type = 'success') {
    // Check if global notification function exists
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // Fallback notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// Initialize Product Page
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Product page JS loaded');
    loadProductDetail();
});

// Add success button style dynamically
const btnSuccessStyle = document.createElement('style');
btnSuccessStyle.textContent = `
    .btn-success {
        background: var(--success) !important;
        border-color: var(--success) !important;
    }
    .stock-status {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.75rem;
        margin-left: 16px;
    }
    .stock-status.in-stock {
        color: var(--success);
    }
    .stock-status.out-of-stock {
        color: var(--danger);
    }
`;
document.head.appendChild(btnSuccessStyle);