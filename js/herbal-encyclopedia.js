/* ============================================
   RafaMall - Herbal Encyclopedia JavaScript
   African Medicinal Plants Database
   ============================================ */

// Plants Database - Ghanaian & African Medicinal Plants
const plantsData = [
    {
        id: "moringa",
        name: "Moringa",
        scientific: "Moringa oleifera",
        localNames: ["Zogale (Hausa)", "Gawara (Hausa)", "Ewe Igbale (Yoruba)", "Moringa (English)"],
        category: ["immune", "nutrition", "popular"],
        region: "ghana",
        description: "The 'Miracle Tree' is one of Africa's most valuable medicinal plants. Every part has healing properties - leaves, seeds, bark, and roots.",
        benefits: "Rich in vitamins A, C, and E, calcium, potassium, and protein. Boosts immune system, anti-inflammatory, supports heart health.",
        uses: [
            "Leaves: Used in soups and teas for nutrition and energy",
            "Seeds: Purify water and support digestion",
            "Oil: Used for skin and hair care",
            "Root: Traditional remedy for inflammation"
        ],
        preparation: "Leaves can be dried and powdered, added to food, or brewed as tea. Seeds can be eaten raw or roasted.",
        precautions: "Avoid during pregnancy. Consult herbalist before use if taking medication.",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Moringa",
        traditionalUse: "Used for centuries in Ghana and across West Africa for malnutrition, inflammation, and as a general tonic."
    },
    {
        id: "neem",
        name: "Neem",
        scientific: "Azadirachta indica",
        localNames: ["Dogon Yaro (Hausa)", "Bakain (Hausa)", "Neem Tree"],
        category: ["skin", "immune", "malaria", "popular"],
        region: "ghana",
        description: "The 'Village Pharmacy' - every part of the neem tree has medicinal properties used for thousands of years.",
        benefits: "Antibacterial, antifungal, antiviral. Supports skin health, dental care, and immune function.",
        uses: [
            "Leaves: Used for skin conditions, malaria prevention",
            "Bark: Dental care and oral health",
            "Oil: Skin conditions, hair care",
            "Seeds: Natural insect repellent"
        ],
        preparation: "Leaves boiled for tea or baths. Oil applied topically. Chew fresh twigs for dental care.",
        precautions: "May cause stomach upset if taken in large quantities. Not recommended during pregnancy.",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Neem",
        traditionalUse: "Known as the 'Village Pharmacy' across West Africa, used for malaria, skin diseases, and as a natural pesticide."
    },
    {
        id: "mistletoe",
        name: "African Mistletoe",
        scientific: "Viscum album",
        localNames: ["Afoma (Igbo)", "Alubarika (Yoruba)", "Mistletoe"],
        category: ["stress", "immune", "popular"],
        region: "west-africa",
        description: "A parasitic plant that grows on trees, highly valued in traditional medicine for its healing properties.",
        benefits: "Lowers blood pressure, supports heart health, anti-diabetic properties, immune modulator.",
        uses: [
            "Leaves: Used for hypertension and diabetes",
            "Whole plant: Immune support",
            "Preparations: Tea, tincture, powder"
        ],
        preparation: "Dried leaves steeped as tea. Can be used in tinctures or capsules.",
        precautions: "Consult healthcare provider if taking blood pressure medication. Use under professional guidance.",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Mistletoe",
        traditionalUse: "Used by traditional healers in Ghana and Nigeria for hypertension, diabetes, and as a general tonic."
    },
    {
        id: "ginger",
        name: "Ginger",
        scientific: "Zingiber officinale",
        localNames: ["Citta (Hausa)", "Ata ile (Yoruba)", "Jinja (Igbo)"],
        category: ["digestive", "respiratory", "popular"],
        region: "ghana",
        description: "A flowering plant whose rhizome is widely used as a spice and folk medicine across Africa.",
        benefits: "Anti-inflammatory, anti-nausea, digestive aid, immune support, pain relief.",
        uses: [
            "Fresh root: Tea for colds and nausea",
            "Dried powder: Cooking and medicine",
            "Compress: For joint pain",
            "Inhalation: For respiratory congestion"
        ],
        preparation: "Fresh root grated and boiled for tea. Dried powder used in food or capsules.",
        precautions: "May interact with blood thinners. Avoid large amounts during pregnancy.",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Ginger",
        traditionalUse: "Used across West Africa for digestive issues, colds, and as a warming remedy."
    },
    {
        id: "mint",
        name: "Peppermint",
        scientific: "Mentha piperita",
        localNames: ["Na'ana (Hausa)", "Ewe minti (Yoruba)"],
        category: ["digestive", "respiratory", "stress"],
        region: "ghana",
        description: "A hybrid mint plant known for its cooling properties and digestive benefits.",
        benefits: "Relieves indigestion, reduces nausea, soothes headaches, clears respiratory congestion.",
        uses: [
            "Leaves: Tea for digestion and stress",
            "Oil: Aromatherapy and topical application",
            "Fresh leaves: Culinary use"
        ],
        preparation: "Fresh or dried leaves steeped in hot water for tea. Essential oil diluted for topical use.",
        precautions: "Essential oil should be diluted. Not for internal use in high doses.",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Mint",
        traditionalUse: "Used in Ghanaian households for stomach upset, headaches, and as a refreshing beverage."
    },
    {
        id: "bitter-leaf",
        name: "Bitter Leaf",
        scientific: "Vernonia amygdalina",
        localNames: ["Ewuro (Yoruba)", "Onugbu (Igbo)", "Shuwaka (Hausa)"],
        category: ["digestive", "malaria", "immune"],
        region: "west-africa",
        description: "A bitter-tasting shrub highly valued in West African traditional medicine for its potent healing properties.",
        benefits: "Anti-malarial, digestive aid, liver support, blood sugar regulation, immune booster.",
        uses: [
            "Leaves: Steamed for soups, juice for medicine",
            "Roots: Traditional remedies",
            "Extract: For digestive health"
        ],
        preparation: "Leaves washed, squeezed to remove bitterness, then cooked in soups or juiced.",
        precautions: "May cause stomach upset in sensitive individuals. Use in moderation.",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Bitter+Leaf",
        traditionalUse: "A staple in Nigerian and Ghanaian traditional medicine for malaria, digestive issues, and detoxification."
    },
    {
        id: "moringa-2",
        name: "Moringa",
        scientific: "Moringa oleifera",
        localNames: ["Zogale", "Gawara", "Ewe Igbale"],
        category: ["immune", "nutrition", "popular"],
        region: "ghana",
        description: "The 'Miracle Tree' - leaves, seeds, and bark all have medicinal properties.",
        benefits: "Rich in vitamins, minerals, and antioxidants. Boosts immunity and energy.",
        uses: ["Leaf powder in food", "Seed oil for skin", "Bark for inflammation"],
        preparation: "Leaves dried and powdered. Seeds pressed for oil.",
        precautions: "Avoid during pregnancy.",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Moringa",
        traditionalUse: "Used for centuries as a nutritional supplement and medicine."
    },
    {
        id: "baobab",
        name: "Baobab",
        scientific: "Adansonia digitata",
        localNames: ["Kuka (Hausa)", "Ose (Yoruba)", "Baobab Tree"],
        category: ["immune", "nutrition"],
        region: "west-africa",
        description: "The iconic African baobab tree produces nutrient-rich fruit pulp and leaves used for food and medicine.",
        benefits: "High in vitamin C, antioxidants, and fiber. Supports immune function and digestive health.",
        uses: [
            "Fruit pulp: Powder in drinks and food",
            "Leaves: Cooked as vegetable",
            "Bark: Traditional remedies"
        ],
        preparation: "Fruit pulp dried and powdered. Leaves cooked like spinach.",
        precautions: "Generally safe when consumed as food.",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Baobab",
        traditionalUse: "The 'Tree of Life' provides food, medicine, and materials across Africa."
    }
];

// State variables
let currentFilter = "all";
let currentSearch = "";
let currentCategory = "all";
let currentPage = 1;
let itemsPerPage = 9;

// Display plants grid
function displayPlants() {
    const grid = document.getElementById("plantsGrid");
    if (!grid) return;
    
    let filteredPlants = [...plantsData];
    
    // Apply category filter
    if (currentCategory !== "all") {
        filteredPlants = filteredPlants.filter(p => p.category.includes(currentCategory));
    }
    
    // Apply region filter
    if (currentFilter !== "all" && currentFilter !== "popular" && currentFilter !== "medicinal") {
        filteredPlants = filteredPlants.filter(p => p.region === currentFilter);
    } else if (currentFilter === "popular") {
        filteredPlants = filteredPlants.filter(p => p.category.includes("popular"));
    } else if (currentFilter === "medicinal") {
        filteredPlants = filteredPlants.filter(p => p.category.includes("immune") || p.category.includes("digestive"));
    }
    
    // Apply search
    if (currentSearch) {
        const searchLower = currentSearch.toLowerCase();
        filteredPlants = filteredPlants.filter(p => 
            p.name.toLowerCase().includes(searchLower) ||
            p.scientific.toLowerCase().includes(searchLower) ||
            p.localNames.some(name => name.toLowerCase().includes(searchLower)) ||
            p.benefits.toLowerCase().includes(searchLower)
        );
    }
    
    // Pagination
    const totalPages = Math.ceil(filteredPlants.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedPlants = filteredPlants.slice(start, start + itemsPerPage);
    
    // Show/hide load more button
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if (loadMoreBtn) {
        loadMoreBtn.style.display = currentPage >= totalPages ? "none" : "block";
    }
    
    if (paginatedPlants.length === 0) {
        grid.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px;">
                <i class="fas fa-leaf" style="font-size: 48px; color: var(--text-tertiary); margin-bottom: 16px;"></i>
                <h3>No plants found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = paginatedPlants.map(plant => `
        <div class="plant-card" data-id="${plant.id}">
            <div class="plant-image">
                <img src="${plant.image}" alt="${plant.name}" loading="lazy">
                <span class="plant-badge">${plant.region === "ghana" ? "Ghanaian" : "West African"}</span>
            </div>
            <div class="plant-info">
                <h3 class="plant-name">${plant.name}</h3>
                <div class="plant-scientific">${plant.scientific}</div>
                <div class="plant-local-name">${plant.localNames.slice(0, 2).join(" • ")}</div>
                <p class="plant-description">${plant.description.substring(0, 100)}...</p>
                <div class="plant-uses">
                    ${plant.category.slice(0, 3).map(cat => `<span class="use-tag">${cat}</span>`).join("")}
                </div>
                <a href="#" class="view-details" data-id="${plant.id}">
                    View Details <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `).join("");
    
    // Add click listeners to view details links
    document.querySelectorAll(".view-details").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const plantId = link.dataset.id;
            openPlantModal(plantId);
        });
    });
    
    // Add click listeners to cards
    document.querySelectorAll(".plant-card").forEach(card => {
        card.addEventListener("click", (e) => {
            if (!e.target.closest(".view-details")) {
                const plantId = card.dataset.id;
                openPlantModal(plantId);
            }
        });
    });
}

// Open plant modal
function openPlantModal(plantId) {
    const plant = plantsData.find(p => p.id === plantId);
    if (!plant) return;
    
    const modal = document.getElementById("plantModal");
    const body = document.getElementById("plantDetailBody");
    
    body.innerHTML = `
        <div class="plant-detail">
            <div class="plant-detail-image">
                <img src="${plant.image}" alt="${plant.name}">
            </div>
            <div class="plant-detail-info">
                <h2>${plant.name}</h2>
                <div class="plant-detail-scientific">${plant.scientific}</div>
                <div class="plant-detail-local">${plant.localNames.join(" • ")}</div>
                
                <div class="plant-detail-section">
                    <h3><i class="fas fa-info-circle"></i> Description</h3>
                    <p>${plant.description}</p>
                </div>
                
                <div class="plant-detail-section">
                    <h3><i class="fas fa-heartbeat"></i> Health Benefits</h3>
                    <p>${plant.benefits}</p>
                </div>
                
                <div class="plant-detail-section">
                    <h3><i class="fas fa-mortar-pestle"></i> Traditional Uses</h3>
                    <ul>
                        ${plant.uses.map(use => `<li>${use}</li>`).join("")}
                    </ul>
                </div>
                
                <div class="plant-detail-section">
                    <h3><i class="fas fa-chalkboard-user"></i> Preparation Methods</h3>
                    <p>${plant.preparation}</p>
                </div>
                
                <div class="plant-detail-section">
                    <h3><i class="fas fa-exclamation-triangle"></i> Precautions</h3>
                    <p>${plant.precautions}</p>
                </div>
                
                <div class="plant-detail-section">
                    <h3><i class="fas fa-history"></i> Traditional Wisdom</h3>
                    <p>${plant.traditionalUse}</p>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

// Close plant modal
function closePlantModal() {
    const modal = document.getElementById("plantModal");
    modal.classList.remove("active");
    document.body.style.overflow = "";
}

// Load more plants
function loadMorePlants() {
    currentPage++;
    displayPlants();
}

// Setup search
function setupSearch() {
    const searchInput = document.getElementById("plantSearch");
    const searchBtn = document.getElementById("searchBtn");
    
    function performSearch() {
        currentSearch = searchInput.value.trim().toLowerCase();
        currentPage = 1;
        displayPlants();
    }
    
    searchBtn.addEventListener("click", performSearch);
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") performSearch();
    });
}

// Setup filters
function setupFilters() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            currentPage = 1;
            displayPlants();
        });
    });
}

// Setup category cards
function setupCategories() {
    const categoryCards = document.querySelectorAll(".category-card");
    categoryCards.forEach(card => {
        card.addEventListener("click", () => {
            const category = card.dataset.category;
            currentCategory = category;
            currentPage = 1;
            currentFilter = "all";
            
            // Reset active filter button
            document.querySelectorAll(".filter-btn").forEach(btn => {
                btn.classList.remove("active");
                if (btn.dataset.filter === "all") btn.classList.add("active");
            });
            
            displayPlants();
            
            // Scroll to plants section
            document.querySelector(".plants-section").scrollIntoView({ behavior: "smooth" });
        });
    });
}

// Setup newsletter
function setupNewsletter() {
    const form = document.getElementById("herbalNewsletter");
    if (!form) return;
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = form.querySelector("input").value;
        alert(`Thanks for subscribing! You'll receive herbal wisdom at ${email}`);
        form.reset();
    });
}

// Setup load more button
function setupLoadMore() {
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", loadMorePlants);
    }
}

// Setup modal close
function setupModal() {
    const closeBtn = document.getElementById("plantClose");
    const overlay = document.querySelector(".plant-overlay");
    
    if (closeBtn) closeBtn.addEventListener("click", closePlantModal);
    if (overlay) overlay.addEventListener("click", closePlantModal);
    
    document.addEventListener("keydown", (e) => {
        const modal = document.getElementById("plantModal");
        if (e.key === "Escape" && modal.classList.contains("active")) {
            closePlantModal();
        }
    });
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
    console.log("Herbal Encyclopedia loaded");
    displayPlants();
    setupSearch();
    setupFilters();
    setupCategories();
    setupNewsletter();
    setupLoadMore();
    setupModal();
    
    if (typeof updateCartCount === "function") updateCartCount();
    if (typeof Wishlist !== "undefined" && Wishlist.updateButtons) Wishlist.updateButtons();
});