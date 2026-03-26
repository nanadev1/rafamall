/* ============================================
   RafaMall - Wishlist JavaScript
   Complete wishlist functionality
   ============================================ */

const Wishlist = (function() {
    // Private variables
    let wishlistItems = [];
    let currentUser = null;
    
    // Load wishlist from localStorage
    function loadWishlist() {
        // Check if user is logged in
        const savedUser = localStorage.getItem('rafamall_current_user');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            const savedWishlist = localStorage.getItem(`rafamall_wishlist_${currentUser.id}`);
            if (savedWishlist) {
                wishlistItems = JSON.parse(savedWishlist);
            } else {
                wishlistItems = [];
            }
        } else {
            // Guest wishlist
            const savedWishlist = localStorage.getItem('rafamall_wishlist_guest');
            if (savedWishlist) {
                wishlistItems = JSON.parse(savedWishlist);
            } else {
                wishlistItems = [];
            }
        }
        return wishlistItems;
    }
    
    // Save wishlist to localStorage
    function saveWishlist() {
        if (currentUser) {
            localStorage.setItem(`rafamall_wishlist_${currentUser.id}`, JSON.stringify(wishlistItems));
        } else {
            localStorage.setItem('rafamall_wishlist_guest', JSON.stringify(wishlistItems));
        }
        updateWishlistCount();
    }
    
    // Update wishlist count in header
    function updateWishlistCount() {
        const wishlistCountElements = document.querySelectorAll('.wishlist-count-badge');
        wishlistCountElements.forEach(el => {
            el.textContent = wishlistItems.length;
            if (wishlistItems.length === 0) {
                el.style.display = 'none';
            } else {
                el.style.display = 'inline-block';
            }
        });
    }
    
    // Add to wishlist
    function addToWishlist(productId, productName, productPrice, productImage, productCategory, productRating, productReviewCount) {
        // Check if already in wishlist
        const exists = wishlistItems.some(item => item.id === productId);
        
        if (exists) {
            showNotification(`${productName} is already in your wishlist`, 'info');
            return false;
        }
        
        const wishlistItem = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            category: productCategory,
            rating: productRating,
            reviewCount: productReviewCount,
            addedAt: new Date().toISOString()
        };
        
        wishlistItems.push(wishlistItem);
        saveWishlist();
        
        // Update button state
        updateWishlistButton(productId, true);
        
        showNotification(`${productName} added to wishlist! ❤️`, 'success');
        return true;
    }
    
    // Remove from wishlist
    function removeFromWishlist(productId) {
        const item = wishlistItems.find(item => item.id === productId);
        const itemName = item ? item.name : 'Item';
        
        wishlistItems = wishlistItems.filter(item => item.id !== productId);
        saveWishlist();
        
        // Update button state
        updateWishlistButton(productId, false);
        
        showNotification(`${itemName} removed from wishlist`, 'info');
        
        // Refresh wishlist page if on wishlist page
        if (window.location.pathname.includes('wishlist.html')) {
            displayWishlistPage();
        }
        
        return true;
    }
    
    // Check if product is in wishlist
    function isInWishlist(productId) {
        return wishlistItems.some(item => item.id === productId);
    }
    
    // Update wishlist button state
    function updateWishlistButton(productId, isActive) {
        const buttons = document.querySelectorAll(`.wishlist-btn[data-id="${productId}"]`);
        buttons.forEach(btn => {
            if (isActive) {
                btn.classList.add('active');
                btn.innerHTML = '<i class="fas fa-heart"></i>';
                btn.title = 'Remove from wishlist';
            } else {
                btn.classList.remove('active');
                btn.innerHTML = '<i class="far fa-heart"></i>';
                btn.title = 'Add to wishlist';
            }
        });
    }
    
    // Initialize wishlist buttons on product cards
    function initWishlistButtons() {
        const buttons = document.querySelectorAll('.wishlist-btn');
        
        buttons.forEach(btn => {
            const productId = parseInt(btn.dataset.id);
            const isActive = isInWishlist(productId);
            
            if (isActive) {
                btn.classList.add('active');
                btn.innerHTML = '<i class="fas fa-heart"></i>';
                btn.title = 'Remove from wishlist';
            } else {
                btn.classList.remove('active');
                btn.innerHTML = '<i class="far fa-heart"></i>';
                btn.title = 'Add to wishlist';
            }
            
            // Remove old listener and add new
            btn.removeEventListener('click', wishlistClickHandler);
            btn.addEventListener('click', wishlistClickHandler);
        });
    }
    
    // Wishlist button click handler
    function wishlistClickHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const btn = this;
        const productId = parseInt(btn.dataset.id);
        const productName = btn.dataset.name;
        const productPrice = parseFloat(btn.dataset.price);
        const productImage = btn.dataset.image;
        const productCategory = btn.dataset.category;
        const productRating = parseFloat(btn.dataset.rating);
        const productReviewCount = parseInt(btn.dataset.reviewCount);
        
        if (isInWishlist(productId)) {
            removeFromWishlist(productId);
        } else {
            addToWishlist(productId, productName, productPrice, productImage, productCategory, productRating, productReviewCount);
        }
    }
    
    // Display wishlist page
    function displayWishlistPage() {
        const container = document.getElementById('wishlistGrid');
        const countElement = document.getElementById('wishlistCount');
        
        if (!container) return;
        
        if (wishlistItems.length === 0) {
            container.innerHTML = `
                <div class="empty-wishlist">
                    <i class="far fa-heart"></i>
                    <h3>Your wishlist is empty</h3>
                    <p>Start adding your favorite herbal products to your wishlist!</p>
                    <a href="shop.html" class="btn btn-primary">Start Shopping</a>
                </div>
            `;
            if (countElement) countElement.textContent = '0 items';
            return;
        }
        
        if (countElement) countElement.textContent = `${wishlistItems.length} ${wishlistItems.length === 1 ? 'item' : 'items'}`;
        
        container.innerHTML = wishlistItems.map(item => `
            <div class="wishlist-card" data-id="${item.id}">
                <button class="wishlist-remove" data-id="${item.id}" title="Remove from wishlist">
                    <i class="fas fa-times"></i>
                </button>
                <div class="wishlist-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    ${item.badge ? `<span class="wishlist-badge">${item.badge}</span>` : ''}
                </div>
                <div class="wishlist-info">
                    <div class="wishlist-category">${item.category.replace(/-/g, ' ')}</div>
                    <a href="product.html?id=${item.id}" class="wishlist-title">${item.name}</a>
                    <div class="wishlist-price">
                        <span class="wishlist-current-price">$${item.price}</span>
                    </div>
                    <div class="wishlist-rating">
                        <div class="wishlist-stars">${generateStars(item.rating)}</div>
                        <span class="wishlist-rating-count">(${item.reviewCount})</span>
                    </div>
                    <div class="wishlist-actions">
                        <button class="btn btn-primary add-to-cart-wishlist" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}">
                            <i class="fas fa-shopping-bag"></i> Add to Cart
                        </button>
                        <button class="btn btn-outline remove-from-wishlist" data-id="${item.id}">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Attach remove button events
        document.querySelectorAll('.wishlist-remove, .remove-from-wishlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = parseInt(btn.dataset.id);
                removeFromWishlist(id);
                displayWishlistPage();
            });
        });
        
        // Attach add to cart events
        document.querySelectorAll('.add-to-cart-wishlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = parseInt(btn.dataset.id);
                const name = btn.dataset.name;
                const price = parseFloat(btn.dataset.price);
                const image = btn.dataset.image;
                
                if (typeof addToCart === 'function') {
                    addToCart(id, name, price, image);
                } else {
                    // Fallback
                    let cart = JSON.parse(localStorage.getItem('rafamall_cart')) || [];
                    const existingItem = cart.find(item => item.id === id);
                    if (existingItem) {
                        existingItem.quantity += 1;
                    } else {
                        cart.push({ id, name, price, image, quantity: 1 });
                    }
                    localStorage.setItem('rafamall_cart', JSON.stringify(cart));
                    if (typeof updateCartCount === 'function') updateCartCount();
                    showNotification(`${name} added to cart!`, 'success');
                }
            });
        });
    }
    
    // Generate star rating
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        let starsHtml = '';
        for (let i = 0; i < fullStars; i++) starsHtml += '<i class="fas fa-star"></i>';
        if (halfStar) starsHtml += '<i class="fas fa-star-half-alt"></i>';
        for (let i = starsHtml.length / 2; i < 5; i++) starsHtml += '<i class="far fa-star"></i>';
        return starsHtml;
    }
    
    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `wishlist-notification`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-heart' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Get wishlist items count
    function getWishlistCount() {
        return wishlistItems.length;
    }
    
    // Get all wishlist items
    function getWishlistItems() {
        return [...wishlistItems];
    }
    
    // Clear wishlist
    function clearWishlist() {
        wishlistItems = [];
        saveWishlist();
        if (window.location.pathname.includes('wishlist.html')) {
            displayWishlistPage();
        }
        showNotification('Wishlist cleared', 'info');
    }
    
    // Initialize wishlist
    function init() {
        loadWishlist();
        initWishlistButtons();
        
        // If on wishlist page, display
        if (window.location.pathname.includes('wishlist.html')) {
            displayWishlistPage();
        }
        
        console.log('Wishlist initialized with', wishlistItems.length, 'items');
    }
    
    // Public API
    return {
        init: init,
        add: addToWishlist,
        remove: removeFromWishlist,
        isInWishlist: isInWishlist,
        getCount: getWishlistCount,
        getItems: getWishlistItems,
        clear: clearWishlist,
        updateButtons: initWishlistButtons
    };
})();

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    Wishlist.init();
});

// Make globally available
window.Wishlist = Wishlist;