var favouriteRecipesArray = [];
$(document).ready( function () {
    //Call getFavourites() to get stored favourite recipes in local storage
    getFavouritesForList(); 
    displayFavourites();
});

//Array for favourite recipes


//Variable for the recipe list
var favouritesListElement = $('#favourites-list');

function getFavouritesForList(){
    let storedFavourites = JSON.parse(localStorage.getItem('favouriteRecipesArray'));
    if(storedFavourites){
        for (let i = 0; i < storedFavourites.length; i++) {
            favouriteRecipesArray.push(storedFavourites[i]);
        }
    }
    console.log(favouriteRecipesArray);
}

function displayFavourites(){
    favouriteRecipesArray.forEach(element => {
        let recipeCard = $(element.html);
        let recipeContainer = $(document.createElement('div'));
        recipeContainer.addClass("card horizontal");
        recipeContainer.append(recipeCard);
        
        favouritesListElement.append(recipeContainer);
    });
}

