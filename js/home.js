/* ============================================
   RafaMall - Homepage JavaScript
   Hero slider, product grids, countdown timer, wishlist
   ============================================ */

// ============================================
// Hero Slider
// ============================================

let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.slider-dot');
let slideInterval;

function showSlide(index) {
    if (!slides.length) return;
    slides.forEach((slide, i) => {
        if (slide) slide.classList.remove('active');
        if (dots[i]) dots[i].classList.remove('active');
    });
    if (slides[index]) slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    if (!slides.length) return;
    let newIndex = currentSlide + 1;
    if (newIndex >= slides.length) newIndex = 0;
    showSlide(newIndex);
}

function prevSlide() {
    if (!slides.length) return;
    let newIndex = currentSlide - 1;
    if (newIndex < 0) newIndex = slides.length - 1;
    showSlide(newIndex);
}

function startAutoSlide() {
    if (!slides.length) return;
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

function setupHeroSlider() {
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    if (!slides.length) return;
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
        dots.forEach((dot, index) => {
            if (dot) {
                dot.addEventListener('click', () => {
                    showSlide(index);
                    stopAutoSlide();
                    startAutoSlide();
                });
            }
        });
        startAutoSlide();
    }
}

// ============================================
// Display Featured Products
// ============================================

function displayFeaturedProducts() {
    const grid = document.getElementById('featuredProductsGrid');
    if (!grid) return;
    
    const featured = products.slice(0, 4);
    
    grid.innerHTML = featured.map(product => `
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
    
    if (typeof attachAddToCartEvents === 'function') {
        attachAddToCartEvents();
    }
    if (typeof Wishlist !== 'undefined' && Wishlist.updateButtons) {
        setTimeout(() => Wishlist.updateButtons(), 100);
    }
}

// ============================================
// Display Best Sellers
// ============================================

function displayBestSellers() {
    const grid = document.getElementById('bestSellersGrid');
    if (!grid) return;
    
    let bestSellers = products.filter(p => p.badge === 'Best Seller' || p.rating >= 4.8).slice(0, 4);
    if (bestSellers.length < 4) {
        bestSellers.push(...products.filter(p => !bestSellers.includes(p)).slice(0, 4 - bestSellers.length));
    }
    
    grid.innerHTML = bestSellers.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <span class="product-badge">Best Seller</span>
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
    
    if (typeof attachAddToCartEvents === 'function') {
        attachAddToCartEvents();
    }
    if (typeof Wishlist !== 'undefined' && Wishlist.updateButtons) {
        setTimeout(() => Wishlist.updateButtons(), 100);
    }
}

// ============================================
// Display New Arrivals
// ============================================

function displayNewArrivals() {
    const grid = document.getElementById('newArrivalsGrid');
    if (!grid) return;
    
    let newArrivals = products.filter(p => p.badge === 'New' || p.id > 8).slice(0, 4);
    if (newArrivals.length < 4) {
        newArrivals.push(...products.filter(p => !newArrivals.includes(p)).slice(0, 4 - newArrivals.length));
    }
    
    grid.innerHTML = newArrivals.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <span class="product-badge">New</span>
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
    
    if (typeof attachAddToCartEvents === 'function') {
        attachAddToCartEvents();
    }
    if (typeof Wishlist !== 'undefined' && Wishlist.updateButtons) {
        setTimeout(() => Wishlist.updateButtons(), 100);
    }
}

// ============================================
// Countdown Timer
// ============================================

function setupCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (!daysEl) return;
    
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    targetDate.setHours(23, 59, 59, 59);
    
    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        daysEl.textContent = days.toString().padStart(2, '0');
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ============================================
// Newsletter
// ============================================

function setupNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        if (typeof showNotification === 'function') {
            showNotification(`Thanks for subscribing! 🌿`, 'success');
        } else {
            alert(`Thanks for subscribing! 🌿`);
        }
        newsletterForm.reset();
    });
}

// ============================================
// Initialize Homepage
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Homepage JS loaded');
    
    setupHeroSlider();
    displayFeaturedProducts();
    displayBestSellers();
    displayNewArrivals();
    setupCountdown();
    setupNewsletter();
    
    if (typeof attachAddToCartEvents === 'function') {
        attachAddToCartEvents();
    }
    
    if (typeof setupQuickViewModal === 'function') {
        setupQuickViewModal();
    }
    
    console.log('Homepage fully initialized with RafaDoc integration');
});