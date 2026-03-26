// ============================================
// RafaMall - Live Chat Widget JavaScript
// Complete chat functionality with auto-responses
// ============================================

// Chat Widget Elements
const chatToggle = document.getElementById('chatToggle');
const chatWidget = document.getElementById('chatWidget');
const chatMinimize = document.getElementById('chatMinimize');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatTyping = document.getElementById('chatTyping');
const chatBadge = document.getElementById('chatBadge');

// Chat State
let isChatOpen = false;
let isMinimized = false;
let unreadCount = 1;
let messageHistory = [];

// Auto-response data
const autoResponses = {
    'track my order': "To track your order, please visit your account dashboard or use the tracking link sent to your email. You can also enter your order number at: rafamall.com/track-order",
    'product information': "All our products are 100% organic, lab-tested, and ethically sourced. You can find detailed information including ingredients, usage instructions, and benefits on each product page.",
    'shipping': "We offer free shipping on orders over $50. Standard shipping takes 3-5 business days, Express shipping takes 1-2 business days. International shipping is available to select countries.",
    'delivery': "We offer free shipping on orders over $50. Standard shipping takes 3-5 business days, Express shipping takes 1-2 business days. International shipping is available to select countries.",
    'returns': "We offer a 30-day money-back guarantee. If you're not completely satisfied, simply contact us within 30 days of delivery for a full refund or exchange.",
    'refund': "We offer a 30-day money-back guarantee. If you're not completely satisfied, simply contact us within 30 days of delivery for a full refund or exchange.",
    'hello': "Hello! Welcome to RafaMall. How can I assist you today?",
    'hi': "Hi there! Welcome to RafaMall. How can I help you?",
    'help': "I'm here to help! You can ask me about:\n• Order tracking\n• Product information\n• Shipping & delivery\n• Returns & refunds\n• Or anything else about RafaMall!",
    'hours': "Our support team is available Monday-Friday, 9:00 AM - 6:00 PM EST. We respond to messages within 24 hours.",
    'contact': "You can reach us at support@rafamall.com or call +233 54 820 5657. Our support hours are Monday-Friday, 9 AM - 6 PM EST.",
    'promo': "We have several active promotions! Check our homepage for the latest flash sales. Sign up for our newsletter to get 10% off your first order!",
    'discount': "We have several active promotions! Check our homepage for the latest flash sales. Sign up for our newsletter to get 10% off your first order!",
    'organic': "Yes! All our products are 100% organic, sustainably sourced, and lab-tested for purity and potency.",
    'ingredients': "All ingredients are clearly listed on each product page. We use only natural, organic ingredients with no synthetic additives."
};

// Initialize Chat
function initChat() {
    // Load message history from localStorage
    const savedHistory = localStorage.getItem('rafamall_chat_history');
    if (savedHistory) {
        messageHistory = JSON.parse(savedHistory);
        // Restore last 10 messages
        const lastMessages = messageHistory.slice(-10);
        lastMessages.forEach(msg => {
            addMessageToChat(msg.text, msg.type, msg.time, false);
        });
    }
    
    // Setup event listeners
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    // Toggle chat
    chatToggle.addEventListener('click', toggleChat);
    
    // Minimize chat
    chatMinimize.addEventListener('click', minimizeChat);
    
    // Close chat
    chatClose.addEventListener('click', closeChat);
    
    // Send message on button click
    chatSend.addEventListener('click', sendMessage);
    
    // Send message on Enter key (Shift+Enter for new line)
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize textarea
    chatInput.addEventListener('input', autoResizeTextarea);
    
    // Quick reply buttons (event delegation)
    chatMessages.addEventListener('click', (e) => {
        if (e.target.classList.contains('quick-reply')) {
            const message = e.target.dataset.message;
            if (message) {
                chatInput.value = message;
                sendMessage();
            }
        }
    });
}

// Toggle Chat Open/Close
function toggleChat() {
    if (isChatOpen) {
        closeChat();
    } else {
        openChat();
    }
}

// Open Chat
function openChat() {
    chatWidget.classList.add('open');
    isChatOpen = true;
    // Reset unread badge
    unreadCount = 0;
    if (chatBadge) chatBadge.classList.add('hidden');
    // Scroll to bottom
    scrollToBottom();
    // Focus input
    setTimeout(() => chatInput.focus(), 300);
}

// Close Chat
function closeChat() {
    chatWidget.classList.remove('open');
    chatWidget.classList.remove('minimized');
    isChatOpen = false;
    isMinimized = false;
}

// Minimize Chat
function minimizeChat() {
    if (isMinimized) {
        chatWidget.classList.remove('minimized');
        isMinimized = false;
        scrollToBottom();
    } else {
        chatWidget.classList.add('minimized');
        isMinimized = true;
    }
}

// Send Message
function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat(message, 'user', getCurrentTime(), true);
    
    // Clear input
    chatInput.value = '';
    autoResizeTextarea();
    
    // Save to history
    messageHistory.push({ text: message, type: 'user', time: getCurrentTime(), timestamp: Date.now() });
    localStorage.setItem('rafamall_chat_history', JSON.stringify(messageHistory));
    
    // Show typing indicator
    showTypingIndicator();
    
    // Get bot response after delay
    setTimeout(() => {
        const response = getBotResponse(message);
        addMessageToChat(response, 'bot', getCurrentTime(), true);
        
        // Save to history
        messageHistory.push({ text: response, type: 'bot', time: getCurrentTime(), timestamp: Date.now() });
        localStorage.setItem('rafamall_chat_history', JSON.stringify(messageHistory));
        
        // Hide typing indicator
        hideTypingIndicator();
        
        // Play notification sound if chat is minimized or closed
        if (!isChatOpen || isMinimized) {
            playNotificationSound();
            updateUnreadBadge();
        }
    }, 800);
}

// Get Bot Response
function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for exact matches first
    for (const [key, response] of Object.entries(autoResponses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    
    // Check for keywords
    if (lowerMessage.includes('order') && (lowerMessage.includes('track') || lowerMessage.includes('where'))) {
        return autoResponses['track my order'];
    }
    if (lowerMessage.includes('product') && (lowerMessage.includes('info') || lowerMessage.includes('about'))) {
        return autoResponses['product information'];
    }
    if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
        return autoResponses['shipping'];
    }
    if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
        return autoResponses['returns'];
    }
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return autoResponses['hello'];
    }
    if (lowerMessage.includes('help')) {
        return autoResponses['help'];
    }
    if (lowerMessage.includes('hour') || lowerMessage.includes('time')) {
        return autoResponses['hours'];
    }
    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone')) {
        return autoResponses['contact'];
    }
    if (lowerMessage.includes('promo') || lowerMessage.includes('discount') || lowerMessage.includes('sale')) {
        return autoResponses['promo'];
    }
    if (lowerMessage.includes('organic') || lowerMessage.includes('natural')) {
        return autoResponses['organic'];
    }
    if (lowerMessage.includes('ingredient')) {
        return autoResponses['ingredients'];
    }
    
    // Default response
    return "Thank you for your message! Our support team will get back to you shortly. In the meantime, you can check our FAQ page for quick answers. Is there anything specific I can help you with?";
}

// Add Message to Chat
function addMessageToChat(message, type, time, saveToHistory = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${type === 'bot' ? 'fa-headset' : 'fa-user'}"></i>
        </div>
        <div class="message-content">
            <p>${formatMessage(message)}</p>
        </div>
        <div class="message-time">${time}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Format Message (handle line breaks)
function formatMessage(message) {
    return message.replace(/\n/g, '<br>');
}

// Show Typing Indicator
function showTypingIndicator() {
    if (chatTyping) chatTyping.style.display = 'flex';
    scrollToBottom();
}

// Hide Typing Indicator
function hideTypingIndicator() {
    if (chatTyping) chatTyping.style.display = 'none';
}

// Auto-resize Textarea
function autoResizeTextarea() {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 80) + 'px';
}

// Scroll to Bottom of Chat
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get Current Time
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
}

// Play Notification Sound
function playNotificationSound() {
    const audio = document.getElementById('chatNotificationSound');
    if (audio) {
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
}

// Update Unread Badge
function updateUnreadBadge() {
    unreadCount++;
    if (chatBadge) {
        chatBadge.textContent = unreadCount;
        chatBadge.classList.remove('hidden');
    }
}

// Show Notification (for when chat is closed)
function showChatNotification(message) {
    if (!isChatOpen && Notification.permission === 'granted') {
        new Notification('RafaMall Support', { body: message });
    }
}

// Request notification permission
if (Notification.permission === 'default') {
    Notification.requestPermission();
}

// Initialize chat when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initChat();
});