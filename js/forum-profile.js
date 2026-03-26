/* ============================================
   RafaMall - Forum Profile JavaScript
   Profile tabs, activity display
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
    console.log("Forum profile page loaded");
    
    // Tab switching
    const tabs = document.querySelectorAll(".profile-tab");
    const tabContents = document.querySelectorAll(".profile-tab-content");
    
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetTab = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            tabContents.forEach(content => content.classList.remove("active"));
            document.getElementById(`${targetTab}Tab`).classList.add("active");
        });
    });
});