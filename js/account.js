// ============================================
// RafaMall - Account Page JavaScript
// Authentication, Dashboard, Orders, Wishlist, Profile
// ============================================

// ============================================
// User Data Structure
// ============================================

let currentUser = null;
let userAddresses = [];
let userWishlist = [];
let userOrders = [];

// ============================================
// Check Login Status
// ============================================

function checkLoginStatus() {
    const savedUser = localStorage.getItem('rafamall_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        loadUserData();
        showDashboard();
    } else {
        showAuth();
    }
}

// ============================================
// Load User Data
// ============================================

function loadUserData() {
    if (!currentUser) return;
    
    // Load addresses
    const addresses = localStorage.getItem(`rafamall_addresses_${currentUser.id}`);
    userAddresses = addresses ? JSON.parse(addresses) : [];
    
    // Load wishlist
    const wishlist = localStorage.getItem(`rafamall_wishlist_${currentUser.id}`);
    userWishlist = wishlist ? JSON.parse(wishlist) : [];
    
    // Load orders
    const orders = localStorage.getItem(`rafamall_orders_${currentUser.id}`);
    userOrders = orders ? JSON.parse(orders) : [];
    
    // Also check global orders (from checkout)
    const globalOrders = JSON.parse(localStorage.getItem('rafamall_orders')) || [];
    const userGlobalOrders = globalOrders.filter(order => order.email === currentUser.email);
    if (userGlobalOrders.length > 0) {
        userOrders = [...userOrders, ...userGlobalOrders];
        // Remove duplicates by order number
        userOrders = userOrders.filter((order, index, self) => 
            index === self.findIndex(o => o.orderNumber === order.orderNumber)
        );
        userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        localStorage.setItem(`rafamall_orders_${currentUser.id}`, JSON.stringify(userOrders));
    }
}

// ============================================
// Save User Data
// ============================================

function saveUserData() {
    if (!currentUser) return;
    
    localStorage.setItem(`rafamall_addresses_${currentUser.id}`, JSON.stringify(userAddresses));
    localStorage.setItem(`rafamall_wishlist_${currentUser.id}`, JSON.stringify(userWishlist));
    localStorage.setItem(`rafamall_orders_${currentUser.id}`, JSON.stringify(userOrders));
}

// ============================================
// Show/Hide Sections
// ============================================

function showAuth() {
    const authContainer = document.getElementById('authContainer');
    const dashboardContainer = document.getElementById('dashboardContainer');
    
    if (authContainer) authContainer.style.display = 'block';
    if (dashboardContainer) dashboardContainer.style.display = 'none';
}

function showDashboard() {
    const authContainer = document.getElementById('authContainer');
    const dashboardContainer = document.getElementById('dashboardContainer');
    
    if (authContainer) authContainer.style.display = 'none';
    if (dashboardContainer) dashboardContainer.style.display = 'block';
    
    updateDashboardUI();
}

// ============================================
// Update Dashboard UI
// ============================================

function updateDashboardUI() {
    if (!currentUser) return;
    
    // Update user info
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const welcomeName = document.getElementById('welcomeName');
    
    if (userName) userName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    if (userEmail) userEmail.textContent = currentUser.email;
    if (welcomeName) welcomeName.textContent = currentUser.firstName;
    
    // Update stats
    const totalOrders = document.getElementById('totalOrders');
    const wishlistCount = document.getElementById('wishlistCount');
    const pendingOrders = document.getElementById('pendingOrders');
    
    if (totalOrders) totalOrders.textContent = userOrders.length;
    if (wishlistCount) wishlistCount.textContent = userWishlist.length;
    if (pendingOrders) pendingOrders.textContent = userOrders.filter(o => o.status === 'processing').length;
    
    // Display recent orders
    displayRecentOrders();
    
    // Display all orders
    displayAllOrders();
    
    // Display addresses
    displayAddresses();
    
    // Display wishlist
    displayWishlist();
    
    // Load profile form
    loadProfileForm();
}

// ============================================
// Display Recent Orders
// ============================================

function displayRecentOrders() {
    const recentOrdersContainer = document.getElementById('recentOrdersList');
    if (!recentOrdersContainer) return;
    
    const recentOrders = userOrders.slice(0, 3);
    
    if (recentOrders.length === 0) {
        recentOrdersContainer.innerHTML = '<p class="no-data">No orders yet. Start shopping!</p>';
        return;
    }
    
    recentOrdersContainer.innerHTML = recentOrders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <span class="order-number">Order #${order.orderNumber}</span>
                <span class="order-date">${order.date}</span>
                <span class="order-status ${order.status || 'confirmed'}">${(order.status || 'Confirmed').toUpperCase()}</span>
            </div>
            <div class="order-details">
                <span class="order-items">${order.items.length} item(s)</span>
                <span class="order-total">$${order.total.toFixed(2)}</span>
                <a href="#" class="view-order-link" data-order="${order.orderNumber}">View Details</a>
            </div>
        </div>
    `).join('');
}

// ============================================
// Display All Orders
// ============================================

function displayAllOrders() {
    const ordersContainer = document.getElementById('ordersList');
    if (!ordersContainer) return;
    
    if (userOrders.length === 0) {
        ordersContainer.innerHTML = '<p class="no-data">No orders yet. Start shopping!</p>';
        return;
    }
    
    ordersContainer.innerHTML = userOrders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <span class="order-number">Order #${order.orderNumber}</span>
                <span class="order-date">${order.date}</span>
                <span class="order-status ${order.status || 'confirmed'}">${(order.status || 'Confirmed').toUpperCase()}</span>
            </div>
            <div class="order-details">
                <span class="order-items">${order.items.length} item(s)</span>
                <span class="order-total">$${order.total.toFixed(2)}</span>
                <a href="#" class="view-order-link" data-order="${order.orderNumber}">View Details</a>
            </div>
        </div>
    `).join('');
}

// ============================================
// Display Addresses
// ============================================

function displayAddresses() {
    const addressesContainer = document.getElementById('addressesList');
    if (!addressesContainer) return;
    
    if (userAddresses.length === 0) {
        addressesContainer.innerHTML = '<p class="no-data">No addresses saved. Add your first address.</p>';
        return;
    }
    
    addressesContainer.innerHTML = userAddresses.map((address, index) => `
        <div class="address-card ${address.isDefault ? 'default' : ''}">
            ${address.isDefault ? '<span class="default-badge">Default</span>' : ''}
            <h4>${address.name}</h4>
            <p>${address.street}</p>
            <p>${address.city}, ${address.state} ${address.zip}</p>
            <p>${address.country}</p>
            <div class="address-actions">
                <button class="edit-address" data-index="${index}">Edit</button>
                <button class="delete-address" data-index="${index}">Delete</button>
                ${!address.isDefault ? `<button class="set-default" data-index="${index}">Set as Default</button>` : ''}
            </div>
        </div>
    `).join('');
    
    // Attach address event listeners
    document.querySelectorAll('.edit-address').forEach(btn => {
        btn.addEventListener('click', () => editAddress(parseInt(btn.dataset.index)));
    });
    
    document.querySelectorAll('.delete-address').forEach(btn => {
        btn.addEventListener('click', () => deleteAddress(parseInt(btn.dataset.index)));
    });
    
    document.querySelectorAll('.set-default').forEach(btn => {
        btn.addEventListener('click', () => setDefaultAddress(parseInt(btn.dataset.index)));
    });
}

// ============================================
// Address Functions
// ============================================

function addAddress(addressData) {
    const newAddress = {
        id: Date.now(),
        name: addressData.name,
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        zip: addressData.zip,
        country: addressData.country,
        isDefault: userAddresses.length === 0
    };
    
    userAddresses.push(newAddress);
    saveUserData();
    displayAddresses();
    showNotification('Address added successfully!', 'success');
}

function editAddress(index) {
    const address = userAddresses[index];
    if (!address) return;
    
    // Populate modal with address data
    document.getElementById('addressName').value = address.name;
    document.getElementById('addressStreet').value = address.street;
    document.getElementById('addressCity').value = address.city;
    document.getElementById('addressState').value = address.state;
    document.getElementById('addressZip').value = address.zip;
    document.getElementById('addressCountry').value = address.country;
    
    // Store index for editing
    document.getElementById('addressForm').dataset.editIndex = index;
    
    // Show modal
    const modal = document.getElementById('addressModal');
    if (modal) modal.style.display = 'flex';
}

function deleteAddress(index) {
    if (confirm('Are you sure you want to delete this address?')) {
        userAddresses.splice(index, 1);
        saveUserData();
        displayAddresses();
        showNotification('Address deleted', 'info');
    }
}

function setDefaultAddress(index) {
    userAddresses.forEach((addr, i) => {
        addr.isDefault = i === index;
    });
    saveUserData();
    displayAddresses();
    showNotification('Default address updated', 'success');
}

// ============================================
// Display Wishlist
// ============================================

function displayWishlist() {
    const wishlistContainer = document.getElementById('wishlistGrid');
    if (!wishlistContainer) return;
    
    if (userWishlist.length === 0) {
        wishlistContainer.innerHTML = '<p class="no-data">Your wishlist is empty. Start adding products!</p>';
        return;
    }
    
    // Get product details from global products array
    const productsList = typeof products !== 'undefined' ? products : [];
    
    const wishlistProducts = userWishlist.map(wishlistId => {
        const product = productsList.find(p => p.id === wishlistId);
        return product;
    }).filter(p => p);
    
    if (wishlistProducts.length === 0) {
        wishlistContainer.innerHTML = '<p class="no-data">Your wishlist is empty. Start adding products!</p>';
        return;
    }
    
    wishlistContainer.innerHTML = wishlistProducts.map(product => `
        <div class="wishlist-item" data-id="${product.id}">
            <div class="wishlist-item-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="wishlist-item-info">
                <h4>${product.name}</h4>
                <div class="wishlist-item-price">$${product.price}</div>
                <div class="wishlist-item-actions">
                    <button class="btn btn-primary add-to-cart" data-id="${product.id}" 
                            data-name="${product.name}" data-price="${product.price}" 
                            data-image="${product.image}">
                        <i class="fas fa-shopping-bag"></i> Add to Cart
                    </button>
                    <button class="btn btn-outline remove-from-wishlist" data-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Attach wishlist event listeners
    document.querySelectorAll('.remove-from-wishlist').forEach(btn => {
        btn.addEventListener('click', () => removeFromWishlist(parseInt(btn.dataset.id)));
    });
    
    // Attach add to cart events
    if (typeof attachAddToCartEvents === 'function') {
        attachAddToCartEvents();
    } else {
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = parseInt(btn.dataset.id);
                const name = btn.dataset.name;
                const price = parseFloat(btn.dataset.price);
                const image = btn.dataset.image;
                if (typeof addToCart === 'function') {
                    addToCart(id, name, price, image);
                }
            });
        });
    }
}

function removeFromWishlist(productId) {
    userWishlist = userWishlist.filter(id => id !== productId);
    localStorage.setItem(`rafamall_wishlist_${currentUser.id}`, JSON.stringify(userWishlist));
    displayWishlist();
    
    // Update wishlist count in stats
    const wishlistCount = document.getElementById('wishlistCount');
    if (wishlistCount) wishlistCount.textContent = userWishlist.length;
    
    showNotification('Removed from wishlist', 'info');
}

// ============================================
// Load Profile Form
// ============================================

function loadProfileForm() {
    if (!currentUser) return;
    
    const firstNameInput = document.getElementById('profileFirstName');
    const lastNameInput = document.getElementById('profileLastName');
    const emailInput = document.getElementById('profileEmail');
    const phoneInput = document.getElementById('profilePhone');
    
    if (firstNameInput) firstNameInput.value = currentUser.firstName || '';
    if (lastNameInput) lastNameInput.value = currentUser.lastName || '';
    if (emailInput) emailInput.value = currentUser.email || '';
    if (phoneInput) phoneInput.value = currentUser.phone || '';
}

// ============================================
// Update Profile
// ============================================

function updateProfile(formData) {
    currentUser.firstName = formData.firstName;
    currentUser.lastName = formData.lastName;
    currentUser.phone = formData.phone;
    
    localStorage.setItem('rafamall_current_user', JSON.stringify(currentUser));
    
    // Update user data in users list
    const users = JSON.parse(localStorage.getItem('rafamall_users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('rafamall_users', JSON.stringify(users));
    }
    
    updateDashboardUI();
    showNotification('Profile updated successfully!', 'success');
}

// ============================================
// Update Password
// ============================================

function updatePassword(currentPassword, newPassword, confirmPassword) {
    // Verify current password
    if (currentUser.password !== currentPassword) {
        showNotification('Current password is incorrect', 'error');
        return false;
    }
    
    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return false;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return false;
    }
    
    currentUser.password = newPassword;
    localStorage.setItem('rafamall_current_user', JSON.stringify(currentUser));
    
    // Update in users list
    const users = JSON.parse(localStorage.getItem('rafamall_users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('rafamall_users', JSON.stringify(users));
    }
    
    showNotification('Password updated successfully!', 'success');
    return true;
}

// ============================================
// Login Function
// ============================================

function login(email, password, rememberMe) {
    const users = JSON.parse(localStorage.getItem('rafamall_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = { ...user };
        if (rememberMe) {
            localStorage.setItem('rafamall_current_user', JSON.stringify(currentUser));
        } else {
            sessionStorage.setItem('rafamall_current_user', JSON.stringify(currentUser));
        }
        loadUserData();
        showDashboard();
        showNotification(`Welcome back, ${currentUser.firstName}!`, 'success');
        return true;
    } else {
        showNotification('Invalid email or password', 'error');
        return false;
    }
}

// ============================================
// Register Function
// ============================================

function register(userData) {
    const users = JSON.parse(localStorage.getItem('rafamall_users')) || [];
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
        showNotification('Email already registered', 'error');
        return false;
    }
    
    const newUser = {
        id: Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || '',
        password: userData.password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('rafamall_users', JSON.stringify(users));
    
    // Auto login after registration
    currentUser = newUser;
    localStorage.setItem('rafamall_current_user', JSON.stringify(currentUser));
    
    // Initialize empty data for new user
    localStorage.setItem(`rafamall_addresses_${currentUser.id}`, JSON.stringify([]));
    localStorage.setItem(`rafamall_wishlist_${currentUser.id}`, JSON.stringify([]));
    localStorage.setItem(`rafamall_orders_${currentUser.id}`, JSON.stringify([]));
    
    loadUserData();
    showDashboard();
    showNotification('Account created successfully! Welcome to RafaMall!', 'success');
    return true;
}

// ============================================
// Logout Function
// ============================================

function logout() {
    currentUser = null;
    localStorage.removeItem('rafamall_current_user');
    sessionStorage.removeItem('rafamall_current_user');
    showAuth();
    showNotification('Logged out successfully', 'info');
}

// ============================================
// Setup Event Listeners
// ============================================

function setupAuthTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            if (target === 'login') {
                if (loginForm) loginForm.classList.add('active');
                if (registerForm) registerForm.classList.remove('active');
            } else {
                if (registerForm) registerForm.classList.add('active');
                if (loginForm) loginForm.classList.remove('active');
            }
        });
    });
    
    // Switch to register from login
    const switchToRegister = document.getElementById('switchToRegister');
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.auth-tab[data-tab="register"]').click();
        });
    }
    
    // Switch to login from register
    const switchToLogin = document.getElementById('switchToLogin');
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.auth-tab[data-tab="login"]').click();
        });
    }
}

function setupLoginForm() {
    const form = document.getElementById('loginFormElement');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        login(email, password, rememberMe);
    });
}

function setupRegisterForm() {
    const form = document.getElementById('registerFormElement');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        
        const termsAgree = document.getElementById('termsAgree').checked;
        if (!termsAgree) {
            showNotification('Please agree to the Terms & Conditions', 'error');
            return;
        }
        
        const userData = {
            firstName: document.getElementById('regFirstName').value,
            lastName: document.getElementById('regLastName').value,
            email: document.getElementById('regEmail').value,
            phone: document.getElementById('regPhone').value,
            password: password
        };
        
        register(userData);
    });
}

function setupDashboardNavigation() {
    const navItems = document.querySelectorAll('.dashboard-nav-item[data-section]');
    const sections = ['overview', 'orders', 'profile', 'addresses', 'wishlist', 'security'];
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show selected section
            sections.forEach(sec => {
                const sectionEl = document.getElementById(`${sec}Section`);
                if (sectionEl) {
                    sectionEl.classList.remove('active');
                }
            });
            
            const activeSection = document.getElementById(`${section}Section`);
            if (activeSection) activeSection.classList.add('active');
        });
    });
}

function setupProfileForm() {
    const form = document.getElementById('profileForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('profileFirstName').value,
            lastName: document.getElementById('profileLastName').value,
            email: document.getElementById('profileEmail').value,
            phone: document.getElementById('profilePhone').value
        };
        
        updateProfile(formData);
    });
}

function setupPasswordForm() {
    const form = document.getElementById('passwordForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        
        updatePassword(currentPassword, newPassword, confirmNewPassword);
        form.reset();
    });
}

function setupAddressModal() {
    const addBtn = document.getElementById('addAddressBtn');
    const closeBtn = document.getElementById('closeAddressModal');
    const modal = document.getElementById('addressModal');
    const form = document.getElementById('addressForm');
    
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            // Clear form
            form.reset();
            delete form.dataset.editIndex;
            if (modal) modal.style.display = 'flex';
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const addressData = {
                name: document.getElementById('addressName').value,
                street: document.getElementById('addressStreet').value,
                city: document.getElementById('addressCity').value,
                state: document.getElementById('addressState').value,
                zip: document.getElementById('addressZip').value,
                country: document.getElementById('addressCountry').value
            };
            
            const editIndex = form.dataset.editIndex;
            if (editIndex !== undefined) {
                // Update existing address
                userAddresses[editIndex] = { ...userAddresses[editIndex], ...addressData };
                saveUserData();
                showNotification('Address updated successfully!', 'success');
                delete form.dataset.editIndex;
            } else {
                // Add new address
                addAddress(addressData);
            }
            
            if (modal) modal.style.display = 'none';
            displayAddresses();
        });
    }
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

function setupTogglePassword() {
    const toggleBtns = document.querySelectorAll('.toggle-password');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const input = document.getElementById(targetId);
            const icon = btn.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

function setupViewOrderLinks() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-order-link')) {
            e.preventDefault();
            const orderNumber = e.target.dataset.order;
            showNotification(`Order #${orderNumber} details - Coming soon!`, 'info');
        }
    });
}

// ============================================
// Show Notification
// ============================================

function showNotification(message, type = 'success') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
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
// Initialize Account Page
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Account page JS loaded');
    
    // Check login status
    checkLoginStatus();
    
    // Setup auth tabs
    setupAuthTabs();
    
    // Setup forms
    setupLoginForm();
    setupRegisterForm();
    setupProfileForm();
    setupPasswordForm();
    
    // Setup dashboard
    setupDashboardNavigation();
    setupLogout();
    setupAddressModal();
    
    // Setup UI helpers
    setupTogglePassword();
    setupViewOrderLinks();
    
    // Update cart count if function exists
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
    
    console.log('Account page fully initialized');
});