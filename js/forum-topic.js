/* ============================================
   RafaMall - Forum Topic JavaScript
   Post interactions, reply functionality
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
    console.log("Forum topic page loaded");
    
    // Like button functionality
    const likeBtns = document.querySelectorAll(".like-btn");
    likeBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const icon = this.querySelector("i");
            const countSpan = this.querySelector("span");
            let count = parseInt(countSpan.textContent);
            
            if (icon.classList.contains("far")) {
                icon.classList.remove("far");
                icon.classList.add("fas");
                icon.style.color = "#ef4444";
                count++;
                countSpan.textContent = count;
                showNotification("You liked this post!", "success");
            } else {
                icon.classList.remove("fas");
                icon.classList.add("far");
                icon.style.color = "";
                count--;
                countSpan.textContent = count;
            }
        });
    });
    
    // Reply button functionality
    const replyBtns = document.querySelectorAll(".reply-btn");
    replyBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const replyForm = document.querySelector(".reply-form-container");
            replyForm.scrollIntoView({ behavior: "smooth" });
            document.getElementById("replyContent").focus();
        });
    });
    
    // Share button functionality
    const shareBtns = document.querySelectorAll(".share-btn");
    shareBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            navigator.clipboard.writeText(window.location.href);
            showNotification("Link copied to clipboard!", "success");
        });
    });
    
    // Reply form submission
    const replyForm = document.getElementById("replyForm");
    if (replyForm) {
        replyForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const content = document.getElementById("replyContent").value.trim();
            
            if (!content) {
                showNotification("Please enter a reply", "error");
                return;
            }
            
            showNotification("Your reply has been posted!", "success");
            replyForm.reset();
            
            // In a real app, you'd save this to the server
        });
    }
});

function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}