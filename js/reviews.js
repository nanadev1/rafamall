/* ============================================
   RafaMall - Product Review System
   Standalone JS for Reviews
   ============================================ */

// Review Data Storage
const ReviewSystem = (function() {
    // Private variables
    let modal = null;
    let currentProduct = null;
    let currentFilter = 'all';
    let currentPage = 1;
    let reviewsPerPage = 5;
    let allReviews = [];
    
    // Sample review data
    const sampleReviews = [
        {
            id: 1,
            productId: 1,
            reviewerName: "Sarah Johnson",
            reviewerEmail: "sarah@example.com",
            rating: 5,
            title: "Absolutely amazing!",
            content: "This chamomile tea is the best I've ever had. So soothing and relaxing. Highly recommend!",
            date: "2026-03-20",
            verified: true,
            helpful: 24,
            helpfulUsers: []
        },
        {
            id: 2,
            productId: 1,
            reviewerName: "Michael Chen",
            reviewerEmail: "michael@example.com",
            rating: 4,
            title: "Great quality tea",
            content: "Very fresh and aromatic. Helps me sleep better. Will buy again.",
            date: "2026-03-18",
            verified: true,
            helpful: 12,
            helpfulUsers: []
        },
        {
            id: 3,
            productId: 1,
            reviewerName: "Emily Davis",
            reviewerEmail: "emily@example.com",
            rating: 5,
            title: "Perfect for bedtime",
            content: "I drink this every night before bed. It's become a wonderful ritual. The quality is exceptional.",
            date: "2026-03-15",
            verified: true,
            helpful: 8,
            helpfulUsers: []
        },
        {
            id: 4,
            productId: 1,
            reviewerName: "David Wilson",
            reviewerEmail: "david@example.com",
            rating: 3,
            title: "Good but not great",
            content: "The tea is decent but I expected more flavor. Might try a different brand next time.",
            date: "2026-03-10",
            verified: false,
            helpful: 3,
            helpfulUsers: []
        },
        {
            id: 5,
            productId: 1,
            reviewerName: "Lisa Anderson",
            reviewerEmail: "lisa@example.com",
            rating: 5,
            title: "Love it!",
            content: "So calming and delicious. The packaging is beautiful too.",
            date: "2026-03-05",
            verified: true,
            helpful: 15,
            helpfulUsers: []
        }
    ];
    
    // Initialize reviews
    function init() {
        createModal();
        loadReviews();
        setupEventListeners();
        console.log('Review system initialized');
    }
    
    // Create modal HTML
    function createModal() {
        if (document.getElementById('reviewModal')) return;
        
        const modalHTML = `
            <div id="reviewModal" class="review-modal">
                <div class="review-overlay"></div>
                <div class="review-container">
                    <div class="review-content">
                        <button class="review-close" id="reviewClose">
                            <i class="fas fa-times"></i>
                        </button>
                        <div id="reviewBody" class="review-body">
                            <div class="review-loading">
                                <div class="spinner"></div>
                                <p>Loading reviews...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById('reviewModal');
    }
    
    // Load reviews from localStorage
    function loadReviews() {
        const stored = localStorage.getItem('rafamall_reviews');
        if (stored) {
            allReviews = JSON.parse(stored);
        } else {
            allReviews = [...sampleReviews];
            localStorage.setItem('rafamall_reviews', JSON.stringify(allReviews));
        }
    }
    
    // Save reviews to localStorage
    function saveReviews() {
        localStorage.setItem('rafamall_reviews', JSON.stringify(allReviews));
    }
    
    // Open reviews for product
    function open(productId, productName, productImage) {
        currentProduct = {
            id: productId,
            name: productName,
            image: productImage
        };
        currentFilter = 'all';
        currentPage = 1;
        
        modal = document.getElementById('reviewModal');
        if (!modal) createModal();
        modal = document.getElementById('reviewModal');
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        loadReviewContent();
    }
    
    // Load review content
    function loadReviewContent() {
        const body = document.getElementById('reviewBody');
        if (!body) return;
        
        const productReviews = getProductReviews();
        const stats = calculateStats(productReviews);
        
        body.innerHTML = `
            ${generateProductHeader()}
            ${generateRatingSummary(stats, productReviews.length)}
            ${generateReviewFilters()}
            <div class="reviews-list" id="reviewsList">
                ${generateReviewsList()}
            </div>
            ${generatePagination(productReviews.length)}
            ${generateWriteReviewForm()}
        `;
        
        setupFilterEvents();
        setupPaginationEvents(productReviews.length);
        setupHelpfulButtons();
        setupRatingStars();
    }
    
    // Get product reviews
    function getProductReviews() {
        let reviews = allReviews.filter(r => r.productId === currentProduct.id);
        
        // Apply filter
        if (currentFilter !== 'all') {
            const minRating = parseInt(currentFilter);
            reviews = reviews.filter(r => r.rating >= minRating);
        }
        
        // Sort by date (newest first)
        reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return reviews;
    }
    
    // Calculate review statistics
    function calculateStats(reviews) {
        const total = reviews.length;
        if (total === 0) {
            return { average: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
        }
        
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        const average = sum / total;
        
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(r => {
            distribution[r.rating]++;
        });
        
        return { average, distribution, total };
    }
    
    // Generate product header
    function generateProductHeader() {
        return `
            <div class="review-product-header">
                <div class="review-product-image">
                    <img src="${currentProduct.image || 'https://placehold.co/80x80/000000/FFFFFF?text=Product'}" alt="${currentProduct.name}">
                </div>
                <div class="review-product-info">
                    <h3>${currentProduct.name}</h3>
                    <p>Customer Reviews</p>
                </div>
            </div>
        `;
    }
    
    // Generate rating summary
    function generateRatingSummary(stats, totalReviews) {
        const average = stats.average.toFixed(1);
        const fullStars = Math.floor(stats.average);
        const halfStar = stats.average % 1 >= 0.5;
        let starsHtml = '';
        for (let i = 0; i < fullStars; i++) starsHtml += '<i class="fas fa-star"></i>';
        if (halfStar) starsHtml += '<i class="fas fa-star-half-alt"></i>';
        for (let i = starsHtml.length / 2; i < 5; i++) starsHtml += '<i class="far fa-star"></i>';
        
        let barsHtml = '';
        for (let rating = 5; rating >= 1; rating--) {
            const count = stats.distribution[rating];
            const percentage = totalReviews > 0 ? (count / totalReviews * 100) : 0;
            barsHtml += `
                <div class="rating-bar-item">
                    <div class="rating-bar-label">${rating} ★</div>
                    <div class="rating-bar-bg">
                        <div class="rating-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="rating-bar-percent">${Math.round(percentage)}%</div>
                </div>
            `;
        }
        
        return `
            <div class="rating-summary">
                <div class="average-rating">
                    <div class="rating-number">${average}</div>
                    <div class="rating-stars">${starsHtml}</div>
                    <div class="rating-count">${totalReviews} reviews</div>
                </div>
                <div class="rating-bars">
                    ${barsHtml}
                </div>
            </div>
        `;
    }
    
    // Generate review filters
    function generateReviewFilters() {
        const filters = [
            { value: 'all', label: 'All Stars' },
            { value: '5', label: '5 ★' },
            { value: '4', label: '4 ★ & up' },
            { value: '3', label: '3 ★ & up' },
            { value: '2', label: '2 ★ & up' },
            { value: '1', label: '1 ★ & up' }
        ];
        
        return `
            <div class="review-filters">
                ${filters.map(filter => `
                    <button class="filter-btn ${currentFilter === filter.value ? 'active' : ''}" data-filter="${filter.value}">
                        ${filter.label}
                    </button>
                `).join('')}
            </div>
        `;
    }
    
    // Generate reviews list
    function generateReviewsList() {
        let reviews = getProductReviews();
        const totalPages = Math.ceil(reviews.length / reviewsPerPage);
        const start = (currentPage - 1) * reviewsPerPage;
        const paginatedReviews = reviews.slice(start, start + reviewsPerPage);
        
        if (paginatedReviews.length === 0) {
            return `
                <div class="no-reviews">
                    <i class="fas fa-comment-slash"></i>
                    <p>No reviews yet. Be the first to review this product!</p>
                </div>
            `;
        }
        
        return paginatedReviews.map(review => `
            <div class="review-card" data-review-id="${review.id}">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">${review.reviewerName.charAt(0)}</div>
                        <div>
                            <div class="reviewer-name">${review.reviewerName}</div>
                            <div class="review-date">${formatDate(review.date)}</div>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${generateStarRating(review.rating)}
                    </div>
                </div>
                <div class="review-title">${escapeHtml(review.title)}</div>
                <div class="review-content">${escapeHtml(review.content)}</div>
                ${review.verified ? '<div class="review-verified"><i class="fas fa-check-circle"></i> Verified Purchase</div>' : ''}
                <div class="review-helpful">
                    <button class="helpful-btn" data-review-id="${review.id}" data-helpful="${review.helpful}">
                        <i class="far fa-thumbs-up"></i> Helpful (${review.helpful})
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Generate pagination
    function generatePagination(totalReviews) {
        const totalPages = Math.ceil(totalReviews / reviewsPerPage);
        if (totalPages <= 1) return '';
        
        let paginationHtml = '<div class="review-pagination">';
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `
                <button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }
        paginationHtml += '</div>';
        
        return paginationHtml;
    }
    
    // Generate write review form
    function generateWriteReviewForm() {
        return `
            <div class="write-review">
                <h4>Write a Review</h4>
                <form id="reviewForm" class="review-form">
                    <div class="form-group">
                        <label>Your Rating *</label>
                        <div class="rating-select" id="ratingSelect">
                            ${[1,2,3,4,5].map(star => `
                                <i class="far fa-star rating-star-input" data-rating="${star}"></i>
                            `).join('')}
                        </div>
                        <input type="hidden" id="reviewRating" value="0">
                    </div>
                    <div class="form-group">
                        <label>Review Title *</label>
                        <input type="text" id="reviewTitle" placeholder="Summarize your experience" required>
                    </div>
                    <div class="form-group">
                        <label>Your Review *</label>
                        <textarea id="reviewContent" rows="4" placeholder="Share your experience with this product" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Your Name *</label>
                        <input type="text" id="reviewerName" placeholder="Enter your name" required>
                    </div>
                    <div class="form-group">
                        <label>Your Email *</label>
                        <input type="email" id="reviewerEmail" placeholder="Enter your email" required>
                    </div>
                    <button type="submit" class="btn btn-primary submit-review">Submit Review</button>
                </form>
            </div>
        `;
    }
    
    // Generate star rating HTML
    function generateStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }
    
    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    
    // Escape HTML
    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    
    // Setup filter events
    function setupFilterEvents() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentFilter = btn.dataset.filter;
                currentPage = 1;
                loadReviewContent();
            });
        });
    }
    
    // Setup pagination events
    function setupPaginationEvents(totalReviews) {
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentPage = parseInt(btn.dataset.page);
                loadReviewContent();
            });
        });
    }
    
    // Setup helpful buttons
    function setupHelpfulButtons() {
        document.querySelectorAll('.helpful-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const reviewId = parseInt(btn.dataset.reviewId);
                const review = allReviews.find(r => r.id === reviewId);
                if (review) {
                    review.helpful++;
                    saveReviews();
                    loadReviewContent();
                }
            });
        });
    }
    
    // Setup rating stars
    function setupRatingStars() {
        const stars = document.querySelectorAll('.rating-star-input');
        const ratingInput = document.getElementById('reviewRating');
        
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.dataset.rating);
                ratingInput.value = rating;
                
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });
            
            star.addEventListener('mouseenter', () => {
                const rating = parseInt(star.dataset.rating);
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    }
                });
            });
            
            star.addEventListener('mouseleave', () => {
                const currentRating = parseInt(ratingInput.value);
                stars.forEach((s, index) => {
                    if (index < currentRating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });
        });
    }
    
    // Submit review
    function submitReview(event) {
        event.preventDefault();
        
        const rating = parseInt(document.getElementById('reviewRating').value);
        const title = document.getElementById('reviewTitle').value.trim();
        const content = document.getElementById('reviewContent').value.trim();
        const reviewerName = document.getElementById('reviewerName').value.trim();
        const reviewerEmail = document.getElementById('reviewerEmail').value.trim();
        
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }
        
        if (!title || !content || !reviewerName || !reviewerEmail) {
            alert('Please fill in all fields');
            return;
        }
        
        const newReview = {
            id: Date.now(),
            productId: currentProduct.id,
            reviewerName: reviewerName,
            reviewerEmail: reviewerEmail,
            rating: rating,
            title: title,
            content: content,
            date: new Date().toISOString().split('T')[0],
            verified: false,
            helpful: 0,
            helpfulUsers: []
        };
        
        allReviews.push(newReview);
        saveReviews();
        
        // Reset form
        document.getElementById('reviewForm').reset();
        document.getElementById('reviewRating').value = 0;
        document.querySelectorAll('.rating-star-input').forEach(star => {
            star.classList.remove('fas');
            star.classList.add('far');
        });
        
        // Reload content
        loadReviewContent();
        
        alert('Thank you for your review!');
    }
    
    // Close modal
    function close() {
        const modal = document.getElementById('reviewModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.review-close')) {
                close();
            }
            if (e.target.closest('.review-overlay')) {
                close();
            }
        });
        
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'reviewForm') {
                e.preventDefault();
                submitReview(e);
            }
        });
    }
    
    // Public API
    return {
        init: init,
        open: open,
        close: close
    };
})();

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    ReviewSystem.init();
    
    // Add click handlers to view reviews buttons
    document.querySelectorAll('.view-reviews-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(btn.dataset.productId);
            const productCard = btn.closest('.product-card');
            const productName = productCard?.querySelector('h3')?.textContent || 'Product';
            const productImage = productCard?.querySelector('img')?.src || '';
            ReviewSystem.open(productId, productName, productImage);
        });
    });
});

// Make globally available
window.ReviewSystem = ReviewSystem;