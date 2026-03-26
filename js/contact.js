// ============================================
// RafaMall - Contact Page JavaScript
// Contact form, validation, FAQ accordion, map interactions
// ============================================

// ============================================
// Contact Form Handler
// ============================================

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    const contactSuccess = document.getElementById('contactSuccess');
    const sendAnother = document.getElementById('sendAnother');
    
    if (!contactForm) {
        console.log('Contact form not found on this page');
        return;
    }
    
    console.log('Setting up contact form');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name')?.value.trim(),
            email: document.getElementById('contactEmail')?.value.trim(),
            phone: document.getElementById('phone')?.value.trim(),
            subject: document.getElementById('subject')?.value,
            message: document.getElementById('message')?.value.trim(),
            subscribe: document.getElementById('newsletter')?.checked || false,
            date: new Date().toISOString(),
            timestamp: Date.now()
        };
        
        // Validate form
        const validation = validateContactForm(formData);
        
        if (!validation.isValid) {
            showNotification(validation.message, 'error');
            return;
        }
        
        // Save to localStorage (demo purposes)
        saveContactMessage(formData);
        
        // Show success message
        if (contactForm) contactForm.style.display = 'none';
        if (contactSuccess) contactSuccess.style.display = 'block';
        
        // Show notification
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Scroll to success message
        contactSuccess?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    
    // Handle "Send Another Message" button
    if (sendAnother) {
        sendAnother.addEventListener('click', () => {
            if (contactForm) {
                contactForm.reset();
                contactForm.style.display = 'block';
            }
            if (contactSuccess) contactSuccess.style.display = 'none';
        });
    }
}

// ============================================
// Validate Contact Form
// ============================================

function validateContactForm(data) {
    // Check required fields
    if (!data.name) {
        return { isValid: false, message: 'Please enter your full name' };
    }
    
    if (!data.email) {
        return { isValid: false, message: 'Please enter your email address' };
    }
    
    if (!data.subject) {
        return { isValid: false, message: 'Please select a subject' };
    }
    
    if (!data.message) {
        return { isValid: false, message: 'Please enter your message' };
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return { isValid: false, message: 'Please enter a valid email address' };
    }
    
    // Validate phone number if provided (optional)
    if (data.phone) {
        const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
        if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
            return { isValid: false, message: 'Please enter a valid phone number' };
        }
    }
    
    // Validate message length
    if (data.message.length < 10) {
        return { isValid: false, message: 'Message must be at least 10 characters long' };
    }
    
    if (data.message.length > 2000) {
        return { isValid: false, message: 'Message cannot exceed 2000 characters' };
    }
    
    return { isValid: true, message: '' };
}

// ============================================
// Save Contact Message to localStorage
// ============================================

function saveContactMessage(formData) {
    const messages = JSON.parse(localStorage.getItem('rafamall_contact_messages')) || [];
    messages.push(formData);
    localStorage.setItem('rafamall_contact_messages', JSON.stringify(messages));
    console.log('Contact message saved, total messages:', messages.length);
}

// ============================================
// FAQ Accordion
// ============================================

function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqItems.length) {
        console.log('FAQ items not found');
        return;
    }
    
    console.log('Setting up FAQ accordion, items:', faqItems.length);
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (!question) return;
        
        question.addEventListener('click', () => {
            // Toggle current item
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });
}

// ============================================
// Map Interactions
// ============================================

function setupMap() {
    const mapContainer = document.querySelector('.map-placeholder');
    const directionsBtn = document.querySelector('.map-actions .btn');
    
    if (!mapContainer) return;
    
    // Add map hover effect
    const iframe = mapContainer.querySelector('iframe');
    if (iframe) {
        mapContainer.addEventListener('mouseenter', () => {
            iframe.style.filter = 'grayscale(0%)';
        });
        
        mapContainer.addEventListener('mouseleave', () => {
            iframe.style.filter = 'grayscale(100%)';
        });
    }
    
    // Get directions button
    if (directionsBtn) {
        directionsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Open Google Maps directions
            const address = encodeURIComponent('123 Wellness Avenue, New York, NY 10001');
            window.open(`https://www.google.com/maps/dir//${address}`, '_blank');
        });
    }
}

// ============================================
// Social Links Interactions
// ============================================

function setupSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    if (!socialLinks.length) return;
    
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = link.querySelector('span')?.textContent || 'social media';
            showNotification(`Connect with us on ${platform}!`, 'info');
            
            // In a real app, you would redirect to actual social media pages
            // window.open('https://' + platform.toLowerCase() + '.com/rafamall', '_blank');
        });
    });
}

// ============================================
// Store Hours Toggle (Optional)
// ============================================

function setupStoreHours() {
    const storeInfo = document.querySelector('.store-info');
    if (!storeInfo) return;
    
    // Add current day highlight
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    const hoursList = storeInfo.querySelectorAll('.store-details ul li');
    
    hoursList.forEach(item => {
        if (item.textContent.includes(today)) {
            item.style.fontWeight = '600';
            item.style.color = 'var(--primary)';
        }
    });
}

// ============================================
// Smooth Scroll for Contact Cards
// ============================================

function setupContactCards() {
    const contactCards = document.querySelectorAll('.contact-info-card');
    
    contactCards.forEach(card => {
        card.addEventListener('click', () => {
            const icon = card.querySelector('.contact-icon i');
            const title = card.querySelector('h3')?.textContent;
            
            if (title === 'Call Us') {
                window.location.href = 'tel:+233548205657';
            } else if (title === 'Email Us') {
                window.location.href = 'mailto:support@rafamall.com';
            } else if (title === 'WhatsApp') {
                window.open('https://wa.me/233548205657', '_blank');
            } else if (title === 'Visit Us') {
                const map = document.querySelector('.map-placeholder');
                if (map) {
                    map.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// ============================================
// Form Input Effects
// ============================================

function setupFormEffects() {
    const inputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
    
    inputs.forEach(input => {
        // Add focus effect
        input.addEventListener('focus', () => {
            input.parentElement?.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement?.classList.remove('focused');
        });
        
        // Add validation feedback on blur
        input.addEventListener('blur', () => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                input.style.borderColor = 'var(--danger)';
            } else {
                input.style.borderColor = 'var(--border-light)';
            }
        });
        
        // Clear error on input
        input.addEventListener('input', () => {
            input.style.borderColor = 'var(--border-light)';
        });
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
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
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
// Initialize Contact Page
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Contact page JS loaded');
    
    // Setup contact form
    setupContactForm();
    
    // Setup FAQ accordion
    setupFAQ();
    
    // Setup map interactions
    setupMap();
    
    // Setup social links
    setupSocialLinks();
    
    // Setup store hours highlight
    setupStoreHours();
    
    // Setup contact cards click handlers
    setupContactCards();
    
    // Setup form input effects
    setupFormEffects();
    
    // Load existing messages count (optional)
    const messages = JSON.parse(localStorage.getItem('rafamall_contact_messages')) || [];
    console.log('Total contact messages in storage:', messages.length);
});