var dataTableHandle;
var selectedGroceries = [];
var requestUrl;
$(document).ready( function () {
    // initialize the datatable
    dataTableHandle = $('#grocList').DataTable({
        //sorting by date column
        "order": [[ 2, "desc" ]],
        "columnDefs": [
            //disabel sorting for the remove and checkbox column
            { "orderable": false, "targets": [0,3] },
            //add class to center remove and checkbox column
            { "className": "text_align_center", "targets": [ 0,3 ] }
        ]
    });
    //Call the fillList function to populate the datatable from local storage
    fillList();
    //Initialize the modal window (New Item Window)
    $('.modal').modal();  

} );


//Array for storing current grocery entries
var groceryItemArray = [];

//Variables for grocery table
var groceryTableListElement = $("#grocery-table")

//Varaibles for "New Item" button
var newItemButtonElement = $("#new-item-button");
var newItemFormElement = $('#new-item-modal');

//reset Form 
newItemButtonElement.on("click",function(){
    groceryItemInputElement.val('');
    expirationDateInputElement.val('');  
    $("#modal_title").text("New Ingredient");
});


//Variables for modal 
var groceryItemInputElement = $('#grocery-item-input');
var expirationDateInputElement = $('.datepicker');  
var submitGroceryItemElement = $('#submit-grocery-item');


//Test button used to fetch sample data from the API
var generateRecipesButton = $('#generate-recipes-button');

var recipeListElement = $('#recipe-list');

// Initalize the date picker set format to day month year and to auto close when date is selected
$('.datepicker').datepicker({
    container: '.datecont',
    format:'dd-mm-yyyy',
    autoClose: true,  
});

//Function for adding/updating grocery items
function addGroceryItem(event) { 
    //Create new item to store inputted values
    var newItem;
    var obj_id = newItemFormElement.data("editing")
    existing_check = getIndexFromGroceryItemId(obj_id);
    if(existing_check !== null){
        //get the existing item from the array
        newItem = groceryItemArray[existing_check]
        //update item
        newItem.label = groceryItemInputElement.val();
        newItem.expirationDate = expirationDateInputElement.val();
        //update_table
        $("#ingl_"+obj_id).text(newItem.label)
        $("#ingex_"+obj_id).text(newItem.expirationDate)
        //remove old item
        remove_from_storage(obj_id);
         //push the new item to the array to be added to the localStorage
        groceryItemArray.push(newItem);
    }else{
        newItem = {
        "label":'',
        "expirationDate":'',
        "id":''
        }
        //Add inputs from modal fields    
        newItem.label = groceryItemInputElement.val();
        newItem.expirationDate = expirationDateInputElement.val();
        let newId = moment().format('X');
        newItem.id = newId;

        //Add new item to array
        groceryItemArray.push(newItem);

        //Add row to table
        addRow(newItem);
    }

    groceryItemInputElement.val('');
    expirationDateInputElement.val('');
  
    //Add items to local storage
    localStorage.setItem("groceryItemArray", JSON.stringify(groceryItemArray));

}

function addRow(newItem) {
    //creating the remove button elements of the row
    let newButton = $(document.createElement('td'))
    let newLabel = $(document.createElement('td'))
    let aTag = $(document.createElement('a'));
    let iTag = $(document.createElement('i'));
    //create the checkbox for selecting ingrediants
    let checkboxLabel = $(document.createElement('label'))
    let checkboxInput = $(document.createElement('input')).addClass("grocCheckbox");
    let emptySpan = $(document.createElement('span'));
    checkboxInput.attr({
        "id":"check_"+newItem.id,
        "data-groceryname":newItem.label,
        "checked":"checked",
        "type":"checkbox"
    });
    checkboxLabel.append(checkboxInput,emptySpan);
    newLabel.append(checkboxLabel);
    
    //setting button attributes
    aTag.addClass('delete_grocery');
    aTag.attr('href','#');
    aTag.attr('data-id', newItem.id);
    iTag.addClass('far fa-window-close fa-w-16 fa-2x');
    
    // Assemble tags
    aTag.append(iTag);
    newButton.append(aTag);
    newButton.append('&nbsp;&nbsp;<a data-target="new-item-modal" class="edit_grocery modal-trigger" href="#" data-id="'+newItem.id+'"><i class="far fa-edit fa-w-16 fa-2x"></i></a>');
   
    // push the new label to the array of selected groceries
    selectedGroceries.push(newItem.label);
    //set a handle for the new row, added the .html() to the generated button tag, .node() to create a node of the row
    var newRow = dataTableHandle.row.add(
        [newLabel.html(),
        '<span id="ingl_'+newItem.id+'">'+newItem.label+'</span>',
        '<span id="ingex_'+newItem.id+'">'+newItem.expirationDate+'</span>', 
        newButton.html()]
        ).draw().node();

    // adding the id to the generated tr element
    $(newRow).attr('id','item_' + newItem.id);
}




//create function to fill data table
 function fillList () {
    var storedFood = JSON.parse(localStorage.getItem('groceryItemArray'));
    if(storedFood){
        for (var i =0; i < storedFood.length; i++){
            newItem = storedFood[i];
            addRow(newItem);
            groceryItemArray.push(newItem);
        }   
    }
}

//Helper function to return the groceryItemArray index of the element with the matching id
function getIndexFromGroceryItemId(groceryItemId){
    let targetIndex = -1;

    //Check for item with matching id in the current grocery array
    for (let i = 0; i < groceryItemArray.length; i++) {
        const element = groceryItemArray[i];

        //Check if id's match
        if(+element.id === groceryItemId){
            //If they do match, get the index
            targetIndex = i;
        }
    }

    //Check if the target index exists.If it does, return it. Otherwise, return null.
    if(targetIndex === -1){
        return null;
    }else{
        return targetIndex;
    }
}


// helper function to handle removal of the item from the selelcted list when checkmark is unchecked and the button to remove the item is pressed
function removeFromSelectedList(object){
    //itterate over not just last seen but the entire array in case grocery is repeated
    for( var i = 0; i < selectedGroceries.length; i++){ 
        //using splice to remove the objects based on the grocery name from the selectedGroceries array
        if ( selectedGroceries[i] === object.data("groceryname")) { 
            selectedGroceries.splice(i, 1); 
          i--; 
        }}
    console.log(selectedGroceries);
}


//handle check and uncheck select checkbox events
$("body").on('click',".grocCheckbox", function(){
    //on change if this checkbox is checked
    if ($(this).is(':checked')){
        //add the item to the array of selectedGroceries
        selectedGroceries.push($(this).data("groceryname"));
        console.log(selectedGroceries);
    }else{
        // remove item from the array of selectedGroceries
        removeFromSelectedList($(this));
    }
});

//edit gorceries
$("body").on("click", ".edit_grocery", function(){
    var grocId = $(this).data("id");
    $("#expiration-date-input").val($("#ingex_"+grocId).text());
    $("#grocery-item-input").val($("#ingl_"+grocId).text());
    $("#modal_title").text($("#ingl_"+grocId).text());
    $("#new-item-modal").attr("data-editing",grocId);
});

function createRecipeCards(recipes) {
    //First, reset html content 
    recipeListElement.html('');

    recipes.forEach(element => {
        let recipeCard = createRecipeCard(element.recipe);
    });    
}

function createRecipeCard(recipe) {
    //Get ingredients
    let ingredientsArray = [];
    
    //Get all ingreients and add them to the array
    recipe.ingredients.forEach(element => {
        ingredientsArray.push(element.text);
    });

    //Create ingredients list element
    let ingredientList = $(document.createElement('ul'));

    //Add items to ingredient list using array
    ingredientsArray.forEach(element => {
        let ingredientItem =  $(document.createElement("li"));

        ingredientItem.text(element);

        ingredientList.append(ingredientItem);
        
    });

    console.log(ingredientList)

    //Create html element
    let recipeCard = $('<div class="col s12 m7"><div class="card horizontal"><div class="card-image"><img src="'+recipe.image+'"></div><div class="card-stacked"><div class="card-content"><h5>'+recipe.label+'</h5><p>Servings: '+recipe.yield+'</p>Ingredients:<div class="recipe_ingredient_list"> '+ingredientList.html()+'</div></div><div class="card-link card-footer"><a href="'+recipe.url+'" target="_blank" style="color: slateblue"><i class="material-icons">link</i><span>View Recipe</span></a><button class="waves-effect waves-light btn deep-purple recipe-save-button"><i class="material-icons">add</i>Save Recipe</div></div></div></div></div>)');    

    
    //Append to the current recipe list
    recipeListElement.append(recipeCard)
}



//Event handling for "Submit" button in New Item menu
submitGroceryItemElement.click(addGroceryItem);

//remove object from the localstorage
function remove_from_storage(removeId){
    let index = getIndexFromGroceryItemId(removeId);

    if(index !== null){
        //Remove using splice method             
        groceryItemArray.splice(index,1)
        //-----Update local storage-----
        localStorage.setItem("groceryItemArray", JSON.stringify(groceryItemArray));
    }else{
        console.error('TARGET INDEX NOT FOUND IN GROCERY ITEMS ARRAY')
    }
}


generateRecipesButton.click(function (params) {
    //finaly set the requestUrl with the new selected options
    console.log(selectedGroceries);
    requestUrl = 'https://api.edamam.com/search?q='+selectedGroceries.join("+")+'&app_id=03d33e60&app_key=82cdeff85835203474becaab930c556c&from=0&to=5&calories=591-722&health=alcohol-free'; 
    
    fetch(requestUrl, {
        // The browser fetches the resource from the remote server without first looking in the cache.
        // The browser will then update the cache with the downloaded resource.
        cache: 'reload',
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            createRecipeCards(data.hits);
    });
});

//Event delegation for removing rows from the data table
$('#grocList').on('click', ".delete_grocery", function(){
    //Get Id from selected element by accessing the data attribute
    let removeId = $(this).data('id');

    // first remove item from the selected List
    removeFromSelectedList($("#check_"+removeId))

    //-----Delete row from data table-----
    dataTableHandle.row($(this).parents('tr')).remove().draw();

    //-----Delete entry from current grocery item array-----


    remove_from_storage(removeId);

})

//Event delegation for saving recipes to localstorage







