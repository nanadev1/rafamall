// ============================================
// RafaMall - Privacy Policy Page JavaScript
// Cookie consent, last updated date, interactive elements
// ============================================

// ============================================
// Cookie Consent Bar
// ============================================

function setupCookieConsent() {
    const consentBar = document.getElementById('consentBar');
    const acceptBtn = document.getElementById('acceptCookies');
    
    // Check if consent bar exists on this page
    if (!consentBar) {
        console.log('Cookie consent bar not found on this page');
        return;
    }
    
    console.log('Setting up cookie consent bar');
    
    // Check if user already accepted cookies
    const cookiesAccepted = localStorage.getItem('rafamall_cookies_accepted');
    
    if (!cookiesAccepted) {
        // Show consent bar immediately
        consentBar.classList.add('visible');
        console.log('Consent bar shown');
    } else {
        console.log('Cookies already accepted, bar hidden');
    }
    
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('rafamall_cookies_accepted', 'true');
            consentBar.classList.remove('visible');
            
            // Track acceptance
            trackCookieAcceptance();
            
            showNotification('Cookie preferences saved', 'success');
            console.log('Cookies accepted');
        });
    }
}

// ============================================
// Track Cookie Acceptance
// ============================================

function trackCookieAcceptance() {
    const acceptanceData = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        language: navigator.language
    };
    
    const acceptances = JSON.parse(localStorage.getItem('rafamall_cookie_acceptances')) || [];
    acceptances.push(acceptanceData);
    localStorage.setItem('rafamall_cookie_acceptances', JSON.stringify(acceptances));
    
    console.log('Cookie acceptance tracked');
}

// ============================================
// Update Last Modified Date
// ============================================

function updateLastModifiedDate() {
    const lastUpdatedElement = document.querySelector('.page-header p');
    
    if (lastUpdatedElement && lastUpdatedElement.textContent.includes('Last Updated')) {
        // Set current date
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        lastUpdatedElement.textContent = `Last Updated: ${currentDate}`;
    }
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================

function setupSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// Animate Info Cards on Scroll
// ============================================

function setupInfoCardAnimations() {
    const infoCards = document.querySelectorAll('.info-card, .right-item, .cookie-type, .legal-block');
    
    if (!infoCards.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    infoCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
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
        <span>${escapeHtml(message)}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// Escape HTML
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

// ============================================
// Initialize Privacy Page
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Privacy policy page JS loaded');
    
    // Setup cookie consent
    setupCookieConsent();
    
    // Update last modified date
    updateLastModifiedDate();
    
    // Setup smooth scroll for anchor links
    setupSmoothScroll();
    
    // Animate info cards on scroll
    setupInfoCardAnimations();
    
    console.log('Privacy page fully initialized');
});