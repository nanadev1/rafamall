/* ============================================
   RafaMall - RafaDoc Consultation JavaScript
   ============================================ */

// Herbalists Data
const herbalists = [
    {
        id: 1,
        name: "Dr. Sarah Chen",
        title: "PhD, Medical Herbalist",
        specialty: ["Women's Health", "Hormonal Balance", "Stress Management"],
        bio: "Dr. Chen has over 15 years of experience in clinical herbalism, specializing in women's health and hormonal balance.",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Dr.+Sarah",
        rating: 4.9,
        reviews: 342
    },
    {
        id: 2,
        name: "Dr. Michael Okafor",
        title: "PhD, Clinical Herbalist",
        specialty: ["Immune Health", "Digestive Wellness", "Chronic Conditions"],
        bio: "Dr. Okafor is a leading expert in African traditional medicine and clinical herbalism.",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Dr.+Michael",
        rating: 4.8,
        reviews: 278
    },
    {
        id: 3,
        name: "Dr. Amara Adeleke",
        title: "ND, Certified Herbalist",
        specialty: ["Skin Health", "Detoxification", "Natural Beauty"],
        bio: "Dr. Adeleke specializes in natural skincare and detoxification protocols.",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Dr.+Amara",
        rating: 4.9,
        reviews: 456
    }
];

// Testimonials Data
const testimonials = [
    {
        id: 1,
        name: "Jennifer Williams",
        avatar: "https://placehold.co/60x60/000000/FFFFFF?text=JW",
        rating: 5,
        text: "Dr. Sarah transformed my health! After struggling with hormonal imbalances for years, her personalized herbal protocol made a huge difference.",
        date: "March 15, 2026"
    },
    {
        id: 2,
        name: "David Mensah",
        avatar: "https://placehold.co/60x60/000000/FFFFFF?text=DM",
        rating: 5,
        text: "The RafaDoc consultation was life-changing. Dr. Michael's expertise in digestive health helped me overcome years of gut issues.",
        date: "March 10, 2026"
    },
    {
        id: 3,
        name: "Grace Okafor",
        avatar: "https://placehold.co/60x60/000000/FFFFFF?text=GO",
        rating: 5,
        text: "Amazing experience! Dr. Amara's skincare recommendations have given me the clearest skin I've had in years.",
        date: "March 5, 2026"
    }
];

// Display Herbalists
function displayHerbalists() {
    const grid = document.getElementById('herbalistsGrid');
    if (!grid) return;
    
    grid.innerHTML = herbalists.map(herbalist => `
        <div class="herbalist-card">
            <div class="herbalist-image">
                <img src="${herbalist.image}" alt="${herbalist.name}">
                <span class="herbalist-badge">${herbalist.reviews}+ clients</span>
            </div>
            <div class="herbalist-info">
                <h3>${herbalist.name}</h3>
                <span class="herbalist-title">${herbalist.title}</span>
                <div class="herbalist-specialty">
                    ${herbalist.specialty.map(s => `<span>${s}</span>`).join('')}
                </div>
                <p class="herbalist-bio">${herbalist.bio}</p>
                <div class="herbalist-rating">
                    <div class="herbalist-stars">${generateStars(herbalist.rating)}</div>
                    <span class="herbalist-reviews">(${herbalist.reviews} reviews)</span>
                </div>
                <button class="btn btn-primary book-herbalist-btn" data-name="${herbalist.name}">
                    Book with ${herbalist.name.split(' ')[1]} <i class="fas fa-calendar-check"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.book-herbalist-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const herbalistName = btn.dataset.name;
            const select = document.getElementById('selectHerbalist');
            if (select) {
                for(let i = 0; i < select.options.length; i++) {
                    if(select.options[i].value.includes(herbalistName)) {
                        select.selectedIndex = i;
                        break;
                    }
                }
            }
            document.getElementById('book-section').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Display Testimonials
function displayTestimonials() {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;
    
    grid.innerHTML = testimonials.map(testimonial => `
        <div class="testimonial-card">
            <div class="testimonial-rating">${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}</div>
            <p>"${testimonial.text}"</p>
            <div class="testimonial-author">
                <img src="${testimonial.avatar}" alt="${testimonial.name}">
                <div>
                    <h4>${testimonial.name}</h4>
                    <span>${testimonial.date}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Generate Stars
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '★';
    if (halfStar) stars += '½';
    for (let i = stars.length; i < 5; i++) stars += '☆';
    return stars;
}

// Show Success Modal
function showSuccessModal(bookingData) {
    const modal = document.createElement('div');
    modal.className = 'booking-success-modal';
    modal.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Booking Confirmed!</h3>
            <p>Your consultation with ${bookingData.herbalist} has been scheduled for ${bookingData.date} at ${bookingData.time}.</p>
            <p>A confirmation email has been sent to ${bookingData.email}</p>
            <button class="btn btn-primary" onclick="this.closest('.booking-success-modal').remove()">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
    
    setTimeout(() => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }, 5000);
}

// Handle Booking Form Submission
function setupBookingForm() {
    const form = document.getElementById('consultationBookingForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const bookingData = {
            herbalist: document.getElementById('selectHerbalist').value,
            package: document.getElementById('selectPackage').value,
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            date: document.getElementById('appointmentDate').value,
            time: document.getElementById('appointmentTime').value,
            consultationType: document.getElementById('consultationType').value,
            concerns: document.getElementById('healthConcerns').value,
            bookingDate: new Date().toISOString()
        };
        
        if (!bookingData.herbalist || !bookingData.package || !bookingData.fullName || !bookingData.email || !bookingData.date || !bookingData.time || !bookingData.consultationType) {
            alert('Please fill in all required fields');
            return;
        }
        
        if (!document.getElementById('termsAgree').checked) {
            alert('Please agree to the Terms & Conditions');
            return;
        }
        
        // Save to localStorage
        const bookings = JSON.parse(localStorage.getItem('rafadoc_bookings')) || [];
        bookings.push(bookingData);
        localStorage.setItem('rafadoc_bookings', JSON.stringify(bookings));
        
        showSuccessModal(bookingData);
        form.reset();
        
        // Set min date for date picker
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('appointmentDate').min = today;
    });
}

// Set min date for date picker
function setMinDate() {
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

// FAQ Accordion
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });
}

// Smooth Scroll
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = this.getAttribute('href');
            if (target === '#') return;
            const element = document.querySelector(target);
            if (element) {
                e.preventDefault();
                element.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    console.log('RafaDoc page loaded');
    displayHerbalists();
    displayTestimonials();
    setupBookingForm();
    setupFAQ();
    setupSmoothScroll();
    setMinDate();
    
    if (typeof updateCartCount === 'function') updateCartCount();
    if (typeof Wishlist !== 'undefined' && Wishlist.updateButtons) Wishlist.updateButtons();
});