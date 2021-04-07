var favouriteRecipesArray = [];
$(document).ready( function () {
    //Call getFavourites() to get stored favourite recipes in local storage
    getFavouritesForList(); 
    displayFavourites();
});

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

        //Add remove button 
        let removeButtonElement = $(document.createElement('button'));
        removeButtonElement.addClass('btn red recipe-remove-button');
        removeButtonElement.text("Remove")
        recipeCard.find(".card-footer").append(removeButtonElement);

        let recipeContainer = $(document.createElement('div'));

        recipeContainer.addClass("card horizontal");

        recipeContainer.append(recipeCard);
        
        favouritesListElement.append(recipeContainer);
    });
}

favouritesListElement.on('click', '.recipe-remove-button', function(){
    let cardHandle = $(this).parent().parent().parent();

    let recipeId = cardHandle.find('h5').text();

    //Remove item from favourites list
    for (let i = 0; i < favouriteRecipesArray.length; i++) {
        const element = favouriteRecipesArray[i];
        
        if(element.id.localeCompare(recipeId)===0){
            favouriteRecipesArray.splice(i,1);
            localStorage.setItem("favouriteRecipesArray", JSON.stringify(favouriteRecipesArray));
        }
    }



    cardHandle.remove();
})

