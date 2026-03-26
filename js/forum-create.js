/* ============================================
   RafaMall - Create Topic JavaScript
   Topic creation, tags, editor tools
   ============================================ */

let tags = [];

document.addEventListener("DOMContentLoaded", () => {
    console.log("Create topic page loaded");
    
    // Editor tools
    const editorBtns = document.querySelectorAll(".editor-btn");
    const textarea = document.getElementById("topicContent");
    
    editorBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const format = btn.dataset.format;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            
            if (format === "bold") {
                textarea.value = text.substring(0, start) + "**" + text.substring(start, end) + "**" + text.substring(end);
            } else if (format === "italic") {
                textarea.value = text.substring(0, start) + "*" + text.substring(start, end) + "*" + text.substring(end);
            } else if (format === "link") {
                const url = prompt("Enter URL:");
                if (url) {
                    textarea.value = text.substring(0, start) + "[" + text.substring(start, end) + "](" + url + ")" + text.substring(end);
                }
            } else if (format === "list") {
                textarea.value = text.substring(0, start) + "\n- Item 1\n- Item 2\n- Item 3\n" + text.substring(end);
            }
        });
    });
    
    // Tags functionality
    const addTagBtn = document.getElementById("addTagBtn");
    const tagInput = document.getElementById("tagInput");
    const tagsList = document.getElementById("tagsList");
    
    addTagBtn.addEventListener("click", () => {
        const tag = tagInput.value.trim().toLowerCase();
        
        if (!tag) return;
        if (tags.length >= 5) {
            showNotification("Maximum 5 tags allowed", "error");
            return;
        }
        if (tags.includes(tag)) {
            showNotification("Tag already added", "error");
            return;
        }
        
        tags.push(tag);
        updateTagsDisplay();
        tagInput.value = "";
    });
    
    tagInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTagBtn.click();
        }
    });
    
    function updateTagsDisplay() {
        tagsList.innerHTML = tags.map(tag => `
            <span class="tag">
                ${tag}
                <button onclick="removeTag('${tag}')">&times;</button>
            </span>
        `).join("");
    }
    
    window.removeTag = function(tag) {
        tags = tags.filter(t => t !== tag);
        updateTagsDisplay();
    };
    
    // Form submission
    const form = document.getElementById("createTopicForm");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const title = document.getElementById("topicTitle").value.trim();
        const category = document.getElementById("topicCategory").value;
        const content = document.getElementById("topicContent").value.trim();
        
        if (!title || title.length < 10) {
            showNotification("Title must be at least 10 characters", "error");
            return;
        }
        
        if (!category) {
            showNotification("Please select a category", "error");
            return;
        }
        
        if (!content || content.length < 20) {
            showNotification("Message must be at least 20 characters", "error");
            return;
        }
        
        if (!document.getElementById("termsAgree").checked) {
            showNotification("Please agree to the Community Guidelines", "error");
            return;
        }
        
        showNotification("Topic created successfully!", "success");
        
        // Redirect to forum page after 2 seconds
        setTimeout(() => {
            window.location.href = "forum.html";
        }, 2000);
    });
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