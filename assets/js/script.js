$(document).ready( function () {
    // initialize the datatable
    $('#grocList').DataTable({
        "columnDefs": [
            { "orderable": false, "targets": [2] }
        ]
    });
    //Initialize the modal window (New Item Window)
    $('.modal').modal();  
} );

//Array for storing current grocery entries
var groceryItemArray = [];

//Varaibles for "New Item" button
var newItemButtonElement = $("#new-item-button");
var newItemFormElement = $('#new-item-modal');

//Variables for modal 
var groceryItemInputElement = $('#grocery-item-input');
var expirationDateInputElement = $('#expiration-date-input');  
var submitGroceryItemElement = $('#submit-grocery-item'); 

//Function for adding a new grocery item
function addGroceryItem(event) { 
    //Create new item to store inputted values
    let newItem = {
        "label":'',
        "expirationDate":''
    }

    //Add inputs from modal fields    
    newItem.label = groceryItemInputElement.val();
    newItem.expirationDate = expirationDateInputElement.val();
    

    //Reset input values
    groceryItemInputElement.val('');
    expirationDateInputElement.val('');

    //Add new item to array
    groceryItemArray.push(newItem);
    
   

    //Console log to view
    console.log(newItem);
    console.log(groceryItemArray);

    //Add items to local storage
    localStorage.setItem("groceryItemArray", JSON.stringify(groceryItemArray));
}


// create function to fill data table
function fillList () {
    var storedFood = JSON.parse(localStorage.getItem('groceryItemArray'))

}
// create function to populate data table
function renderList(){
     for (var i =0; i < groceryItemArray.length; i++)
     var groceryItemArray=groceryItemArray[i]

}

//Event handling for "Submit" button in New Item menu
submitGroceryItemElement.click(addGroceryItem);