// ============================================
// RafaMall - About Page JavaScript
// Animations, newsletter signup, interactive elements
// ============================================

// ============================================
// Animated Stats Counter
// ============================================

function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    if (!stats.length) return;
    
    // Check if stats are visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElement = entry.target;
                const targetValue = parseInt(statElement.textContent);
                
                if (isNaN(targetValue)) return;
                
                let currentValue = 0;
                const increment = Math.ceil(targetValue / 50);
                const duration = 1500;
                const stepTime = duration / (targetValue / increment);
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= targetValue) {
                        statElement.textContent = targetValue;
                        clearInterval(timer);
                    } else {
                        statElement.textContent = currentValue;
                    }
                }, stepTime);
                
                observer.unobserve(statElement);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

// ============================================
// Fade In Animations on Scroll
// ============================================

function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.mission-card, .value-card, .team-card, .testimonial-card'
    );
    
    if (!animatedElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// ============================================
// Newsletter Signup (About Page Specific)
// ============================================

function setupAboutNewsletter() {
    const newsletterForm = document.getElementById('aboutNewsletterForm');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!email) {
            showNotification('Please enter your email address', 'error');
            return;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Save to localStorage (demo)
        const subscribers = JSON.parse(localStorage.getItem('rafamall_newsletter')) || [];
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('rafamall_newsletter', JSON.stringify(subscribers));
        }
        
        showNotification('Thanks for subscribing! 🌿', 'success');
        newsletterForm.reset();
    });
}

// ============================================
// Team Member Hover Effects
// ============================================

function setupTeamHover() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        const image = card.querySelector('.team-image img');
        const socialLinks = card.querySelectorAll('.team-social a');
        
        if (image) {
            card.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.05)';
                image.style.filter = 'grayscale(0%)';
            });
            
            card.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1)';
                image.style.filter = 'grayscale(100%)';
            });
        }
        
        // Social links click handler
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = link.querySelector('i')?.className;
                showNotification(`Connect with us on ${platform}`, 'info');
            });
        });
    });
}

// ============================================
// Mission Card Click Effect
// ============================================

function setupMissionCards() {
    const missionCards = document.querySelectorAll('.mission-card');
    
    missionCards.forEach(card => {
        card.addEventListener('click', () => {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            card.style.position = 'relative';
            card.style.overflow = 'hidden';
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 500);
        });
    });
}

// ============================================
// Testimonial Auto-Rotate (Optional)
// ============================================

let testimonialInterval;
let currentTestimonial = 0;

function setupTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const container = document.querySelector('.testimonials-grid');
    
    if (!testimonials.length || testimonials.length <= 3) return;
    
    // Create navigation dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'testimonial-dots';
    dotsContainer.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 40px;
    `;
    
    testimonials.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `testimonial-dot ${index === 0 ? 'active' : ''}`;
        dot.style.cssText = `
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--text-tertiary);
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        dot.addEventListener('click', () => {
            showTestimonial(index);
            resetTestimonialTimer();
        });
        dotsContainer.appendChild(dot);
    });
    
    container.parentNode.insertBefore(dotsContainer, container.nextSibling);
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
        
        document.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
            dot.style.background = i === index ? 'var(--primary)' : 'var(--text-tertiary)';
            dot.style.width = i === index ? '28px' : '10px';
            dot.style.borderRadius = i === index ? '10px' : '50%';
        });
        
        currentTestimonial = index;
    }
    
    function startTestimonialTimer() {
        testimonialInterval = setInterval(() => {
            let next = currentTestimonial + 1;
            if (next >= testimonials.length) next = 0;
            showTestimonial(next);
        }, 5000);
    }
    
    function resetTestimonialTimer() {
        if (testimonialInterval) {
            clearInterval(testimonialInterval);
            startTestimonialTimer();
        }
    }
    
    // Show first testimonial
    showTestimonial(0);
    startTestimonialTimer();
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================

function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
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
// Page Load Animation
// ============================================

function setupPageLoadAnimation() {
    const hero = document.querySelector('.about-hero');
    if (!hero) return;
    
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        hero.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }, 100);
}

// ============================================
// Initialize All About Page Functions
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('About page JS loaded');
    
    // Run all functions
    animateStats();
    setupScrollAnimations();
    setupAboutNewsletter();
    setupTeamHover();
    setupMissionCards();
    setupSmoothScroll();
    setupPageLoadAnimation();
    
    // Optional: Uncomment if you want testimonial slider
    setupTestimonialSlider();
});

// ============================================
// Ripple Effect CSS (Add to your CSS file if not present)
// ============================================

// Add ripple effect style dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.1);
        transform: scale(0);
        animation: ripple 0.5s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);