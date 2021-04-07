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
        //Create container for recipe card
        let recipeContainer = $(document.createElement('div'));
        recipeContainer.addClass("card horizontal");
        
        //Get html content from favourited item
        let recipeCard = $(element.html);

        //---Add remove button to the recipe card---
        let removeButtonElement = $(document.createElement('button'));

        //Add styling for button 
        removeButtonElement.text('Remove');
        removeButtonElement.addClass('btn red remove-button');

        //Append to recipe card
        recipeCard.children('.card-footer').append(removeButtonElement);

        recipeContainer.append(recipeCard);
        
        favouritesListElement.append(recipeContainer);
    });
}

$('#favourites-list').on('click', ".remove-button", function(){
    let cardHandle = $(this).parent().parent().parent();
    
    //Remove recipe card from screen
    cardHandle.remove();

    //Get id from title
    let cardId = cardHandle.find('h5').text();

    for (let i = 0; i < favouriteRecipesArray.length; i++) {
        const element = favouriteRecipesArray[i];
        if(element.id === cardId){
            //Remove from array
            favouriteRecipesArray.splice(i,1);
            //Update Local Storage
            localStorage.setItem("favouriteRecipesArray", JSON.stringify(favouriteRecipesArray));
        }
    }
});
