// Sample recipe data
const recipes = [
    {
        id: 1,
        title: "Steamed Cabbage",
        image: "images/steamed-cabbage.jpg",
        category: "healthy",
        time: "20 mins",
        servings: 3,
        calories: 150,
        ingredients: [
            "1 medium cabbage, chopped",
            "2 carrots, grated",
            "1 onion, sliced",
            "2 tbsp vegetable oil",
            "Salt and pepper to taste",
            "1 tsp garlic powder (optional)"
        ],
        instructions: [
            "Heat oil in a large pot over medium heat.",
            "Add onions and sauté until translucent.",
            "Add chopped cabbage and carrots, stirring to combine.",
            "Season with salt, pepper, and garlic powder.",
            "Cover and steam for about 10-15 minutes until tender.",
            "Serve hot as a side dish."
        ]
    },
    {
        id: 2,
        title: "Delicious Steamed Rice",
        image: "images/rice.jpg",
        category: "side",
        time: "20 mins",
        servings: 4,
        calories: 205,
        ingredients: [
            "1 cup white rice",
            "1 ½ cups water",
            "Salt to taste"
        ],
        instructions: [
            "Rinse the rice under cold water until the water runs clear.",
            "In a pot, combine rice, water, and salt.",
            "Bring to a boil over medium-high heat.",
            "Once boiling, reduce heat to low, cover, and simmer for 18-20 minutes.",
            "Remove from heat and let it sit covered for 5 minutes.",
            "Fluff with a fork and serve."
        ]
    },
    {
        id: 3,
        title: "Beef Stir Fry",
        image: "images/beef-stir-fry.jpg",
        category: "quick",
        time: "25 mins",
        servings: 4,
        calories: 420,
        ingredients: [
            "2 cups cooked rice",
            "1 cup thinly sliced beef",
            "1 onion, diced",
            "2 cloves garlic, minced",
            "1 cup frozen peas and carrots",
            "2 tbsp vegetable oil",
            "3 tbsp soy sauce"
        ],
        instructions: [
            "Heat oil in a large skillet over medium-high heat.",
            "Sauté onions and garlic until translucent.",
            "Add beef and cook until browned (3-4 mins).",
            "Stir in frozen peas and carrots (2-3 mins).",
            "Add cooked rice and sauces, stir to coat.",
            "Cook 2-3 more minutes until heated through."
        ]
    }
];

// Days for meal planner
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize meal planner
    initMealPlanner();
    
    // Load recipes
    loadRecipes();
    
    // Setup filter functionality
    setupFilters();
    
    // Setup share buttons
    setupShareButtons();
});

function initMealPlanner() {
    const planningGrid = document.querySelector('.planning-grid');
    
    days.forEach(day => {
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        dayCard.dataset.day = day.toLowerCase();
        
        dayCard.innerHTML = `
            <h4>${day}</h4>
            <p class="planned-meal">No meal planned</p>
        `;
        
        dayCard.addEventListener('click', function() {
            document.querySelectorAll('.day-card').forEach(card => {
                card.classList.remove('selected');
            });
            this.classList.add('selected');
        });
        
        planningGrid.appendChild(dayCard);
    });
    
    // Load saved meal plan from localStorage
    const mealPlan = JSON.parse(localStorage.getItem('mealPlan')) || {};
    Object.entries(mealPlan).forEach(([day, recipe]) => {
        const dayCard = document.querySelector(`.day-card[data-day="${day}"]`);
        if (dayCard) {
            dayCard.querySelector('.planned-meal').textContent = recipe;
        }
    });
}

function loadRecipes(filter = 'all') {
    const recipeContainer = document.querySelector('.recipe-cards');
    recipeContainer.innerHTML = '';
    
    const filteredRecipes = filter === 'all' 
        ? recipes 
        : recipes.filter(recipe => recipe.category === filter);
    
    filteredRecipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.dataset.id = recipe.id;
        
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="recipe-info">
                <h3>${recipe.title}</h3>
                <div class="recipe-meta">
                    <span><i class="fas fa-clock"></i> ${recipe.time}</span>
                    <span><i class="fas fa-fire"></i> ${recipe.calories} cal</span>
                    <span><i class="fas fa-users"></i> ${recipe.servings}</span>
                </div>
                <button class="btn add-to-plan">Add to Meal Plan</button>
                <div class="share-buttons">
                    <button class="share-btn" data-platform="twitter">Share on Twitter</button>
                    <button class="share-btn" data-platform="whatsapp">Share on WhatsApp</button>
                    <button class="share-btn" data-platform="facebook">Share on Facebook</button>
                    <button class="share-btn phone-share" onclick="shareViaPhone()">Share via Phone</button>
                </div>
            </div>
        `;
        
        // Add event listener for planning
        recipeCard.querySelector('.add-to-plan').addEventListener('click', function() {
            addToMealPlan(recipe.id);
        });
        
        recipeContainer.appendChild(recipeCard);
    });
}

function addToMealPlan(recipeId) {
    const selectedDay = document.querySelector('.day-card.selected');
    if (!selectedDay) {
        alert('Please select a day first!');
        return;
    }
    
    const recipe = recipes.find(r => r.id === recipeId);
    const day = selectedDay.dataset.day;
    
    selectedDay.querySelector('.planned-meal').textContent = recipe.title;
    
    // Save to localStorage
    const mealPlan = JSON.parse(localStorage.getItem('mealPlan')) || {};
    mealPlan[day] = recipe.title;
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
    
    alert(`${recipe.title} added to ${day.charAt(0).toUpperCase() + day.slice(1)}!`);
}

function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadRecipes(this.dataset.filter);
        });
    });
}

function setupShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function () {
            // If the browser supports navigator.share (mostly mobile browsers)
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    text: "Yo check this out! 🔥",
                    url: window.location.href,
                })
                .then(() => console.log('Shared successfully'))
                .catch(err => console.error('Error sharing:', err));
            } else {
                // Fallback: open platform-specific share links
                const platform = this.dataset.platform;
                const pageUrl = encodeURIComponent(window.location.href);
                const shareText = encodeURIComponent("Yo check this out!");

                let shareLink = '';

                if (platform === 'twitter') {
                    shareLink = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${shareText}`;
                } else if (platform === 'whatsapp') {
                    shareLink = `https://wa.me/?text=${shareText}%20${pageUrl}`;
                } else if (platform === 'facebook') {
                    shareLink = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
                } else {
                    alert('Sharing not supported for this platform yet. 😔');
                    return;
                }

                window.open(shareLink, '_blank');
            }
        });
    });
}

function shareViaPhone() {
    if (navigator.share) { // Check if Web Share API is supported
        const url = window.location.href;
        const text = "Check out this awesome recipe!";
        navigator.share({
            title: 'Beef Stir Fry Recipe',
            text: text,
            url: url,
        }).then(() => {
            console.log('Successfully shared!');
        }).catch((error) => {
            console.log('Error sharing:', error);
        });
    } else {
        alert("Your browser does not support native sharing. Please use another method.");
    }
}
