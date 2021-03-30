$(document).ready( function () {
    $('#grocList').DataTable();
    $('.modal').modal();  
} );

//Array for storing current grocery entries
var groceryItemArray = [];

var newItemButtonElement = $("#new-item-button");
var newItemFormElement = $('#new-item-modal');

//Variables for modal 
var groceryItemInputElement = $('#grocery-item-input');
var expirationDateInputElement = $('#expiration-date-input');  
var submitGroceryItemElement = $('#submit-grocery-item'); 


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
}

submitGroceryItemElement.click(addGroceryItem);