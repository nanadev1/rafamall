// ============================================
// RafaMall - Category Page JavaScript
// Category filtering, sorting, pagination
// ============================================

// Category Data
const categories = {
    'herbal-teas': {
        name: 'Herbal Teas',
        description: 'Discover our premium collection of organic herbal teas for wellness and relaxation.',
        icon: 'fa-leaf',
        products: []
    },
    'essential-oils': {
        name: 'Essential Oils',
        description: 'Pure therapeutic grade essential oils for aromatherapy and wellness.',
        icon: 'fa-oil-can',
        products: []
    },
    'dried-herbs': {
        name: 'Dried Herbs',
        description: 'Premium dried herbs for teas, cooking, and natural remedies.',
        icon: 'fa-seedling',
        products: []
    },
    'supplements': {
        name: 'Supplements',
        description: 'Natural supplements to support your health and wellness journey.',
        icon: 'fa-capsules',
        products: []
    },
    'natural-skincare': {
        name: 'Natural Skincare',
        description: 'Clean beauty products for radiant, healthy skin.',
        icon: 'fa-spa',
        products: []
    },
    'wellness': {
        name: 'Wellness',
        description: 'Holistic wellness products for mind, body, and spirit.',
        icon: 'fa-heartbeat',
        products: []
    }
};

// Filter state
let currentCategory = null;
let filteredProducts = [];
let currentSort = 'featured';
let currentPage = 1;
const productsPerPage = 9;
let priceMax = 200;
let selectedRatings = [];
let inStockOnly = false;

// Get URL parameter
function getCategoryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('cat');
}

// Load category products
function loadCategoryProducts() {
    const catParam = getCategoryFromURL();
    const categoryKey = catParam || 'herbal-teas';
    
    if (categories[categoryKey]) {
        currentCategory = categoryKey;
    } else {
        currentCategory = 'herbal-teas';
    }
    
    // Filter products from global products array
    filteredProducts = products.filter(p => p.category === currentCategory);
    
    // Update category header
    updateCategoryHeader();
    
    // Apply initial filters
    applyFilters();
    
    // Display products
    displayCategoryProducts();
    
    // Setup event listeners
    setupCategoryEvents();
}

// Update category header
function updateCategoryHeader() {
    const category = categories[currentCategory];
    const titleEl = document.getElementById('categoryTitle');
    const descEl = document.getElementById('categoryDescription');
    const iconEl = document.getElementById('categoryIcon');
    const countEl = document.getElementById('productCount');
    
    if (titleEl) titleEl.textContent = category.name;
    if (descEl) descEl.textContent = category.description;
    if (iconEl) iconEl.innerHTML = `<i class="fas ${category.icon}"></i>`;
    if (countEl) countEl.textContent = `${filteredProducts.length} products`;
}

// Apply filters
function applyFilters() {
    let products = filteredProducts;
    
    // Price filter
    products = products.filter(p => p.price <= priceMax);
    
    // Rating filter
    if (selectedRatings.length > 0) {
        const minRating = Math.min(...selectedRatings);
        products = products.filter(p => p.rating >= minRating);
    }
    
    // Stock filter
    if (inStockOnly) {
        products = products.filter(p => p.inStock);
    }
    
    // Sort products
    products = sortProducts(products);
    
    // Update active filters display
    updateActiveFilters();
    
    return products;
}

// Sort products
function sortProducts(products) {
    const sorted = [...products];
    
    switch(currentSort) {
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

// Update active filters display
function updateActiveFilters() {
    const container = document.getElementById('activeFilters');
    if (!container) return;
    
    let filters = [];
    
    if (priceMax < 200) {
        filters.push({ type: 'price', label: `Under $${priceMax}`, value: priceMax });
    }
    
    if (selectedRatings.length > 0) {
        filters.push({ type: 'rating', label: `${Math.min(...selectedRatings)}+ Stars`, value: selectedRatings });
    }
    
    if (inStockOnly) {
        filters.push({ type: 'stock', label: 'In Stock', value: true });
    }
    
    if (filters.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = filters.map(filter => `
        <span class="filter-tag">
            ${filter.label}
            <button onclick="removeFilter('${filter.type}')">&times;</button>
        </span>
    `).join('');
}

// Remove filter
function removeFilter(type) {
    switch(type) {
        case 'price':
            priceMax = 200;
            const priceRange = document.getElementById('priceRange');
            if (priceRange) priceRange.value = 200;
            const mobilePriceRange = document.getElementById('mobilePriceRange');
            if (mobilePriceRange) mobilePriceRange.value = 200;
            const priceMaxSpan = document.getElementById('priceMax');
            if (priceMaxSpan) priceMaxSpan.textContent = '$200';
            const mobilePriceMax = document.getElementById('mobilePriceMax');
            if (mobilePriceMax) mobilePriceMax.textContent = '$200';
            break;
        case 'rating':
            selectedRatings = [];
            document.querySelectorAll('.rating-filters input').forEach(cb => cb.checked = false);
            break;
        case 'stock':
            inStockOnly = false;
            const stockCheckbox = document.getElementById('inStockOnly');
            if (stockCheckbox) stockCheckbox.checked = false;
            const mobileStock = document.getElementById('mobileInStock');
            if (mobileStock) mobileStock.checked = false;
            break;
    }
    
    currentPage = 1;
    displayCategoryProducts();
}

// Display products with pagination
function displayCategoryProducts() {
    const grid = document.getElementById('categoryProductsGrid');
    const pagination = document.getElementById('pagination');
    
    if (!grid) return;
    
    const filtered = applyFilters();
    const totalPages = Math.ceil(filtered.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = filtered.slice(startIndex, endIndex);
    
    // Update product count in header
    const countEl = document.getElementById('productCount');
    if (countEl) countEl.textContent = `${filtered.length} products`;
    
    if (paginatedProducts.length === 0) {
        grid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or browse other categories.</p>
                <button onclick="resetAllFilters()" class="btn btn-outline">Clear Filters</button>
            </div>
        `;
        pagination.innerHTML = '';
        return;
    }
    
    grid.innerHTML = paginatedProducts.map(product => `
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
    
    // Update pagination
    updatePagination(totalPages);
    
    // Attach cart events
    attachAddToCartEvents();
}

// Update pagination
function updatePagination(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    if (currentPage > 1) {
        paginationHTML += `<a href="#" data-page="${currentPage - 1}"><i class="fas fa-chevron-left"></i></a>`;
    }
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `<a href="#" data-page="${i}" class="${i === currentPage ? 'active' : ''}">${i}</a>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<span>...</span>`;
        }
    }
    
    if (currentPage < totalPages) {
        paginationHTML += `<a href="#" data-page="${currentPage + 1}"><i class="fas fa-chevron-right"></i></a>`;
    }
    
    paginationContainer.innerHTML = paginationHTML;
    
    paginationContainer.querySelectorAll('a[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = parseInt(link.dataset.page);
            displayCategoryProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Reset all filters
function resetAllFilters() {
    priceMax = 200;
    selectedRatings = [];
    inStockOnly = false;
    currentSort = 'featured';
    currentPage = 1;
    
    // Reset UI elements
    const priceRange = document.getElementById('priceRange');
    if (priceRange) priceRange.value = 200;
    const mobilePriceRange = document.getElementById('mobilePriceRange');
    if (mobilePriceRange) mobilePriceRange.value = 200;
    const priceMaxSpan = document.getElementById('priceMax');
    if (priceMaxSpan) priceMaxSpan.textContent = '$200';
    const mobilePriceMax = document.getElementById('mobilePriceMax');
    if (mobilePriceMax) mobilePriceMax.textContent = '$200';
    
    document.querySelectorAll('.rating-filters input').forEach(cb => cb.checked = false);
    const stockCheckbox = document.getElementById('inStockOnly');
    if (stockCheckbox) stockCheckbox.checked = false;
    const mobileStock = document.getElementById('mobileInStock');
    if (mobileStock) mobileStock.checked = false;
    
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'featured';
    
    displayCategoryProducts();
}

// Setup category events
function setupCategoryEvents() {
    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            currentPage = 1;
            displayCategoryProducts();
        });
    }
    
    // Price range filter (desktop)
    const priceRange = document.getElementById('priceRange');
    const priceMaxSpan = document.getElementById('priceMax');
    if (priceRange && priceMaxSpan) {
        priceRange.addEventListener('input', (e) => {
            priceMax = parseInt(e.target.value);
            priceMaxSpan.textContent = `$${priceMax}`;
            currentPage = 1;
            displayCategoryProducts();
        });
    }
    
    // Price range filter (mobile)
    const mobilePriceRange = document.getElementById('mobilePriceRange');
    const mobilePriceMax = document.getElementById('mobilePriceMax');
    if (mobilePriceRange && mobilePriceMax) {
        mobilePriceRange.addEventListener('input', (e) => {
            priceMax = parseInt(e.target.value);
            mobilePriceMax.textContent = `$${priceMax}`;
        });
    }
    
    // Rating filters
    document.querySelectorAll('.rating-filters input').forEach(cb => {
        cb.addEventListener('change', () => {
            selectedRatings = Array.from(document.querySelectorAll('.rating-filters input:checked'))
                .map(input => parseInt(input.value));
            currentPage = 1;
            displayCategoryProducts();
        });
    });
    
    // In stock filter
    const stockCheckbox = document.getElementById('inStockOnly');
    if (stockCheckbox) {
        stockCheckbox.addEventListener('change', (e) => {
            inStockOnly = e.target.checked;
            currentPage = 1;
            displayCategoryProducts();
        });
    }
    
    // Mobile filter toggle
    const filterToggle = document.getElementById('filterToggle');
    const closeFilter = document.getElementById('closeFilter');
    const mobileSidebar = document.getElementById('mobileFilterSidebar');
    const overlay = document.createElement('div');
    overlay.className = 'filter-overlay';
    document.body.appendChild(overlay);
    
    if (filterToggle && mobileSidebar) {
        filterToggle.addEventListener('click', () => {
            mobileSidebar.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeFilter.addEventListener('click', closeMobileFilter);
        overlay.addEventListener('click', closeMobileFilter);
        
        function closeMobileFilter() {
            mobileSidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Apply mobile filters
    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            // Get mobile filter values
            const mobilePrice = parseInt(document.getElementById('mobilePriceRange').value);
            const mobileRatings = Array.from(document.querySelectorAll('#mobileFilterSidebar .rating-filters input:checked'))
                .map(input => parseInt(input.value));
            const mobileStock = document.getElementById('mobileInStock').checked;
            
            priceMax = mobilePrice;
            selectedRatings = mobileRatings;
            inStockOnly = mobileStock;
            
            currentPage = 1;
            displayCategoryProducts();
            closeMobileFilter();
        });
    }
    
    // Clear mobile filters
    const clearMobileBtn = document.getElementById('clearFiltersMobile');
    if (clearMobileBtn) {
        clearMobileBtn.addEventListener('click', () => {
            document.getElementById('mobilePriceRange').value = 200;
            document.querySelectorAll('#mobileFilterSidebar .rating-filters input').forEach(cb => cb.checked = false);
            document.getElementById('mobileInStock').checked = false;
            
            priceMax = 200;
            selectedRatings = [];
            inStockOnly = false;
            
            currentPage = 1;
            displayCategoryProducts();
            closeMobileFilter();
        });
    }
}

// Initialize category page
document.addEventListener('DOMContentLoaded', () => {
    loadCategoryProducts();
});