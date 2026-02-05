(() => {

  /* ------------------ STATE ------------------ */

  const recipes = [
    {
      id:1,
      title:"Veg Pasta",
      type:"veg",
      description:"Creamy delicious pasta",
      ingredients:["pasta","cream","tomato","cheese"],
      steps:["Boil pasta","Prepare sauce","Mix together"]
    },
    {
      id:2,
      title:"Chicken Curry",
      type:"nonveg",
      description:"Spicy Indian curry",
      ingredients:["chicken","onion","spices","tomato"],
      steps:["Fry onion","Add chicken","Cook with spices"]
    },
    {
      id:3,
      title:"Paneer Butter Masala",
      type:"veg",
      description:"Rich paneer gravy",
      ingredients:["paneer","butter","tomato","cream"],
      steps:["Prepare gravy","Add paneer","Simmer"]
    }
  ];

  let currentFilter = "all";
  let currentSort = "default";
  let searchQuery = "";

  let favorites = JSON.parse(localStorage.getItem("recipeFavorites")) || [];

  let debounceTimer;

  /* ------------------ DOM ------------------ */

  const recipeContainer = document.querySelector("#recipe-container");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const sortSelect = document.querySelector("#sort-select");
  const searchInput = document.querySelector("#search-input");
  const clearSearchBtn = document.querySelector("#clear-search");
  const recipeCounter = document.querySelector("#recipe-counter");

  /* ------------------ UI ------------------ */

  const createRecipeCard = recipe => {
    const isFav = favorites.includes(recipe.id);

    return `
      <div class="recipe-card">
        <span class="favorite-btn ${isFav ? "active":""}" 
              data-recipe-id="${recipe.id}">❤️</span>

        <h3>${recipe.title}</h3>
        <p>${recipe.description}</p>

        <p class="toggle" data-toggle="ingredients">Show Ingredients</p>
        <ul class="hidden">
          ${recipe.ingredients.map(i=>`<li>${i}</li>`).join("")}
        </ul>

        <p class="toggle" data-toggle="steps">Show Steps</p>
        <ol class="hidden">
          ${recipe.steps.map(s=>`<li>${s}</li>`).join("")}
        </ol>
      </div>
    `;
  };

  const renderRecipes = list => {
    recipeContainer.innerHTML = list.map(createRecipeCard).join("");
  };

  const updateCounter = shown => {
    recipeCounter.textContent = `Showing ${shown} of ${recipes.length} recipes`;
  };

  /* ------------------ FILTERS ------------------ */

  const searchFilter = list => {
    if(!searchQuery) return list;

    const q = searchQuery.toLowerCase();

    return list.filter(r => {
      const titleMatch = r.title.toLowerCase().includes(q);
      const ingredientMatch = r.ingredients.some(i =>
        i.toLowerCase().includes(q)
      );
      const descriptionMatch = r.description.toLowerCase().includes(q);

      return titleMatch || ingredientMatch || descriptionMatch;
    });
  };

  const applyFilter = list => {
    if(currentFilter === "veg") return list.filter(r=>r.type==="veg");
    if(currentFilter === "nonveg") return list.filter(r=>r.type==="nonveg");
    if(currentFilter === "favorites") return list.filter(r=>favorites.includes(r.id));
    return list;
  };

  const applySort = list => {
    if(currentSort === "az") return [...list].sort((a,b)=>a.title.localeCompare(b.title));
    if(currentSort === "za") return [...list].sort((a,b)=>b.title.localeCompare(a.title));
    return list;
  };

  /* ------------------ DISPLAY PIPELINE ------------------ */

  const updateDisplay = () => {
    let result = searchFilter(recipes);
    result = applyFilter(result);
    result = applySort(result);

    updateCounter(result.length);
    renderRecipes(result);
  };

  /* ------------------ FAVORITES ------------------ */

  const toggleFavorite = id => {
    if(favorites.includes(id)){
      favorites = favorites.filter(f => f !== id);
    } else {
      favorites.push(id);
    }

    localStorage.setItem("recipeFavorites", JSON.stringify(favorites));
    updateDisplay();
  };

  /* ------------------ EVENTS ------------------ */

  filterButtons.forEach(btn=>{
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      updateDisplay();
    });
  });

  sortSelect.addEventListener("change", e => {
    currentSort = e.target.value;
    updateDisplay();
  });

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);

    clearSearchBtn.style.display = "inline";

    debounceTimer = setTimeout(() => {
      searchQuery = searchInput.value.trim();
      updateDisplay();
    }, 300);
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    clearSearchBtn.style.display = "none";
    updateDisplay();
  });

  recipeContainer.addEventListener("click", e => {

    if(e.target.classList.contains("favorite-btn")){
      toggleFavorite(Number(e.target.dataset.recipeId));
    }

    if(e.target.classList.contains("toggle")){
      const list = e.target.nextElementSibling;
      list.classList.toggle("hidden");
    }
  });

  /* ------------------ INIT ------------------ */

  const init = () => {
    console.log("RecipeJS App Loaded 🚀");
    updateDisplay();
  };

  init();

})();
