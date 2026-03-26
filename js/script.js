// ============================================
// RafaMall - Global JavaScript
// Shared functions for all pages
// ============================================

// Products Data
const products = [
    {
        id: 1,
        name: "Organic Chamomile Tea",
        category: "herbal-teas",
        price: 12.99,
        oldPrice: 18.99,
        rating: 4.8,
        reviewCount: 234,
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Chamomile+Tea",
        badge: "Best Seller",
        inStock: true,
        description: "Soothing organic chamomile flowers for relaxation and sleep."
    },
    {
        id: 2,
        name: "Lavender Essential Oil",
        category: "essential-oils",
        price: 24.99,
        oldPrice: 34.99,
        rating: 4.9,
        reviewCount: 456,
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Lavender+Oil",
        badge: "Organic",
        inStock: true,
        description: "Pure therapeutic grade lavender oil for aromatherapy."
    },
    {
        id: 3,
        name: "Moringa Powder",
        category: "supplements",
        price: 19.99,
        oldPrice: 29.99,
        rating: 4.7,
        reviewCount: 189,
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Moringa",
        badge: "Superfood",
        inStock: true,
        description: "Organic moringa leaf powder packed with nutrients."
    },
    {
        id: 4,
        name: "Dried Peppermint Leaves",
        category: "dried-herbs",
        price: 8.99,
        oldPrice: 12.99,
        rating: 4.6,
        reviewCount: 112,
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Peppermint",
        badge: "Fresh",
        inStock: true,
        description: "Aromatic dried peppermint for teas and cooking."
    },
    {
        id: 5,
        name: "Rosehip Facial Serum",
        category: "natural-skincare",
        price: 32.99,
        oldPrice: 45.99,
        rating: 4.9,
        reviewCount: 78,
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Rosehip+Serum",
        badge: "Anti-Aging",
        inStock: true,
        description: "Organic rosehip oil for glowing, youthful skin."
    },
    {
        id: 6,
        name: "Ashwagandha Capsules",
        category: "supplements",
        price: 28.99,
        oldPrice: 39.99,
        rating: 4.8,
        reviewCount: 312,
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Ashwagandha",
        badge: "Stress Relief",
        inStock: true,
        description: "Adaptogenic herb for stress and energy balance."
    },
    {
        id: 7,
        name: "Eucalyptus Essential Oil",
        category: "essential-oils",
        price: 18.99,
        oldPrice: 26.99,
        rating: 4.7,
        reviewCount: 167,
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Eucalyptus",
        badge: "Limited",
        inStock: true,
        description: "Respiratory support and refreshing aroma."
    },
    {
        id: 8,
        name: "Matcha Green Tea",
        category: "herbal-teas",
        price: 22.99,
        oldPrice: 32.99,
        rating: 4.9,
        reviewCount: 245,
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Matcha",
        badge: "Premium",
        inStock: true,
        description: "Ceremonial grade organic matcha for energy and focus."
    },
    {
        id: 9,
        name: "Turmeric Ginger Tea",
        category: "herbal-teas",
        price: 14.99,
        oldPrice: 21.99,
        rating: 4.8,
        reviewCount: 178,
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Turmeric+Ginger",
        badge: "Immunity",
        inStock: true,
        description: "Anti-inflammatory blend for wellness and warmth."
    },
    {
        id: 10,
        name: "Aloe Vera Gel",
        category: "natural-skincare",
        price: 15.99,
        oldPrice: 22.99,
        rating: 4.7,
        reviewCount: 234,
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Aloe+Vera",
        badge: "Cooling",
        inStock: true,
        description: "Pure aloe vera for skin hydration and soothing."
    },
    {
        id: 11,
        name: "Coconut Oil (Virgin)",
        category: "wellness",
        price: 16.99,
        oldPrice: 24.99,
        rating: 4.8,
        reviewCount: 567,
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Coconut+Oil",
        badge: "Cold Pressed",
        inStock: true,
        description: "Organic virgin coconut oil for cooking and skin."
    },
    {
        id: 12,
        name: "CBD Relief Balm",
        category: "wellness",
        price: 42.99,
        oldPrice: 59.99,
        rating: 4.9,
        reviewCount: 89,
        image: "https://placehold.co/400x400/000000/FFFFFF?text=CBD+Balm",
        badge: "New",
        inStock: true,
        description: "Full spectrum CBD balm for muscle relief."
    }
];

// Cart Management
let cart = JSON.parse(localStorage.getItem('rafamall_cart')) || [];

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}

function addToCart(productId, name, price, image) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    localStorage.setItem('rafamall_cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${name} added to cart!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('rafamall_cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Item removed from cart', 'info');
    
    // Reload cart page if on cart page
    if (window.location.pathname.includes('cart.html') && typeof displayCartItems === 'function') {
        displayCartItems();
    }
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('rafamall_cart', JSON.stringify(cart));
            updateCartCount();
            
            if (window.location.pathname.includes('cart.html') && typeof displayCartItems === 'function') {
                displayCartItems();
            }
        }
    }
}

function showNotification(message, type = 'success') {
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

// Mobile Menu Toggle (Global)
function setupMobileMenu() {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const nav = document.querySelector('.header-nav');
    const navCategories = document.querySelector('.nav-categories');
    const categoriesSpan = document.querySelector('.nav-categories > span');
    
    if (toggleBtn && nav) {
        toggleBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
    
    if (categoriesSpan && window.innerWidth <= 768) {
        categoriesSpan.addEventListener('click', (e) => {
            e.preventDefault();
            if (navCategories) {
                navCategories.classList.toggle('active');
            }
        });
    }
    
    document.querySelectorAll('.header-nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && nav) {
                nav.classList.remove('active');
            }
        });
    });
}

// Search Functionality (Global)
function setupSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    
    if (!searchForm) return;
    
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim().toLowerCase();
        if (query) {
            window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
        }
    });
}

// Newsletter (Global)
function setupNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        showNotification(`Thanks for subscribing! 🌿`, 'success');
        newsletterForm.reset();
    });
}

// Add to Cart Event Handler
function attachAddToCartEvents() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.removeEventListener('click', addToCartHandler);
        btn.addEventListener('click', addToCartHandler);
    });
}

function addToCartHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    const id = parseInt(this.dataset.id);
    const name = this.dataset.name;
    const price = parseFloat(this.dataset.price);
    const image = this.dataset.image;
    addToCart(id, name, price, image);
}

// Animation style for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize global functions on DOM load
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupSearch();
    setupNewsletter();
    updateCartCount();
});




// ============================================
// Back to Top Button Functionality
// ============================================

function setupBackToTop() {
    // Create button if it doesn't exist
    let backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'backToTop';
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTopBtn);
    }
    
    // Show/hide on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Call in DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    setupBackToTop();
});