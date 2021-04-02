var dataTableHandle;
$(document).ready( function () {
    // initialize the datatable
    dataTableHandle = $('#grocList').DataTable({
        "columnDefs": [
            //disabel sorting for the remove button column
            { "orderable": false, "targets": [0,3] },
            //add class to center the buttons of the remove button column
            { "className": "text_align_center", "targets": [ 3 ] }
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

//Variables for modal 
var groceryItemInputElement = $('#grocery-item-input');
var expirationDateInputElement = $('#expiration-date-input');  
var submitGroceryItemElement = $('#submit-grocery-item');

var grocCheckboxes = $(".grocCheckbox");

//Test button used to fetch sample data from the API
var testButton = $('#test-button');

var recipeListElement = $('#recipe-list');

//Function for adding a new grocery item
function addGroceryItem(event) { 

    //Create new item to store inputted values
    let newItem = {
        "label":'',
        "expirationDate":'',
        "id":''
    }

    //Add inputs from modal fields    
    newItem.label = groceryItemInputElement.val();
    newItem.expirationDate = expirationDateInputElement.val();
    
    //Get unix code momentjs
    let newId = moment().format('X');
    newItem.id = newId;

    //Reset input values
    groceryItemInputElement.val('');
    expirationDateInputElement.val('');

    //Add new item to array
    groceryItemArray.push(newItem);

    //Add row to table
    addRow(newItem);
    

    //Console log to view
    console.log(newItem);
    console.log(groceryItemArray);

    //Add items to local storage
    localStorage.setItem("groceryItemArray", JSON.stringify(groceryItemArray));

}

function addRow(newItem) {
    //creating the remove button elements of the row
    let newButton = $(document.createElement('td'))
    let aTag = $(document.createElement('a'));
    let iTag = $(document.createElement('i'));
    
    //setting button attributes
    aTag.addClass('delete_grocery');
    aTag.attr('href','#');
    aTag.attr('data-id', newItem.id);
    iTag.addClass('far fa-window-close fa-w-16 fa-2x');
    
    // Assemble tags
    aTag.append(iTag);
    newButton.append(aTag);

    //set a handle for the new row, added the .html() to the generated button tag, .node() to create a node of the row
    var newRow = dataTableHandle.row.add(["hi",newItem.label, newItem.expirationDate, newButton.html()]).draw().node();

    // adding the id to the generated tr element
    $(newRow).attr('id','item_' + newItem.id);
}




//create function to fill data table
 function fillList () {
     var storedFood = JSON.parse(localStorage.getItem('groceryItemArray'));
     console.log(storedFood.length);
     for (var i =0; i < storedFood.length; i++)
     {
     newItem = storedFood[i];
     addRow(newItem);
     groceryItemArray.push(newItem);
    }
  }



function createRecipeCards(recipes) {
    recipes.forEach(element => {
        let recipeCard = createRecipeCard(element.recipe);
    });    
}

function createRecipeCard(recipe) {
    //Create html element
    let recipeCard = $('<div class="col s12 m7"><div class="card horizontal"><div class="card-image"><img src="'+recipe.image+'"></div><div class="card-stacked"><div class="card-content"><p>'+recipe.label+'</p></div><div class="card-action"></div><a href="#">This is a link</a></div></div></div></div>)');

    recipeListElement.append(recipeCard)
}



//Event handling for "Submit" button in New Item menu
submitGroceryItemElement.click(addGroceryItem);

testButton.click(function (params) {
    var requestUrl = 'https://api.edamam.com/search?q=chicken+spinach&app_id=03d33e60&app_key=82cdeff85835203474becaab930c556c&from=0&to=5&calories=591-722&health=alcohol-free';

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

    //-----Delete row from data table-----
    dataTableHandle.row($(this).parents('tr')).remove().draw();

    //-----Delete entry from current grocery item array-----

    //Get Id from selected element by accessing the data attribute
    let removeId = $(this).data('id');

    //Check for item with matching id in the current grocery array, remove if id matches the id of the clicked row element
    for (let index = 0; index < groceryItemArray.length; index++) {
        const element = groceryItemArray[index];

        //Check if id's match
        if(+element.id === removeId){
            //Remove using splice method             
            groceryItemArray.splice(index,1)
        }
    }

    //-----Update local storage-----
    localStorage.setItem("groceryItemArray", JSON.stringify(groceryItemArray));

})




