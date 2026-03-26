// ============================================
// RafaMall - Blog Page JavaScript
// Blog filtering, search, pagination, newsletter
// ============================================

// ============================================
// Blog Data
// ============================================

const blogPosts = [
    {
        id: 1,
        title: "The Complete Guide to Herbal Wellness: Ancient Wisdom for Modern Living",
        excerpt: "Discover how ancient herbal traditions can transform your modern lifestyle. From adaptogens to herbal teas, learn the fundamentals of incorporating natural remedies into your daily routine.",
        category: "herbalism",
        author: "Dr. Sarah Chen",
        authorImage: "https://placehold.co/100x100/000000/FFFFFF?text=Dr.+Sarah",
        date: "March 20, 2026",
        readTime: 8,
        image: "https://placehold.co/600x400/000000/FFFFFF?text=Herbal+Wellness",
        tags: ["Herbalism", "Wellness", "Guide"],
        featured: true,
        views: 2540
    },
    {
        id: 2,
        title: "10 Adaptogenic Herbs for Stress Relief and Energy",
        excerpt: "Adaptogens are nature's answer to modern stress. Learn about ashwagandha, rhodiola, holy basil, and other powerful herbs that help your body adapt to stress and maintain balance.",
        category: "herbalism",
        author: "Michael Okafor",
        authorImage: "https://placehold.co/100x100/000000/FFFFFF?text=Michael",
        date: "March 15, 2026",
        readTime: 6,
        image: "https://placehold.co/600x400/000000/FFFFFF?text=Adaptogens",
        tags: ["Adaptogens", "Stress Relief", "Energy"],
        featured: false,
        views: 1890
    },
    {
        id: 3,
        title: "The Ultimate Guide to Herbal Teas: Benefits and Brewing Tips",
        excerpt: "From calming chamomile to invigorating peppermint, explore the world of herbal teas. Learn proper brewing techniques and discover which herbs are best for different health concerns.",
        category: "wellness",
        author: "Rafa Adeleke",
        authorImage: "https://placehold.co/100x100/000000/FFFFFF?text=Rafa",
        date: "March 10, 2026",
        readTime: 5,
        image: "https://placehold.co/600x400/000000/FFFFFF?text=Herbal+Teas",
        tags: ["Herbal Tea", "Wellness", "Guide"],
        featured: false,
        views: 3120
    },
    {
        id: 4,
        title: "Essential Oils 101: A Beginner's Guide to Aromatherapy",
        excerpt: "Start your aromatherapy journey with this comprehensive guide to essential oils. Learn about safety, dilution, and the best oils for relaxation, focus, and immune support.",
        category: "wellness",
        author: "Dr. Sarah Chen",
        authorImage: "https://placehold.co/100x100/000000/FFFFFF?text=Dr.+Sarah",
        date: "March 5, 2026",
        readTime: 7,
        image: "https://placehold.co/600x400/000000/FFFFFF?text=Essential+Oils",
        tags: ["Essential Oils", "Aromatherapy", "Wellness"],
        featured: false,
        views: 2230
    },
    {
        id: 5,
        title: "Natural Skincare Routine: Clean Beauty for Radiant Skin",
        excerpt: "Transform your skincare routine with natural, non-toxic products. Learn about ingredients that actually work and how to build a simple, effective routine for glowing skin.",
        category: "skincare",
        author: "Amara Okafor",
        authorImage: "https://placehold.co/100x100/000000/FFFFFF?text=Amara",
        date: "February 28, 2026",
        readTime: 6,
        image: "https://placehold.co/600x400/000000/FFFFFF?text=Natural+Skincare",
        tags: ["Skincare", "Clean Beauty", "Natural"],
        featured: false,
        views: 1670
    },
    {
        id: 6,
        title: "Gut Health: How to Support Digestion with Herbs",
        excerpt: "A healthy gut is the foundation of overall wellness. Discover which herbs support digestion, reduce bloating, and promote a healthy microbiome.",
        category: "nutrition",
        author: "Michael Okafor",
        authorImage: "https://placehold.co/100x100/000000/FFFFFF?text=Michael",
        date: "February 22, 2026",
        readTime: 5,
        image: "https://placehold.co/600x400/000000/FFFFFF?text=Gut+Health",
        tags: ["Digestion", "Gut Health", "Nutrition"],
        featured: false,
        views: 1450
    },
    {
        id: 7,
        title: "Sleep Better Naturally: Herbal Remedies for Insomnia",
        excerpt: "Struggling with sleep? Explore natural herbal remedies like valerian root, passionflower, and lavender that can help you achieve restful, rejuvenating sleep.",
        category: "wellness",
        author: "Dr. Sarah Chen",
        authorImage: "https://placehold.co/100x100/000000/FFFFFF?text=Dr.+Sarah",
        date: "February 18, 2026",
        readTime: 6,
        image: "https://placehold.co/600x400/000000/FFFFFF?text=Sleep+Remedies",
        tags: ["Sleep", "Insomnia", "Relaxation"],
        featured: false,
        views: 1980
    },
    {
        id: 8,
        title: "Ayurvedic Morning Routine for Balanced Living",
        excerpt: "Start your day the Ayurvedic way. Learn about dinacharya practices that promote balance, energy, and vitality from the moment you wake up.",
        category: "lifestyle",
        author: "Rafa Adeleke",
        authorImage: "https://placehold.co/100x100/000000/FFFFFF?text=Rafa",
        date: "February 12, 2026",
        readTime: 7,
        image: "https://placehold.co/600x400/000000/FFFFFF?text=Ayurveda",
        tags: ["Ayurveda", "Lifestyle", "Morning Routine"],
        featured: false,
        views: 1230
    },
    {
        id: 9,
        title: "Immune-Boosting Herbs for Cold and Flu Season",
        excerpt: "Strengthen your immune system naturally with powerful herbs like elderberry, echinacea, and astragalus. Learn how to use them effectively throughout the year.",
        category: "herbalism",
        author: "Dr. Sarah Chen",
        authorImage: "https://placehold.co/100x100/000000/FFFFFF?text=Dr.+Sarah",
        date: "February 5, 2026",
        readTime: 5,
        image: "https://placehold.co/600x400/000000/FFFFFF?text=Immune+Support",
        tags: ["Immunity", "Herbalism", "Cold & Flu"],
        featured: false,
        views: 2760
    }
];

// ============================================
// Blog State Variables
// ============================================

let blogCurrentFilter = 'all';
let blogCurrentPage = 1;
const blogPostsPerPage = 6;
let blogSearchQuery = '';

// ============================================
// Display Blog Posts
// ============================================

function displayBlogPosts() {
    const blogGrid = document.getElementById('blogGrid');
    const loadMoreBtn = document.getElementById('loadMore');
    
    if (!blogGrid) return;
    
    // Filter posts by category and search
    let filteredPosts = [...blogPosts];
    
    // Apply category filter
    if (blogCurrentFilter !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === blogCurrentFilter);
    }
    
    // Apply search filter
    if (blogSearchQuery) {
        filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(blogSearchQuery) || 
            post.excerpt.toLowerCase().includes(blogSearchQuery) ||
            post.tags.some(tag => tag.toLowerCase().includes(blogSearchQuery))
        );
    }
    
    // Sort by date (newest first)
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Update category counts in sidebar
    updateCategoryCounts();
    
    // Pagination
    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / blogPostsPerPage);
    const startIndex = (blogCurrentPage - 1) * blogPostsPerPage;
    const endIndex = startIndex + blogPostsPerPage;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    // Hide/show load more button
    if (loadMoreBtn) {
        if (blogCurrentPage >= totalPages || totalPages === 0) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
    
    // Display no results message
    if (paginatedPosts.length === 0) {
        blogGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No articles found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button onclick="resetBlogFilters()" class="btn btn-outline" style="margin-top: 20px;">Reset Filters</button>
            </div>
        `;
        return;
    }
    
    // Display posts
    blogGrid.innerHTML = paginatedPosts.map(post => `
        <article class="blog-card">
            <div class="blog-card-image">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
                <span class="blog-category">${post.category.charAt(0).toUpperCase() + post.category.slice(1)}</span>
            </div>
            <div class="blog-card-content">
                <div class="post-meta">
                    <span><i class="far fa-calendar"></i> ${post.date}</span>
                    <span><i class="far fa-clock"></i> ${post.readTime} min read</span>
                    <span><i class="far fa-eye"></i> ${post.views} views</span>
                </div>
                <h3><a href="blog-post.html?id=${post.id}">${post.title}</a></h3>
                <p>${post.excerpt}</p>
                <div class="post-footer">
                    <div class="post-author">
                        <img src="${post.authorImage}" alt="${post.author}">
                        <span>${post.author}</span>
                    </div>
                    <a href="blog-post.html?id=${post.id}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        </article>
    `).join('');
}

// ============================================
// Update Category Counts in Sidebar
// ============================================

function updateCategoryCounts() {
    const categories = ['all', 'herbalism', 'wellness', 'nutrition', 'skincare', 'lifestyle'];
    
    categories.forEach(cat => {
        const count = cat === 'all' 
            ? blogPosts.length 
            : blogPosts.filter(p => p.category === cat).length;
        
        const link = document.querySelector(`.category-list a[data-category="${cat}"] span`);
        if (link) {
            link.textContent = `(${count})`;
        }
    });
}

// ============================================
// Display Popular Posts in Sidebar
// ============================================

function displayPopularPosts() {
    const popularContainer = document.getElementById('popularPosts');
    if (!popularContainer) return;
    
    const popularPosts = [...blogPosts]
        .sort((a, b) => b.views - a.views)
        .slice(0, 3);
    
    popularContainer.innerHTML = popularPosts.map(post => `
        <div class="popular-post">
            <img src="${post.image}" alt="${post.title}">
            <div class="popular-post-info">
                <h4><a href="blog-post.html?id=${post.id}">${post.title}</a></h4>
                <span><i class="far fa-calendar"></i> ${post.date}</span>
            </div>
        </div>
    `).join('');
}

// ============================================
// Setup Blog Filters (Category Tabs)
// ============================================

function setupBlogFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            blogCurrentFilter = filter;
            blogCurrentPage = 1;
            blogSearchQuery = '';
            
            // Clear search input
            const searchInput = document.getElementById('blogSearch');
            if (searchInput) searchInput.value = '';
            
            // Update active state on buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update active state on category list
            document.querySelectorAll('.category-list a').forEach(link => {
                if (link.dataset.category === filter) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            
            displayBlogPosts();
            
            // Smooth scroll to top of blog grid
            const blogGrid = document.getElementById('blogGrid');
            if (blogGrid) {
                blogGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ============================================
// Setup Category Links (Sidebar)
// ============================================

function setupCategoryLinks() {
    const categoryLinks = document.querySelectorAll('.category-list a');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            blogCurrentFilter = category;
            blogCurrentPage = 1;
            blogSearchQuery = '';
            
            // Clear search input
            const searchInput = document.getElementById('blogSearch');
            if (searchInput) searchInput.value = '';
            
            // Update filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                if (btn.dataset.filter === category) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Update category links
            categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            displayBlogPosts();
            
            // Smooth scroll to top of blog grid
            const blogGrid = document.getElementById('blogGrid');
            if (blogGrid) {
                blogGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ============================================
// Setup Blog Search
// ============================================

function setupBlogSearch() {
    const searchInput = document.getElementById('blogSearch');
    const searchBtn = document.getElementById('blogSearchBtn');
    
    if (!searchInput) return;
    
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        blogSearchQuery = query;
        blogCurrentPage = 1;
        
        // Reset filter to 'all' when searching
        if (query) {
            blogCurrentFilter = 'all';
            
            // Update UI to show 'All' as active
            document.querySelectorAll('.filter-btn').forEach(btn => {
                if (btn.dataset.filter === 'all') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            document.querySelectorAll('.category-list a').forEach(link => {
                if (link.dataset.category === 'all') {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
        
        displayBlogPosts();
    }
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

// ============================================
// Setup Load More Button
// ============================================

function setupLoadMore() {
    const loadMoreBtn = document.getElementById('loadMore');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', () => {
        blogCurrentPage++;
        displayBlogPosts();
        
        // Smooth scroll to new posts
        const blogGrid = document.getElementById('blogGrid');
        if (blogGrid && blogGrid.lastChild) {
            blogGrid.lastChild.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// ============================================
// Reset Blog Filters
// ============================================

function resetBlogFilters() {
    blogCurrentFilter = 'all';
    blogCurrentPage = 1;
    blogSearchQuery = '';
    
    // Clear search input
    const searchInput = document.getElementById('blogSearch');
    if (searchInput) searchInput.value = '';
    
    // Update UI
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === 'all') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    document.querySelectorAll('.category-list a').forEach(link => {
        if (link.dataset.category === 'all') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    displayBlogPosts();
}

// Make resetBlogFilters available globally
window.resetBlogFilters = resetBlogFilters;

// ============================================
// Setup Blog Newsletter
// ============================================

function setupBlogNewsletter() {
    const newsletterForms = ['blogNewsletter', 'blogFooterNewsletter'];
    
    newsletterForms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = form.querySelector('input[type="email"]');
                const email = emailInput.value.trim();
                
                if (!email) {
                    showNotification('Please enter your email address', 'error');
                    return;
                }
                
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showNotification('Please enter a valid email address', 'error');
                    return;
                }
                
                // Save to localStorage
                const subscribers = JSON.parse(localStorage.getItem('rafamall_blog_subscribers')) || [];
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('rafamall_blog_subscribers', JSON.stringify(subscribers));
                }
                
                showNotification('Thanks for subscribing to our blog! 📚', 'success');
                form.reset();
            });
        }
    });
}

// ============================================
// Setup Tags Cloud
// ============================================

function setupTagsCloud() {
    const tagsContainer = document.querySelector('.tags-cloud');
    if (!tagsContainer) return;
    
    // Get all unique tags from blog posts
    const allTags = [];
    blogPosts.forEach(post => {
        post.tags.forEach(tag => {
            if (!allTags.includes(tag)) {
                allTags.push(tag);
            }
        });
    });
    
    // Display tags
    tagsContainer.innerHTML = allTags.map(tag => `
        <a href="#" data-tag="${tag.toLowerCase()}">${tag}</a>
    `).join('');
    
    // Add click handlers
    tagsContainer.querySelectorAll('a').forEach(tagLink => {
        tagLink.addEventListener('click', (e) => {
            e.preventDefault();
            const tag = tagLink.dataset.tag;
            blogSearchQuery = tag;
            blogCurrentPage = 1;
            blogCurrentFilter = 'all';
            
            // Update search input
            const searchInput = document.getElementById('blogSearch');
            if (searchInput) searchInput.value = tag;
            
            // Update UI
            document.querySelectorAll('.filter-btn').forEach(btn => {
                if (btn.dataset.filter === 'all') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            displayBlogPosts();
        });
    });
}

// ============================================
// Initialize Blog Page
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Blog page JS loaded');
    
    // Display blog posts
    displayBlogPosts();
    
    // Display popular posts in sidebar
    displayPopularPosts();
    
    // Setup filters and interactions
    setupBlogFilters();
    setupCategoryLinks();
    setupBlogSearch();
    setupLoadMore();
    setupBlogNewsletter();
    setupTagsCloud();
    
    // Check for category from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam && ['herbalism', 'wellness', 'nutrition', 'skincare', 'lifestyle'].includes(categoryParam)) {
        blogCurrentFilter = categoryParam;
        displayBlogPosts();
        
        // Update active UI
        document.querySelectorAll('.filter-btn').forEach(btn => {
            if (btn.dataset.filter === categoryParam) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Check for tag from URL parameter
    const tagParam = urlParams.get('tag');
    if (tagParam) {
        blogSearchQuery = tagParam;
        const searchInput = document.getElementById('blogSearch');
        if (searchInput) searchInput.value = tagParam;
        displayBlogPosts();
    }
});