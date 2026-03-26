// ============================================
// RafaMall - Blog Post Page JavaScript
// Single article loading, comments, related posts, sharing
// ============================================

// ============================================
// Blog Posts Data (Same as blog.js)
// ============================================

const blogPostsData = [
    {
        id: 1,
        title: "The Complete Guide to Herbal Wellness: Ancient Wisdom for Modern Living",
        excerpt: "Discover how ancient herbal traditions can transform your modern lifestyle. From adaptogens to herbal teas, learn the fundamentals of incorporating natural remedies into your daily routine.",
        content: `
            <p>For thousands of years, cultures around the world have turned to plants for healing. Today, modern science is validating what traditional healers have always known: herbs are powerful allies for our health.</p>
            
            <h2>What Are Herbal Remedies?</h2>
            <p>Herbal remedies use plants or plant extracts to support health and treat ailments. Unlike pharmaceutical drugs that often target single symptoms, herbs work holistically, supporting the body's natural healing processes.</p>
            
            <h2>The Rise of Adaptogens</h2>
            <p>Adaptogens are a class of herbs that help the body adapt to stress. These powerful plants work by modulating the stress response system, helping you maintain balance even during challenging times.</p>
            <p>Popular adaptogens include:</p>
            <ul>
                <li><strong>Ashwagandha:</strong> Reduces cortisol levels and promotes calm energy</li>
                <li><strong>Rhodiola:</strong> Fights fatigue and enhances mental performance</li>
                <li><strong>Holy Basil (Tulsi):</strong> Supports immune function and reduces anxiety</li>
                <li><strong>Maca Root:</strong> Boosts energy and hormonal balance</li>
            </ul>
            
            <h2>Getting Started with Herbalism</h2>
            <p>Starting your herbal journey doesn't have to be overwhelming. Begin with one or two herbs that address your primary concerns. Always consult with a healthcare provider before starting any new herbal regimen, especially if you're pregnant, nursing, or taking medications.</p>
            
            <blockquote>
                "Let food be thy medicine and medicine be thy food." — Hippocrates
            </blockquote>
            
            <h2>Quality Matters</h2>
            <p>Not all herbs are created equal. When selecting herbal products, look for organic certification, third-party testing, and transparent sourcing practices. At RafaMall, we partner with farmers who prioritize sustainable cultivation and ethical harvesting.</p>
        `,
        category: "herbalism",
        author: "Dr. Sarah Chen",
        authorImage: "https://placehold.co/100x100/000000/FFFFFF?text=Dr.+Sarah",
        authorBio: "PhD in Pharmacognosy with 15+ years of experience in botanical medicine research and quality control. Dr. Chen has published over 30 peer-reviewed articles on herbal therapeutics.",
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
        content: `
            <p>In our fast-paced world, stress has become a constant companion for many. Adaptogenic herbs offer a natural way to support your body's stress response and maintain energy throughout the day.</p>
            
            <h2>Top 10 Adaptogenic Herbs</h2>
            <ol>
                <li><strong>Ashwagandha:</strong> The king of adaptogens, excellent for anxiety and sleep</li>
                <li><strong>Rhodiola Rosea:</strong> Perfect for mental clarity and physical endurance</li>
                <li><strong>Holy Basil (Tulsi):</strong> Supports immune function and respiratory health</li>
                <li><strong>Maca Root:</strong> Boosts energy, libido, and hormonal balance</li>
                <li><strong>Schisandra Berry:</strong> Supports liver function and mental focus</li>
                <li><strong>Eleuthero (Siberian Ginseng):</strong> Increases stamina and resilience</li>
                <li><strong>Cordyceps:</strong> Enhances athletic performance and oxygen utilization</li>
                <li><strong>Reishi Mushroom:</strong> Promotes calm and immune modulation</li>
                <li><strong>Lion's Mane:</strong> Supports cognitive function and nerve health</li>
                <li><strong>Astragalus:</strong> Strengthens immune system and vitality</li>
            </ol>
            
            <h2>How to Use Adaptogens</h2>
            <p>Adaptogens work best when taken consistently over time. Most are available as powders, capsules, or tinctures. Start with a lower dose and gradually increase as your body adapts. Morning is often best for energizing adaptogens like rhodiola and maca, while calming herbs like ashwagandha and reishi are better suited for evening use.</p>
        `,
        category: "herbalism",
        author: "Michael Okafor",
        authorImage: "https://placehold.co/100x100/000000/FFFFFF?text=Michael",
        authorBio: "Sustainability expert and herbalist dedicated to ethical sourcing and traditional African medicine. Michael works directly with farming communities across West Africa.",
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
        content: `
            <p>Herbal teas offer a simple, enjoyable way to incorporate the benefits of herbs into your daily routine. From calming chamomile to invigorating peppermint, there's a tea for every mood and ailment.</p>
            
            <h2>Popular Herbal Teas and Their Benefits</h2>
            <ul>
                <li><strong>Chamomile:</strong> Calming, sleep support, digestive aid</li>
                <li><strong>Peppermint:</strong> Digestive relief, headache relief, mental clarity</li>
                <li><strong>Ginger:</strong> Anti-inflammatory, nausea relief, immune support</li>
                <li><strong>Echinacea:</strong> Immune boosting, cold and flu prevention</li>
                <li><strong>Hibiscus:</strong> Blood pressure support, rich in antioxidants</li>
                <li><strong>Rooibos:</strong> Rich in minerals, supports bone health</li>
                <li><strong>Lemon Balm:</strong> Anxiety relief, sleep support, antiviral</li>
            </ul>
            
            <h2>Brewing Tips for Perfect Herbal Tea</h2>
            <p>Unlike traditional tea, herbal teas (tisanes) don't contain caffeine and can be steeped longer without becoming bitter. Use fresh, filtered water heated to just below boiling. Steep for 5-10 minutes, covered, to preserve volatile essential oils. For stronger medicinal benefits, consider using double the amount of herbs and steeping for 15 minutes.</p>
        `,
        category: "wellness",
        author: "Rafa Adeleke",
        authorImage: "https://placehold.co/100x100/000000/FFFFFF?text=Rafa",
        authorBio: "Founder of RafaMall and certified herbalist passionate about making natural wellness accessible. Rafa has been studying herbal medicine for over a decade.",
        date: "March 10, 2026",
        readTime: 5,
        image: "https://placehold.co/600x400/000000/FFFFFF?text=Herbal+Teas",
        tags: ["Herbal Tea", "Wellness", "Guide"],
        featured: false,
        views: 3120
    }
];

// ============================================
// Load Blog Post by ID
// ============================================

function loadBlogPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id'));
    
    const articleContent = document.getElementById('articleContent');
    const authorWidget = document.getElementById('authorWidget');
    const commentsSection = document.getElementById('commentsSection');
    const relatedPosts = document.getElementById('relatedPosts');
    
    if (!articleContent) return;
    
    if (!postId || isNaN(postId)) {
        articleContent.innerHTML = `
            <div class="not-found">
                <i class="fas fa-leaf"></i>
                <h2>Article Not Found</h2>
                <p>The article you're looking for doesn't exist.</p>
                <a href="blog.html" class="btn btn-primary">Back to Blog</a>
            </div>
        `;
        return;
    }
    
    const post = blogPostsData.find(p => p.id === postId);
    
    if (!post) {
        articleContent.innerHTML = `
            <div class="not-found">
                <i class="fas fa-leaf"></i>
                <h2>Article Not Found</h2>
                <p>The article you requested could not be found.</p>
                <a href="blog.html" class="btn btn-primary">Browse Articles</a>
            </div>
        `;
        return;
    }
    
    // Update page title
    document.title = `${post.title} - RafaMall Blog`;
    
    // Generate article HTML
    generateArticleHTML(post);
    
    // Generate table of contents
    setTimeout(() => generateTableOfContents(), 100);
    
    // Load author widget
    loadAuthorWidget(post);
    
    // Load popular posts
    loadPopularPostsSidebar();
    
    // Load related posts
    loadRelatedPosts(post);
    
    // Load comments
    loadComments(postId);
    
    // Show sections
    if (authorWidget) authorWidget.style.display = 'block';
    if (commentsSection) commentsSection.style.display = 'block';
    if (relatedPosts) relatedPosts.style.display = 'block';
    
    // Increment view count
    incrementViewCount(postId);
}

// ============================================
// Generate Article HTML
// ============================================

function generateArticleHTML(post) {
    const articleContent = document.getElementById('articleContent');
    if (!articleContent) return;
    
    articleContent.innerHTML = `
        <article class="blog-article">
            <div class="article-header">
                <span class="article-category">${post.category.charAt(0).toUpperCase() + post.category.slice(1)}</span>
                <h1>${post.title}</h1>
                <div class="article-meta">
                    <div class="article-author">
                        <img src="${post.authorImage}" alt="${post.author}">
                        <div>
                            <span>Written by</span>
                            <strong>${post.author}</strong>
                        </div>
                    </div>
                    <div class="article-stats">
                        <span><i class="far fa-calendar"></i> ${post.date}</span>
                        <span><i class="far fa-clock"></i> ${post.readTime} min read</span>
                        <span><i class="far fa-eye"></i> ${post.views} views</span>
                    </div>
                </div>
            </div>
            <div class="article-featured-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="article-content">
                ${post.content}
            </div>
            <div class="article-tags">
                <span>Tags:</span>
                ${post.tags.map(tag => `<a href="blog.html?tag=${tag.toLowerCase()}">#${tag}</a>`).join('')}
            </div>
            <div class="article-share">
                <span>Share this article:</span>
                <div class="share-buttons">
                    <a href="#" onclick="shareOnFacebook()"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" onclick="shareOnTwitter()"><i class="fab fa-twitter"></i></a>
                    <a href="#" onclick="shareOnLinkedIn()"><i class="fab fa-linkedin-in"></i></a>
                    <a href="#" onclick="copyArticleLink()"><i class="fas fa-link"></i></a>
                </div>
            </div>
        </article>
    `;
}

// ============================================
// Generate Table of Contents
// ============================================

function generateTableOfContents() {
    const tocContainer = document.getElementById('tableOfContents');
    if (!tocContainer) return;
    
    setTimeout(() => {
        const headings = document.querySelectorAll('.article-content h2, .article-content h3');
        if (headings.length > 0) {
            tocContainer.innerHTML = headings.map(heading => {
                const id = heading.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                heading.id = id;
                const indent = heading.tagName === 'H3' ? 'margin-left: 20px;' : '';
                return `<li style="${indent}"><a href="#${id}">${heading.textContent}</a></li>`;
            }).join('');
        } else {
            tocContainer.innerHTML = '<li>No sections available</li>';
        }
    }, 100);
}

// ============================================
// Load Author Widget
// ============================================

function loadAuthorWidget(post) {
    const authorWidget = document.getElementById('authorWidget');
    if (!authorWidget) return;
    
    const authorImage = document.getElementById('authorImage');
    const authorName = document.getElementById('authorName');
    const authorBio = document.getElementById('authorBio');
    
    if (authorImage) authorImage.src = post.authorImage;
    if (authorName) authorName.textContent = post.author;
    if (authorBio) authorBio.textContent = post.authorBio || 'Expert in herbal medicine and natural wellness.';
}

// ============================================
// Load Popular Posts in Sidebar
// ============================================

function loadPopularPostsSidebar() {
    const container = document.getElementById('popularPostsSidebar');
    if (!container) return;
    
    const popular = [...blogPostsData].sort((a, b) => b.views - a.views).slice(0, 3);
    
    container.innerHTML = popular.map(post => `
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
// Load Related Posts
// ============================================

function loadRelatedPosts(currentPost) {
    const container = document.getElementById('relatedGrid');
    if (!container) return;
    
    const related = blogPostsData
        .filter(p => p.category === currentPost.category && p.id !== currentPost.id)
        .slice(0, 3);
    
    if (related.length === 0) {
        container.innerHTML = '<p>No related posts found.</p>';
        return;
    }
    
    container.innerHTML = related.map(post => `
        <div class="related-card">
            <div class="related-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="related-content">
                <span class="related-category">${post.category}</span>
                <h4><a href="blog-post.html?id=${post.id}">${post.title}</a></h4>
                <div class="related-meta">
                    <span><i class="far fa-calendar"></i> ${post.date}</span>
                    <span><i class="far fa-clock"></i> ${post.readTime} min read</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// Load Comments
// ============================================

function loadComments(postId) {
    const commentsContainer = document.getElementById('commentsList');
    const commentCountSpan = document.getElementById('commentCount');
    
    // Load comments from localStorage
    const allComments = JSON.parse(localStorage.getItem('rafamall_blog_comments')) || [];
    const postComments = allComments.filter(c => c.postId === postId);
    
    if (commentCountSpan) commentCountSpan.textContent = `(${postComments.length})`;
    
    if (postComments.length === 0) {
        commentsContainer.innerHTML = '<p class="no-comments">Be the first to comment on this article!</p>';
    } else {
        commentsContainer.innerHTML = postComments.map(comment => `
            <div class="comment">
                <div class="comment-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <strong>${escapeHtml(comment.name)}</strong>
                        <span><i class="far fa-calendar"></i> ${comment.date}</span>
                    </div>
                    <p>${escapeHtml(comment.message)}</p>
                </div>
            </div>
        `).join('');
    }
    
    // Setup comment form
    setupCommentForm(postId);
}

// ============================================
// Setup Comment Form
// ============================================

function setupCommentForm(postId) {
    const commentForm = document.getElementById('commentForm');
    if (!commentForm) return;
    
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('commentName').value.trim();
        const email = document.getElementById('commentEmail').value.trim();
        const message = document.getElementById('commentMessage').value.trim();
        
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        const newComment = {
            postId: postId,
            name: name,
            email: email,
            message: message,
            date: new Date().toLocaleDateString(),
            timestamp: Date.now()
        };
        
        // Save comment
        const allComments = JSON.parse(localStorage.getItem('rafamall_blog_comments')) || [];
        allComments.push(newComment);
        localStorage.setItem('rafamall_blog_comments', JSON.stringify(allComments));
        
        // Clear form
        commentForm.reset();
        
        // Reload comments
        loadComments(postId);
        
        showNotification('Comment posted successfully!', 'success');
    });
}

// ============================================
// Increment View Count
// ============================================

function incrementViewCount(postId) {
    const posts = JSON.parse(localStorage.getItem('rafamall_blog_views')) || {};
    const postKey = `post_${postId}`;
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    if (!posts[postKey] || (now - (posts[postKey].lastView || 0)) > oneHour) {
        posts[postKey] = {
            views: (posts[postKey]?.views || 0) + 1,
            lastView: now
        };
        localStorage.setItem('rafamall_blog_views', JSON.stringify(posts));
        
        // Update display if view count element exists
        const viewElement = document.querySelector('.article-stats span:last-child');
        if (viewElement) {
            const currentViews = parseInt(viewElement.textContent) || 0;
            viewElement.innerHTML = `<i class="far fa-eye"></i> ${currentViews + 1} views`;
        }
    }
}

// ============================================
// Share Functions
// ============================================

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
}

function shareOnTwitter() {
    const title = encodeURIComponent(document.querySelector('.article-header h1')?.textContent || 'Check out this article');
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, '_blank', 'width=600,height=400');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}`, '_blank', 'width=600,height=400');
}

function copyArticleLink() {
    navigator.clipboard.writeText(window.location.href);
    showNotification('Link copied to clipboard!', 'success');
}

// ============================================
// Utility Functions
// ============================================

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// Initialize Blog Post Page
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Blog post page JS loaded');
    loadBlogPost();
});

// Make share functions global
window.shareOnFacebook = shareOnFacebook;
window.shareOnTwitter = shareOnTwitter;
window.shareOnLinkedIn = shareOnLinkedIn;
window.copyArticleLink = copyArticleLink;