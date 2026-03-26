/* ============================================
   RafaMall - Shop Page JavaScript
   Product filtering, sorting, pagination, wishlist
   ============================================ */

// ============================================
// Shop State Variables
// ============================================

let shopProducts = [];
let shopCurrentPage = 1;
let shopCurrentSort = 'featured';
let shopPriceMax = 200;
let shopSelectedRatings = [];
let shopInStockOnly = false;
let shopCurrentCategory = 'all';
const shopProductsPerPage = 9;

// ============================================
// Load Products from Global Products Array
// ============================================

function loadShopProducts() {
    if (typeof products !== 'undefined') {
        shopProducts = [...products];
        console.log('Products loaded:', shopProducts.length, 'items');
    } else if (typeof window.products !== 'undefined') {
        shopProducts = [...window.products];
        console.log('Products loaded from window:', shopProducts.length, 'items');
    } else {
        console.error('Products array not found!');
        shopProducts = [];
    }
    return shopProducts;
}

// ============================================
// Display Shop Products (with Wishlist Button)
// ============================================

function displayShopProducts() {
    const grid = document.getElementById('shopProductsGrid');
    const productsCount = document.getElementById('productsCount');
    
    if (!grid) return;
    
    if (shopProducts.length === 0) {
        loadShopProducts();
    }
    
    let filtered = applyShopFilters();
    filtered = sortShopProducts(filtered);
    
    const totalPages = Math.ceil(filtered.length / shopProductsPerPage);
    const startIndex = (shopCurrentPage - 1) * shopProductsPerPage;
    const endIndex = startIndex + shopProductsPerPage;
    const paginatedProducts = filtered.slice(startIndex, endIndex);
    
    if (productsCount) {
        if (filtered.length === 0) {
            productsCount.textContent = 'No products found';
        } else {
            productsCount.textContent = `Showing ${startIndex + 1}-${Math.min(endIndex, filtered.length)} of ${filtered.length} products`;
        }
    }
    
    if (paginatedProducts.length === 0) {
        grid.innerHTML = `
            <div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 60px;">
                <i class="fas fa-leaf" style="font-size: 48px; color: var(--text-tertiary); margin-bottom: 16px;"></i>
                <h3>No products found</h3>
                <p style="color: var(--text-tertiary);">Try adjusting your filters or browse other categories.</p>
                <button onclick="resetShopFilters()" class="btn btn-outline" style="margin-top: 20px;">Clear All Filters</button>
            </div>
        `;
    } else {
        grid.innerHTML = paginatedProducts.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    <div class="product-actions">
                        <button class="product-action-btn wishlist-btn" 
                                data-id="${product.id}" 
                                data-name="${product.name}" 
                                data-price="${product.price}" 
                                data-image="${product.image}"
                                data-category="${product.category}"
                                data-rating="${product.rating}"
                                data-review-count="${product.reviewCount}">
                            <i class="far fa-heart"></i>
                        </button>
                        <button class="product-action-btn quick-view-btn" data-id="${product.id}">
                            <i class="fas fa-eye"></i>
                        </button>
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
                    <div class="product-rating">
                        <div class="stars">${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 ? '½' : ''}</div>
                        <span class="rating-count">(${product.reviewCount})</span>
                    </div>
                    <button class="view-reviews-btn" data-product-id="${product.id}" style="margin-top: 12px; width: 100%;">
                        <i class="fas fa-star"></i> View Reviews (${product.reviewCount})
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    updateShopPagination(totalPages);
    
    if (typeof attachAddToCartEvents === 'function') {
        attachAddToCartEvents();
    }
    
    if (typeof Wishlist !== 'undefined' && Wishlist.updateButtons) {
        setTimeout(() => Wishlist.updateButtons(), 100);
    }
}

// ============================================
// Apply Shop Filters
// ============================================

function applyShopFilters() {
    let filtered = [...shopProducts];
    
    if (shopCurrentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === shopCurrentCategory);
    }
    
    filtered = filtered.filter(p => p.price <= shopPriceMax);
    
    if (shopSelectedRatings.length > 0) {
        const minRating = Math.min(...shopSelectedRatings);
        filtered = filtered.filter(p => p.rating >= minRating);
    }
    
    if (shopInStockOnly) {
        filtered = filtered.filter(p => p.inStock);
    }
    
    return filtered;
}

// ============================================
// Sort Shop Products
// ============================================

function sortShopProducts(products) {
    const sorted = [...products];
    
    switch(shopCurrentSort) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'featured':
        default:
            return sorted.sort((a, b) => b.rating - a.rating);
    }
}

// ============================================
// Update Shop Pagination
// ============================================

function updateShopPagination(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    if (shopCurrentPage > 1) {
        paginationHTML += `<a href="#" data-page="${shopCurrentPage - 1}"><i class="fas fa-chevron-left"></i></a>`;
    }
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= shopCurrentPage - 1 && i <= shopCurrentPage + 1)) {
            paginationHTML += `<a href="#" data-page="${i}" class="${i === shopCurrentPage ? 'active' : ''}">${i}</a>`;
        } else if (i === shopCurrentPage - 2 || i === shopCurrentPage + 2) {
            paginationHTML += `<span>...</span>`;
        }
    }
    
    if (shopCurrentPage < totalPages) {
        paginationHTML += `<a href="#" data-page="${shopCurrentPage + 1}"><i class="fas fa-chevron-right"></i></a>`;
    }
    
    paginationContainer.innerHTML = paginationHTML;
    
    paginationContainer.querySelectorAll('a[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            shopCurrentPage = parseInt(link.dataset.page);
            displayShopProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// ============================================
// Setup Shop Filters
// ============================================

function setupShopFilters() {
    const categoryLinks = document.querySelectorAll('.filter-list a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            shopCurrentCategory = category === 'all' ? 'all' : category;
            shopCurrentPage = 1;
            
            categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            displayShopProducts();
        });
    });
    
    const priceRange = document.getElementById('priceRange');
    const priceMaxSpan = document.getElementById('priceMax');
    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            shopPriceMax = parseInt(e.target.value);
            if (priceMaxSpan) priceMaxSpan.textContent = `$${shopPriceMax}`;
            shopCurrentPage = 1;
            displayShopProducts();
        });
    }
    
    const ratingCheckboxes = document.querySelectorAll('.rating-filters input');
    ratingCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            shopSelectedRatings = Array.from(document.querySelectorAll('.rating-filters input:checked'))
                .map(input => parseInt(input.value));
            shopCurrentPage = 1;
            displayShopProducts();
        });
    });
    
    const stockCheckbox = document.getElementById('inStockOnly');
    if (stockCheckbox) {
        stockCheckbox.addEventListener('change', (e) => {
            shopInStockOnly = e.target.checked;
            shopCurrentPage = 1;
            displayShopProducts();
        });
    }
    
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            shopCurrentSort = e.target.value;
            shopCurrentPage = 1;
            displayShopProducts();
        });
    }
    
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) {
        clearBtn.addEventListener('click', resetShopFilters);
    }
}

// ============================================
// Reset Shop Filters
// ============================================

function resetShopFilters() {
    shopCurrentCategory = 'all';
    shopPriceMax = 200;
    shopSelectedRatings = [];
    shopInStockOnly = false;
    shopCurrentSort = 'featured';
    shopCurrentPage = 1;
    
    const priceRange = document.getElementById('priceRange');
    const priceMaxSpan = document.getElementById('priceMax');
    if (priceRange) priceRange.value = 200;
    if (priceMaxSpan) priceMaxSpan.textContent = '$200';
    
    document.querySelectorAll('.rating-filters input').forEach(cb => cb.checked = false);
    const stockCheckbox = document.getElementById('inStockOnly');
    if (stockCheckbox) stockCheckbox.checked = false;
    
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) sortSelect.value = 'featured';
    
    const categoryLinks = document.querySelectorAll('.filter-list a');
    categoryLinks.forEach(link => {
        if (link.dataset.category === 'all') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    displayShopProducts();
}

window.resetShopFilters = resetShopFilters;

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
    notification.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// ============================================
// Initialize Shop Page
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Shop page JS loaded');
    
    loadShopProducts();
    displayShopProducts();
    setupShopFilters();
    
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        shopCurrentCategory = categoryParam;
        const categoryLinks = document.querySelectorAll('.filter-list a');
        categoryLinks.forEach(link => {
            if (link.dataset.category === categoryParam) {
                link.classList.add('active');
            } else if (link.dataset.category === 'all') {
                link.classList.remove('active');
            }
        });
        displayShopProducts();
    }
    
    if (typeof attachAddToCartEvents === 'function') {
        attachAddToCartEvents();
    }
    
    console.log('Shop page fully initialized');
});