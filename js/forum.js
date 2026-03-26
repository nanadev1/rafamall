/* ============================================
   RafaMall - Community Forum JavaScript
   Forum categories, discussions, members, interactive features
   ============================================ */

// Forum Categories Data
const forumCategories = [
    {
        id: 1,
        name: "Herbal Remedies Discussion",
        icon: "fas fa-mortar-pestle",
        description: "Share experiences with different herbs, ask questions, get advice from experienced herbalists.",
        topics: 234,
        posts: 1567,
        color: "#10b981"
    },
    {
        id: 2,
        name: "Plant Identification Help",
        icon: "fas fa-leaf",
        description: "Upload photos of plants you find - community helps identify and share traditional uses.",
        topics: 189,
        posts: 1234,
        color: "#3b82f6"
    },
    {
        id: 3,
        name: "Traditional Healing Stories",
        icon: "fas fa-book-open",
        description: "Share family remedies, ancestral wisdom, and cultural healing practices from across Africa.",
        topics: 156,
        posts: 987,
        color: "#f59e0b"
    },
    {
        id: 4,
        name: "DIY Herbal Recipes",
        icon: "fas fa-utensils",
        description: "Share recipes for teas, tinctures, salves, soaps, and natural remedies.",
        topics: 278,
        posts: 2103,
        color: "#8b5cf6"
    },
    {
        id: 5,
        name: "Ask the Herbalist",
        icon: "fas fa-user-md",
        description: "Monthly Q&A with RafaDoc herbalists - get professional insights.",
        topics: 89,
        posts: 567,
        color: "#ef4444"
    },
    {
        id: 6,
        name: "Wellness Journey",
        icon: "fas fa-chart-line",
        description: "Share your health journey, transformations, and successes with natural remedies.",
        topics: 123,
        posts: 890,
        color: "#14b8a6"
    },
    {
        id: 7,
        name: "Sustainable Harvesting",
        icon: "fas fa-seedling",
        description: "Discuss ethical wildcrafting, cultivation, and conservation of medicinal plants.",
        topics: 67,
        posts: 456,
        color: "#84cc16"
    },
    {
        id: 8,
        name: "Ghanaian & African Herbalism",
        icon: "fas fa-map-africa",
        description: "Focus on indigenous African herbs and traditional medicine practices.",
        topics: 98,
        posts: 652,
        color: "#ec489a"
    }
];

// Latest Discussions Data
const latestDiscussions = [
    {
        id: 1,
        title: "What's the best way to prepare moringa leaves for maximum benefits?",
        author: "Herbalist_Amara",
        authorAvatar: "A",
        category: "Herbal Remedies Discussion",
        replies: 12,
        views: 234,
        lastActivity: "2 hours ago",
        pinned: true
    },
    {
        id: 2,
        title: "Can anyone help identify this plant growing in my garden? (with photos)",
        author: "NatureSeeker",
        authorAvatar: "N",
        category: "Plant Identification Help",
        replies: 8,
        views: 156,
        lastActivity: "5 hours ago",
        pinned: false
    },
    {
        id: 3,
        title: "My grandmother's malaria remedy using neem and bitter leaf",
        author: "Kwame_GH",
        authorAvatar: "K",
        category: "Traditional Healing Stories",
        replies: 24,
        views: 567,
        lastActivity: "1 day ago",
        pinned: true
    },
    {
        id: 4,
        title: "DIY: How to make your own shea butter and coconut oil balm",
        author: "NaturalSkin",
        authorAvatar: "N",
        category: "DIY Herbal Recipes",
        replies: 45,
        views: 1234,
        lastActivity: "3 hours ago",
        pinned: false
    },
    {
        id: 5,
        title: "Q&A with Dr. Sarah: Understanding herbal adaptogens for stress relief",
        author: "Dr. Sarah Chen",
        authorAvatar: "S",
        category: "Ask the Herbalist",
        replies: 67,
        views: 3456,
        lastActivity: "6 hours ago",
        pinned: true
    }
];

// Featured Members Data
const featuredMembers = [
    {
        name: "Herbalist_Amara",
        title: "Master Herbalist",
        avatar: "A",
        posts: 1234,
        reputation: 5678,
        badges: ["🌿 Top Contributor", "🏆 Plant Expert"]
    },
    {
        name: "Kwame_GH",
        title: "Traditional Healer",
        avatar: "K",
        posts: 876,
        reputation: 4321,
        badges: ["📜 Storyteller", "🌍 African Wisdom"]
    },
    {
        name: "NatureSeeker",
        title: "Plant Identifier",
        avatar: "N",
        posts: 654,
        reputation: 3456,
        badges: ["🔍 Plant Spotter", "📸 Photo Expert"]
    },
    {
        name: "Dr. Sarah Chen",
        title: "Clinical Herbalist",
        avatar: "S",
        posts: 432,
        reputation: 8765,
        badges: ["⚕️ Medical Expert", "🎓 Educator"]
    }
];

// Display Forum Categories
function displayForumCategories() {
    const grid = document.getElementById("forumCategoriesGrid");
    if (!grid) return;
    
    grid.innerHTML = forumCategories.map(cat => `
        <div class="category-card" data-id="${cat.id}">
            <div class="category-icon" style="background: ${cat.color}20">
                <i class="${cat.icon}" style="color: ${cat.color}"></i>
            </div>
            <h3>${cat.name}</h3>
            <p>${cat.description}</p>
            <div class="category-stats">
                <span><i class="fas fa-comment"></i> ${cat.topics} topics</span>
                <span><i class="fas fa-reply"></i> ${cat.posts} posts</span>
            </div>
        </div>
    `).join("");
    
    // Add click handlers
    document.querySelectorAll(".category-card").forEach(card => {
        card.addEventListener("click", () => {
            showNotification("Category page coming soon! Explore topics in the latest discussions.", "info");
        });
    });
}

// Display Latest Discussions
function displayLatestDiscussions() {
    const container = document.getElementById("discussionsList");
    if (!container) return;
    
    container.innerHTML = latestDiscussions.map(discussion => `
        <div class="discussion-item ${discussion.pinned ? 'pinned' : ''}">
            <div class="discussion-info">
                <a href="#" class="discussion-title" data-id="${discussion.id}">
                    ${discussion.pinned ? '<i class="fas fa-thumbtack" style="color: var(--primary); margin-right: 8px;"></i>' : ''}
                    ${discussion.title}
                </a>
                <div class="discussion-meta">
                    <span><i class="fas fa-user"></i> ${discussion.author}</span>
                    <span><i class="fas fa-tag"></i> ${discussion.category}</span>
                    <span><i class="fas fa-clock"></i> ${discussion.lastActivity}</span>
                </div>
            </div>
            <div class="discussion-stats">
                <div>
                    <strong>${discussion.replies}</strong>
                    <span>replies</span>
                </div>
                <div>
                    <strong>${discussion.views}</strong>
                    <span>views</span>
                </div>
            </div>
        </div>
    `).join("");
    
    // Add click handlers for discussion titles
    document.querySelectorAll(".discussion-title").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            showNotification("Topic page coming soon! This will show the full discussion thread.", "info");
        });
    });
}

// Display Featured Members
function displayFeaturedMembers() {
    const grid = document.getElementById("membersGrid");
    if (!grid) return;
    
    grid.innerHTML = featuredMembers.map(member => `
        <div class="member-card">
            <div class="member-avatar">
                <i class="fas fa-user-circle"></i>
            </div>
            <div class="member-name">${member.name}</div>
            <div class="member-title">${member.title}</div>
            <div class="member-stats">
                <div>
                    <strong>${member.posts}</strong>
                    <span>posts</span>
                </div>
                <div>
                    <strong>${member.reputation}</strong>
                    <span>rep</span>
                </div>
            </div>
            <div class="member-badges">
                ${member.badges.map(badge => `<span class="badge">${badge}</span>`).join("")}
            </div>
        </div>
    `).join("");
}

// Update Forum Stats
function updateForumStats() {
    const memberCount = document.getElementById("memberCount");
    const topicCount = document.getElementById("topicCount");
    const postCount = document.getElementById("postCount");
    
    if (memberCount) memberCount.textContent = "2,547";
    if (topicCount) topicCount.textContent = "1,234";
    if (postCount) postCount.textContent = "8,456";
}

// Show Notification
function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize Forum Page
document.addEventListener("DOMContentLoaded", () => {
    console.log("Forum page loaded");
    
    displayForumCategories();
    displayLatestDiscussions();
    displayFeaturedMembers();
    updateForumStats();
    
    if (typeof updateCartCount === "function") updateCartCount();
    if (typeof Wishlist !== "undefined" && Wishlist.updateButtons) Wishlist.updateButtons();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            const target = this.getAttribute("href");
            if (target === "#") return;
            const element = document.querySelector(target);
            if (element) {
                e.preventDefault();
                element.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
});